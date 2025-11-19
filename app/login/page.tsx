"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Eye,
  EyeOff,
  Wifi,
  Shield,
  Database,
  Activity,
} from "lucide-react";

import { useAuthStore } from "@/service/store/auth";

// shadcn
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/module-selection";

  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setErr(null);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email,
          password,
        }),
      });

      const ct = res.headers.get("content-type") || "";
      if (!res.ok) {
        const msg = ct.includes("application/json")
          ? (await res.json())?.message || "Credenciales inválidas"
          : "No se pudo iniciar sesión";
        setErr(msg);
        return;
      }

      if (!ct.includes("application/json")) {
        setErr("Respuesta inesperada del servidor.");
        return;
      }

      const { user } = await res.json();
      setAuth({ isAuth: true, profile: user });
      router.replace(next);
      router.refresh();
    } catch {
      setErr("Error de red. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // =============================
  //   UI COMPLETA VERDE PREMIUM
  // =============================
  return (
    <div className="min-h-screen flex bg-slate-50">

      {/* IZQUIERDA: Branding Verde Premium */}
      <div className="flex-1 p-12 text-white bg-gradient-to-br from-emerald-700 via-emerald-800 to-slate-900 relative overflow-hidden flex flex-col justify-between">

        {/* Círculos blur */}
        <div className="absolute top-20 left-20 w-48 h-48 rounded-full bg-emerald-500/20 blur-3xl"></div>
        <div className="absolute bottom-32 right-20 w-40 h-40 rounded-full bg-emerald-400/20 blur-2xl"></div>
        <div className="absolute top-1/3 right-48 w-52 h-52 rounded-full bg-emerald-300/10 blur-3xl"></div>

        {/* LOGO + TEXTOS */}
  <div className="relative z-10 space-y-6 animate-fade-in">

  {/* Branding principal */}
  <div className="flex items-center space-x-3">
    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
      <Activity className="w-6 h-6 text-white" />
    </div>
    <h1 className="text-4xl font-bold tracking-tight">
      ZidraScore
    </h1>
  </div>

  {/* Plataforma Inteligente */}
  <div className="space-y-2 max-w-md">
    <h2 className="text-3xl font-semibold text-white">
      Plataforma Inteligente
    </h2>

    {/* Descripción correcta */}
    <p className="text-emerald-100/90 text-lg leading-relaxed">
      IoT & GPS Monitoring en tiempo real para artefactos. 
      Rastreo seguro, preciso y centralizado.
    </p>
  </div>
</div>

        {/* Ilustración IoT minimal */}
        <div className="relative z-10 flex justify-center py-10 animate-float">
          <div className="w-64 h-40 rounded-2xl bg-slate-800 border border-emerald-600/30 shadow-xl p-6 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-3/4 h-1 bg-emerald-400/60 rounded"></div>
              <div className="w-2/3 h-1 bg-emerald-300/40 rounded"></div>
              <div className="w-1/2 h-1 bg-emerald-300/30 rounded"></div>
            </div>
            <div className="flex justify-between">
              <Wifi className="text-emerald-400 w-5 h-5" />
              <Shield className="text-emerald-300 w-5 h-5" />
              <Database className="text-emerald-300 w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* DERECHA: Tarjeta de Login */}
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-10 border border-slate-100 space-y-8 animate-slide-up">

          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-slate-800">
              Iniciar Sesión
            </h2>
            <p className="text-slate-500">
              Accede a tu plataforma de monitoreo y análisis
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {err && (
              <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
                {err}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-600 uppercase">
                Correo
              </Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="usuario@correo.com"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-600 uppercase">
                Contraseña
              </Label>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5" />
                  ) : (
                    <Eye className="w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 rounded-lg text-white font-semibold shadow-md transition disabled:opacity-60"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Iniciando...
                </span>
              ) : (
                "Acceder"
              )}
            </Button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Cargando login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
