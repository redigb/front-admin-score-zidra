"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  Wifi,
  MapPin,
  Shield,
  Zap,
  Database,
  Activity,
} from "lucide-react";
import { useAuthStore } from "@/service/store/auth";

// Si usas shadcn:
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

// ------------------------------------------------------
// 👇 Componente que contiene toda la lógica y el JSX
// ------------------------------------------------------
function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/module-selection";

  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
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
          remember: stayLoggedIn,
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
    } catch (error) {
      setErr("Error de red. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------------------------------------
  // 👇 JSX de la página (idéntico al tuyo)
  // ------------------------------------------------------
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Panel izquierdo (branding IoT) */}
      <div className="flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 p-12 flex flex-col justify-between text-white relative overflow-hidden">
        {/* Fondo animado */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-3 h-3 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-40 right-32 w-2 h-2 bg-blue-300 rounded-full animate-bounce opacity-40 animation-delay-1000"></div>
          <div className="absolute bottom-60 left-16 w-4 h-4 bg-indigo-300 rounded-full animate-pulse opacity-50 animation-delay-2000"></div>
          <div className="absolute top-1/3 right-20 w-2 h-2 bg-cyan-300 rounded-full animate-bounce opacity-30 animation-delay-3000"></div>

          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="border border-blue-300/20" />
              ))}
            </div>
          </div>

          <div className="absolute top-1/4 left-1/4 w-32 h-0.5 bg-gradient-to-r from-cyan-400 to-transparent animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-24 h-0.5 bg-gradient-to-l from-blue-400 to-transparent animate-pulse animation-delay-1000"></div>
        </div>

        {/* Branding */}
        <div className="relative z-10 animate-fade-in">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              ZidraScore
            </h1>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold leading-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Plataforma Inteligente de
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-semibold text-cyan-200">IoT</span>
              <span className="text-xl text-white/80">&</span>
              <span className="text-2xl font-semibold text-blue-200">
                Evaluación de Riesgo
              </span>
            </div>
            <p className="text-lg opacity-90 leading-relaxed max-w-md">
              Monitoreo en tiempo real y análisis predictivo para la toma de
              decisiones inteligentes.
            </p>
          </div>
        </div>

        {/* Visual IoT */}
        <div className="relative z-10 flex justify-center animate-float py-10">
          <div className="relative">
            <div className="w-56 h-80 bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl shadow-2xl border border-slate-600 relative overflow-hidden">
              <div className="m-4 h-72 bg-gradient-to-b from-blue-900 to-indigo-900 rounded-2xl p-4 relative">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse animation-delay-500"></div>
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse animation-delay-1000"></div>
                  </div>
                  <Wifi className="w-4 h-4 text-cyan-400 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded animate-pulse"></div>
                  <div className="h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded animate-pulse animation-delay-300"></div>
                  <div className="h-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded animate-pulse animation-delay-600"></div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                  <MapPin className="w-5 h-5 text-cyan-300 animate-bounce animation-delay-1000" />
                  <Shield className="w-5 h-5 text-blue-300 animate-bounce animation-delay-1500" />
                  <Database className="w-5 h-5 text-indigo-300 animate-bounce animation-delay-2000" />
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-8 w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl shadow-xl animate-float animation-delay-1000 flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -bottom-4 -left-6 w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl shadow-lg animate-float animation-delay-2000 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Panel derecho: formulario */}
      <div className="flex-1 bg-white flex items-center justify-center p-12 relative">
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-32 left-16 w-24 h-24 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-full opacity-20 animate-pulse animation-delay-2000"></div>

        <div className="w-full max-w-md space-y-8 relative z-10 animate-slide-up">
          <div className="text-center">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-3">
              Iniciar Sesión
            </h2>
            <p className="text-slate-600 text-lg">
              Accede a tu plataforma de monitoreo y análisis
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {err && (
              <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
                {err}
              </div>
            )}

            <div className="animate-fade-in animation-delay-500">
              <Label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700 mb-3"
              >
                Usuario / Correo
              </Label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@correo.com"
                required
                className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg bg-slate-50/50 hover:bg-white"
              />
            </div>

            <div className="animate-fade-in animation-delay-700">
              <Label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700 mb-3"
              >
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  className="w-full px-4 py-4 pr-14 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg bg-slate-50/50 hover:bg-white"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-slate-100 rounded-lg"
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-slate-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-slate-500" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg animate-fade-in animation-delay-1100 text-lg disabled:opacity-70"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Iniciando sesión...
                </span>
              ) : (
                "Acceder a la Plataforma"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------
// 👇 Envolvemos en Suspense para evitar el error de build
// ------------------------------------------------------
export default function LoginPage() {
  return (
    <Suspense fallback={<div>Cargando página de inicio de sesión...</div>}>
      <LoginContent />
    </Suspense>
  );
}
