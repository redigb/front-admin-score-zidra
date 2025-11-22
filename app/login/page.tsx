"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Eye,
  EyeOff,
  Activity,
  ArrowRight,
  Wifi,
  Shield,
  CheckCircle2
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

  return (
    // CONTENEDOR PANTALLA COMPLETA
    <div className="min-h-screen w-full flex bg-white overflow-hidden font-sans">
      <div className="hidden lg:flex w-[48%] h-screen p-6 relative z-10">
        <div className="w-full h-full rounded-[40px] overflow-hidden relative shadow-2xl shadow-emerald-900/20 border border-emerald-500/10">
          {/* Fondo Base */}
          <div className="absolute inset-0 bg-[#042f2e]"></div> {/* Un verde muy oscuro casi negro para contraste */}
          {/* Mesh Gradient Animado (Verde ZidraScore) */}
          <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-emerald-500 rounded-full blur-[120px] opacity-40 mix-blend-screen animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-600 rounded-full blur-[100px] opacity-30 mix-blend-screen"></div>
          <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-emerald-400 rounded-full blur-[80px] opacity-20 mix-blend-overlay"></div>

          {/* Ruido de textura para realismo (opcional) */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/noise.png')]"></div>

          {/* Contenido dentro de la tarjeta flotante */}
          <div className="relative z-10 h-full flex flex-col justify-between p-12 text-white">
            
            {/* Header Logo */}
            <div>
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 mb-6 shadow-lg">
                    <Activity className="w-6 h-6 text-emerald-300" />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm text-emerald-200 text-xs font-medium mb-4">
                    <Wifi className="w-3 h-3" />
                </div>
            </div>

            {/* Texto Principal */}
            <div className="space-y-4">
                <h2 className="text-5xl font-bold leading-tight tracking-tight">
                  ZidraScore <br/> 
                  <span className="text-emerald-200"></span>
                </h2>
                <p className="text-emerald-100/80 text-lg leading-relaxed max-w-md font-light">
                  Gestión de riesgo crediticio y monitoreo de activos en una sola plataforma unificada.
                </p>
            </div>

            {/* Footer Tarjeta */}
            <div className="flex items-center justify-between pt-8 border-t border-white/10">
               <div className="flex gap-4 text-sm font-medium text-emerald-200/80">
                  <span>© 2025 ZidraScore</span>
                  <span>v0.0.1</span>
               </div>
               <div className="flex gap-2">
                   <div className="w-2 h-2 rounded-full bg-white/80"></div>
                   <div className="w-2 h-2 rounded-full bg-white/20"></div>
                   <div className="w-2 h-2 rounded-full bg-white/20"></div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          DERECHA: FORMULARIO (Pantalla completa en el espacio restante)
         ======================================================== */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 lg:p-24 relative bg-white">
        
        {/* Decoración móvil (Logo) */}
        <div className="lg:hidden absolute top-8 left-8">
             <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <Activity className="w-6 h-6" />
             </div>
        </div>

        <div className="max-w-[420px] w-full space-y-10">
            
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                Bienvenido
              </h1>
              <p className="text-slate-500 text-base">
                Por favor ingresa tus credenciales para continuar.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-7">
              
              {err && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                  <Shield className="w-5 h-5 shrink-0 mt-0.5" />
                  <span className="font-medium">{err}</span>
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-slate-900 font-semibold text-sm ml-1">Email Corporativo</Label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300 px-5 text-base shadow-sm"
                    placeholder="usuario@zidrascore.com"
                  />
                </div>

                <div className="space-y-2">
                  {/*<div className="flex justify-between items-center ml-1">
                    <Label className="text-slate-900 font-semibold text-sm">Contraseña</Label>
                    <a href="#" className="text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:underline">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>*/}
                  
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300 px-5 pr-12 text-base shadow-sm"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-full"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-xl shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-between px-6 group"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center w-full gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Validando...</span>
                  </div>
                ) : (
                  <>
                    <span>Iniciar Sesión</span>
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                    </div>
                  </>
                )}
              </Button>
            </form>

            {/* Features pequeñas abajo del form
            <div className="pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-sm text-slate-500">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                        <Shield className="w-4 h-4" />
                    </div>
                    <span className="leading-tight">Datos encriptados</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="leading-tight">Acceso 24/7</span>
                </div>
            </div> */}

        </div>
      </div>
    </div>
  );
}

function Loader2({ className }: { className?: string }) {
    return (
        <svg 
            className={className} 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-white"><Loader2 className="w-10 h-10 text-emerald-600 animate-spin" /></div>}>
      <LoginContent />
    </Suspense>
  );
}