"use client";

export const dynamic = "force-dynamic";

import { Button } from "@/components/ui";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

type AuthMode = "login" | "register";

export default function LoginPage() {
  const searchParams = useSearchParams();
const plan = searchParams.get("plan") ?? null;
const hasPlan = plan === "pro" || plan === "business";
const [mode, setMode] = useState<AuthMode>(
  hasPlan || searchParams.get("mode") === "register" ? "register" : "login"
);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [supabaseConfigured, setSupabaseConfigured] = useState(true);
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const router = useRouter();
const [supabase, setSupabase] = useState<any>(null);

  // Destination after successful auth
  const postAuthRedirect = hasPlan
    ? `/onboarding/confirmar-plan?plan=${plan}`
    : "/dashboard";

  useEffect(() => {
    try {
      const client = createClient();
      setSupabase(client);
    } catch (err) {
      setSupabaseConfigured(false);
    }
  }, []);

  const handleGoogleSignIn = async () => {
    if (!supabase || !supabaseConfigured) {
      setError("Supabase no está configurado. Por favor, agrega las variables de entorno.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const callbackUrl = hasPlan
        ? `${window.location.origin}/auth/callback?plan=${plan}`
        : `${window.location.origin}/auth/callback`;

      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: callbackUrl },
      });

      if (signInError) throw signInError;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de autenticación");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase || !supabaseConfigured) {
      setError("Supabase no está configurado.");
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError("Por favor completá email y contraseña.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      if (mode === "login") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push(postAuthRedirect);
      } else {
  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback?plan=${plan ?? ""}`
    },
  });
  if (signUpError) throw signUpError;
  
  // Auto login después del registro
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (signInError) throw signInError;

  // Pequeño delay para asegurar que la sesión esté lista
  await new Promise(resolve => setTimeout(resolve, 500));
  
  router.push(postAuthRedirect);
}
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de autenticación");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-base px-4">
      <div className="flex flex-col items-center gap-6 w-full max-w-xs">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <Link href="/" className="flex items-center justify-center">
  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-bg-base">
      <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" />
      <path d="M12 22V12" />
      <path d="M4 7l8 5 8-5" />
    </svg>
  </div>
</Link>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-text-primary">RouteFlow</h1>
            <p className="text-sm text-text-muted mt-0.5">
              {hasPlan
                ? `Crear cuenta para plan ${plan === "pro" ? "Pro" : "Business"}`
                : "Crear cuenta / Iniciar sesión"}
            </p>
          </div>
        </div>

        {/* Plan badge */}
        {hasPlan && (
          <div className="w-full flex items-center gap-2 rounded-md border border-accent/30 bg-accent/10 px-3 py-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-accent" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xs text-accent font-medium">
              Plan <span className="font-semibold capitalize">{plan}</span> seleccionado
            </span>
          </div>
        )}

        {/* Mode toggle */}
        <div className="flex w-full rounded-md border border-border bg-bg-surface p-0.5">
          <button
            onClick={() => { setMode("login"); setError(null); }}
            className={[
              "flex-1 py-1.5 text-sm font-medium rounded transition-colors",
              mode === "login"
                ? "bg-bg-card text-text-primary shadow-sm"
                : "text-text-muted hover:text-text-primary",
            ].join(" ")}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => { setMode("register"); setError(null); }}
            className={[
              "flex-1 py-1.5 text-sm font-medium rounded transition-colors",
              mode === "register"
                ? "bg-bg-card text-text-primary shadow-sm"
                : "text-text-muted hover:text-text-primary",
            ].join(" ")}
          >
            Crear cuenta
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="w-full rounded-md bg-danger/10 border border-danger/30 p-3 text-sm text-danger">
            {error}
          </div>
        )}

        {!supabaseConfigured && (
          <div className="w-full rounded-md bg-danger/10 border border-danger/30 p-3 text-sm text-danger">
            Supabase no está configurado. Agrega las variables de entorno NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.
          </div>
        )}

        {/* Email / password form */}
        <form onSubmit={handleEmailAuth} className="flex flex-col gap-3 w-full">
          <Input
            label="Email"
            type="email"
            placeholder="tu@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
          />
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-1"
            loading={isLoading}
            disabled={isLoading}
          >
            {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-text-muted">o</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Google Sign In Button */}
        <Button
          onClick={handleGoogleSignIn}
          loading={isLoading}
          disabled={isLoading}
          variant="ghost"
          size="lg"
          className="w-full"
          iconLeft={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          }
        >
          Continuar con Google
        </Button>

        {/* Footer text */}
        <p className="text-xs text-text-muted text-center">
          Al continuar, aceptás nuestros{" "}
          <a href="#" className="underline hover:text-text-primary transition-colors">términos de servicio</a>
          {" "}y{" "}
          <a href="#" className="underline hover:text-text-primary transition-colors">política de privacidad</a>.
        </p>
      </div>
    </div>
  );
}
