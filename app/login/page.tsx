"use client";

export const dynamic = "force-dynamic";

import { Button } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supabaseConfigured, setSupabaseConfigured] = useState(true);
  const router = useRouter();
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    try {
      const client = createClient();
      setSupabase(client);
    } catch (err) {
      setSupabaseConfigured(false);
      console.error("[v0] Supabase not configured:", err);
    }
  }, []);

  const handleGoogleSignIn = async () => {
    if (!supabase || !supabaseConfigured) {
      setError(
        "Supabase no está configurado. Por favor, agrega las variables de entorno."
      );
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signInError) throw signInError;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error de autenticación";
      setError(errorMessage);
      console.error("[v0] Google sign-in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-base px-4">
      <div className="flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="flex items-center justify-center">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="8"
              y="8"
              width="24"
              height="24"
              rx="4"
              stroke="currentColor"
              strokeWidth="2"
              className="text-accent"
            />
            <path
              d="M20 16v8M16 20h8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="text-accent"
            />
          </svg>
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-medium text-text-primary mb-2">
            RouteFlow
          </h1>
          <p className="text-sm text-text-muted">
            Optimización de rutas logísticas
          </p>
        </div>

        {error && (
          <div className="w-full max-w-xs rounded-md bg-danger/10 border border-danger/30 p-3 text-sm text-danger">
            {error}
          </div>
        )}

        {!supabaseConfigured && (
          <div className="w-full max-w-xs rounded-md bg-danger/10 border border-danger/30 p-3 text-sm text-danger">
            Supabase no está configurado. Por favor, configura las variables de
            entorno NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.
          </div>
        )}

        {/* Google Sign In Button */}
        <Button
          onClick={handleGoogleSignIn}
          loading={isLoading}
          disabled={isLoading}
          variant="ghost"
          size="lg"
          className="w-full max-w-xs"
          iconLeft={
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          }
        >
          Continuar con Google
        </Button>
        

        {/* Footer text */}
        <p className="text-xs text-text-muted text-center max-w-xs">
          Al iniciar sesión, aceptas nuestros términos de servicio y política
          de privacidad.
        </p>
      </div>
    </div>
  );
}
