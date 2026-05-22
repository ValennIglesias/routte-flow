# Ejemplos de uso - Autenticación en RouteFlow

## Login con Google

```tsx
// app/login/page.tsx - Ya implementado
import { Button } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <Button onClick={handleGoogleSignIn} variant="ghost">
      Continuar con Google
    </Button>
  );
}
```

## Obtener usuario autenticado en Server Component

```tsx
// app/dashboard/page.tsx - Example
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <p>Bienvenido, {user.email}</p>
    </div>
  );
}
```

## Obtener usuario en Client Component

```tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function UserProfile() {
  const [user, setUser] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, []);

  if (!user) return <p>Loading...</p>;

  return <p>Email: {user.email}</p>;
}
```

## Logout

```tsx
"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return <Button onClick={handleLogout} variant="ghost">
    Cerrar sesión
  </Button>;
}
```

## Proteger una ruta

El middleware ya protege automáticamente `/dashboard` y `/ruta/*`. Para agregar más rutas protegidas:

```tsx
// middleware.ts
const PROTECTED_ROUTES = ["/dashboard", "/ruta", "/admin"]; // Agregá "/admin"

if (isProtectedRoute && !user) {
  // Redirige a login si no hay sesión
  return NextResponse.redirect(url);
}
```

## Usar la sesión en Route Handlers

```tsx
// app/api/user/route.ts
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return Response.json({ user });
}
```

## Agregar más proveedores de OAuth

Supabase soporta múltiples proveedores. Para agregar GitHub, Facebook, etc:

```tsx
const { error } = await supabase.auth.signInWithOAuth({
  provider: "github", // o "facebook", "discord", etc.
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
  },
});
```

Luego habilitalos en Supabase Dashboard → Authentication → Providers.

## Configurar datos de usuario personalizado

```tsx
// Después del signin con OAuth, puedes guardar datos adicionales:
const { data, error } = await supabase
  .from("profiles")
  .insert({
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name,
  });
```

## Listening para cambios de autenticación

```tsx
"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function AuthListener() {
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth event:", event);
        console.log("Session:", session);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  return null;
}
```

## Estructura de datos recomendada para profiles

```sql
-- En Supabase, crea una tabla de perfiles:
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  company_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Habilita RLS:
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política para que users solo vean sus propios datos:
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);
```

## Testing localmente sin Supabase

Si no tienes variables de entorno configuradas, la app muestra un mensaje de error. Para testing rápido:

1. Agrega `.env.local` con:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
   ```

2. O modifica el componente de login temporalmente:
   ```tsx
   // Mock login para testing
   const handleGoogleSignIn = async () => {
     // Simula un login exitoso
     window.location.href = "/auth/callback?code=test_code";
   };
   ```
