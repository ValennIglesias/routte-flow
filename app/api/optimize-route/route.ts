import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

interface StopRow {
  direccion: string;
  localidad: string;
  zona: string;
}

interface Stop {
  order: number;
  address: string;
  localidad: string;
  lat: number;
  lng: number;
}

async function geocode(
  address: string,
  localidad?: string
): Promise<{ lat: number; lng: number } | null> {
  const fullAddress = localidad 
    ? `${address}, ${localidad}, Argentina`
    : `${address}, Argentina`;
  const query = encodeURIComponent(fullAddress);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${GOOGLE_MAPS_API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== "OK" || !data.results?.length) {
    return null;
  }

  const { lat, lng } = data.results[0].geometry.location;
  return { lat, lng };
}

export async function POST(request: NextRequest) {
  // Validate env var
  if (!GOOGLE_MAPS_API_KEY) {
    return NextResponse.json(
      { error: "La variable de entorno GOOGLE_MAPS_API_KEY no está configurada." },
      { status: 500 }
    );
  }

  // Parse FormData
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "No se pudo leer el cuerpo de la solicitud." },
      { status: 400 }
    );
  }

  const file = formData.get("file") as File | null;
  const zone = formData.get("zone") as string | null;
  const depot = formData.get("depot") as string | null;

  if (!file || !zone || !depot) {
    return NextResponse.json(
      { error: "Faltan campos requeridos: file, zone y depot son obligatorios." },
      { status: 400 }
    );
  }

  // Validate depot address contains a number
  if (!/\d/.test(depot)) {
    return NextResponse.json(
      { error: "La dirección del depósito debe incluir una altura numérica." },
      { status: 400 }
    );
  }

  // Validate file extension
  const fileName = file.name.toLowerCase();
  if (!fileName.endsWith(".csv") && !fileName.endsWith(".xls") && !fileName.endsWith(".xlsx")) {
    return NextResponse.json(
      { error: "El archivo debe ser CSV o Excel (.csv, .xls, .xlsx)." },
      { status: 400 }
    );
  }

  // Parse Excel/CSV with xlsx
  let rows: StopRow[];
  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const raw = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
      defval: "",
    });

    // Normalize column names to lowercase and trim
    rows = raw.map((row) => {
      const normalized: Record<string, string> = {};
      for (const key of Object.keys(row)) {
        normalized[key.trim().toLowerCase()] = String(row[key]).trim();
      }
      return {
        direccion: normalized["direccion"] ?? "",
        localidad: normalized["localidad"] ?? "",
        zona: normalized["zona"] ?? "",
      };
    });
  } catch {
    return NextResponse.json(
      { error: "No se pudo parsear el archivo. Verificá que tenga el formato correcto." },
      { status: 400 }
    );
  }

  // Filter by zone
  const filtered = rows.filter(
    (row) => row.zona.toLowerCase() === zone.toLowerCase() && row.direccion
  );

  if (filtered.length === 0) {
    return NextResponse.json(
      { error: `No se encontraron paradas para la zona "${zone}".` },
      { status: 400 }
    );
  }

  // Geocode depot
  let depotCoords: { lat: number; lng: number } | null;
  try {
    depotCoords = await geocode(depot, "");
  } catch {
    return NextResponse.json(
      { error: "Error al geocodificar el depósito. Verificá la dirección ingresada." },
      { status: 500 }
    );
  }

  if (!depotCoords) {
    return NextResponse.json(
      { error: `No se pudo geocodificar el depósito: "${depot}".` },
      { status: 500 }
    );
  }

  // Geocode each stop
  const geocodedStops: Array<StopRow & { lat: number; lng: number }> = [];
  for (const row of filtered) {
    const coords = await geocode(row.direccion, row.localidad);
    if (!coords) {
      console.warn(`[optimize-route] Warning: no se pudo geocodificar "${row.direccion}, ${row.localidad}". Se omite.`);
      continue;
    }
    geocodedStops.push({ ...row, ...coords });
  }

  if (geocodedStops.length === 0) {
    return NextResponse.json(
      { error: "No se pudo geocodificar ninguna parada. Verificá las direcciones en el archivo." },
      { status: 500 }
    );
  }

  // Call Directions API with optimizeWaypoints
  const waypointsParam = geocodedStops
    .map((s) => `${s.lat},${s.lng}`)
    .join("|");

  const directionsUrl =
    `https://maps.googleapis.com/maps/api/directions/json` +
    `?origin=${depotCoords.lat},${depotCoords.lng}` +
    `&destination=${depotCoords.lat},${depotCoords.lng}` +
    `&waypoints=optimize:true|${waypointsParam}` +
    `&key=${GOOGLE_MAPS_API_KEY}`;

  let waypointOrder: number[];
  try {
    const directionsRes = await fetch(directionsUrl);
    const directionsData = await directionsRes.json();

    if (directionsData.status !== "OK") {
      console.error("[optimize-route] Directions API error:", directionsData.status, directionsData.error_message);
      return NextResponse.json(
        {
          error: `Error en la API de Google Directions: ${directionsData.error_message ?? directionsData.status}`,
        },
        { status: 500 }
      );
    }

    waypointOrder = directionsData.routes[0].waypoint_order as number[];
  } catch {
    return NextResponse.json(
      { error: "Error al conectarse con la API de Google Directions." },
      { status: 500 }
    );
  }

  // Build ordered stops
  const stops: Stop[] = waypointOrder.map((originalIndex, i) => {
    const stop = geocodedStops[originalIndex];
    return {
      order: i + 1,
      address: stop.direccion,
      localidad: stop.localidad,
      lat: stop.lat,
      lng: stop.lng,
    };
  });

  return NextResponse.json({
    stops,
    total_stops: stops.length,
    zone,
  });
}
