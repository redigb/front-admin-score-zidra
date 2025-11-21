"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/service/store/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Bell, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

export function Header() {
  const router = useRouter();
  const clear = useAuthStore((s) => s.clear);
  const profile = useAuthStore((s) => s.profile);

  const onLogout = async () => {
    try {
        await fetch("/api/logout", { method: "POST" });
        clear(); // limpiar Zustand
        router.replace("/login");
    } catch (error) {
        console.error("Error al cerrar sesión", error);
    }
  };

  // Obtener inicial para el Avatar
  const userInitial = profile?.username?.[0]?.toUpperCase() ?? "U";

  return (
    <TooltipProvider>
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="sticky top-0 z-40 w-full h-16 flex items-center justify-between px-6 
          bg-white/80 backdrop-blur-xl border-b border-slate-200/60"
        >
          {/* --- Izquierda: Saludo --- */}
          <div className="flex flex-col justify-center">
            <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-none">
              Hola, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{profile?.username ?? "Usuario"}</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                Panel de Administración
            </p>
          </div>

          {/* --- Derecha: Acciones y Perfil --- */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            

            {/* Perfil y Logout */}
            <div className="flex items-center gap-3 pl-2">
                <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9 border border-slate-200 ring-2 ring-transparent hover:ring-blue-100 transition-all cursor-pointer">
                        <AvatarImage src="/user-avatar.png" alt="Avatar" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm">
                            {userInitial}
                        </AvatarFallback>
                    </Avatar>
                    
                    {/* Info Usuario (Visible en Desktop) */}
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-semibold text-slate-700 leading-none">
                            {profile?.username ?? "Usuario"}
                        </p>
                       
                    </div>
                </div>

                {/* Botón Logout: Sutil por defecto, Rojo al hover */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={onLogout}
                            className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors ml-1"
                        >
                            <LogOut className="w-5 h-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Cerrar Sesión</TooltipContent>
                </Tooltip>
            </div>
          </div>
        </motion.header>
    </TooltipProvider>
  );
}