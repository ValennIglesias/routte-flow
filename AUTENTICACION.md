# RouteFlow - Autenticación con Supabase + Google OAuth

Implementación de autenticación con Supabase y Google OAuth en Next.js App Router, siguiendo el design system existente de RouteFlow.

## Requisitos previos

- Node.js 18+
- Cuenta en Supabase (https://supabase.com)
- Proyecto Google Cloud con OAuth configurado

## Instalación

### 1. Dependencias
Las dependencias ya están instaladas:
```bash
npm install @supabase/supabase-js @supabase/ssr
```

### 2. Variables de entorno
Copia el archivo `.env.example` a `.env.local` y completa con tus credenciales:

```bash
cp .env.example .env.local
```

Dentro de `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

Para obtener estas credenciales:
1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a Settings → API
4. Copia la URL y la Anon Key

### 3. Configurar Google OAuth en Supabase

1. Ve a Supabase Dashboard → Authentication → Providers
2. Busca "Google" y haz clic en "Enable"
3. Configura el Redirect URL que Supabase proporciona en tu proyecto Google Cloud
4. En Google Cloud Console, agrega `{supabase-url}/auth/v1/callback?provider=google` como Authorized redirect URI

## Estructura de archivos

```
lib/supabase/
├── client.ts           # Cliente Supabase para componentes client-side
└── server.ts           # Cliente Supabase para Server Components y Route Handlers

app/
├── login/
│   ├── page.tsx        # Página de login con botón Google
│   └── layout.tsx      # Layout dinámico para login
├── dashboard/
│   ├── page.tsx        # Dashboard protegido con botón de logout
│   └── layout.tsx      # Layout dinámico para dashboard
├── auth/
│   └── callback/
│       └── route.ts    # Route Handler para intercambiar code por sesión
└── middleware.ts       # Middleware que protege rutas y maneja redirecciones

.env.example            # Template de variables de entorno
```

## Rutas protegidas

Las siguientes rutas requieren sesión activa:
- `/dashboard` - Dashboard principal
- `/ruta/[id]` - Detalles de ruta

### Comportamiento:
- ✅ Usuario sin sesión → Redirige a `/login`
- ✅ Usuario autenticado en `/login` → Redirige a `/dashboard`
- ✅ Usuario autenticado en rutas protegidas → Acceso permitido
- ✅ Al hacer logout → Redirige a `/login`

## Flujo de autenticación

1. **Usuario accede a `/login`** → Ve página con botón "Continuar con Google"
2. **Hace clic en el botón** → Se redirige a Google OAuth flow
3. **Google redirige a `/auth/callback?code=...`** → Route Handler intercambia el code por sesión
4. **Sesión establecida** → Redirige a `/dashboard`
5. **Usuario en dashboard** → Puede hacer logout desde el botón en el header

## Logout

En el dashboard (`/app/dashboard/page.tsx`) hay un botón "Cerrar sesión" en el header que:
1. Llama a `supabase.auth.signOut()`
2. Redirige a `/login`

## Desarrollo

```bash
npm run dev
```

Accede a http://localhost:3000. El middleware redirigirá automáticamente a `/login` si no estás autenticado.

## Build

```bash
npm run build
```

## Notas técnicas

- ✅ Usa `@supabase/ssr` en lugar de `@supabase/auth-helpers-nextjs` (deprecado)
- ✅ El middleware maneja refresh de sesión en cada request
- ✅ Las rutas dinámicas (`force-dynamic`) previenen prerendering de páginas que requieren env vars
- ✅ Respeta el design system existente de RouteFlow
- ✅ Sin modificaciones al design system original
- ✅ Manejo de errores cuando Supabase no está configurado

## Troubleshooting

### "Supabase no está configurado"
- Verifica que `.env.local` existe y tiene `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart el dev server: `npm run dev`

### Error de OAuth
- Verifica que el Redirect URL en Supabase coincide con tu dominio
- En desarrollo local: `http://localhost:3000`
- En producción: `https://tu-dominio.com`

### Sesión no persiste
- Verifica que las cookies están habilitadas en el navegador
- Revisa la pestaña Network en DevTools para ver si se envían las cookies
