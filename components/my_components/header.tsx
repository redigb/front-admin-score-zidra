"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/service/store/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion"

export function Header() {
  const router = useRouter();
  const clear = useAuthStore((s) => s.clear);
  const profile = useAuthStore((s) => s.profile);

  const onLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    clear(); // limpiar Zustand
    router.replace("/login");
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-20 h-16 flex items-center justify-between
      px-6 
      bg-gray-50/80 dark:bg-neutral-900/80   
      backdrop-blur-xl                       
      shadow-md"
    >
      {/* izquierda */}
      <h1 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 tracking-tight">
        <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
          Hola,
        </span>{" "}
        {profile?.username ?? "Usuario"}
      </h1>

      {/* derecha */}
      <div className="flex items-center gap-4">
        <div className="relative group">
          <Avatar className="w-9 h-9 ring-2 ring-transparent group-hover:ring-blue-500 transition">
            <AvatarImage src="/user-avatar.png" />
            <AvatarFallback className="bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
              {profile?.username?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-neutral-500 opacity-0 group-hover:opacity-100 transition">
            {profile?.username ?? "Usuario"}
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-xl 
          bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700
          text-white text-sm font-medium shadow-md hover:shadow-lg 
          transition-all duration-300"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Cerrar sesión</span>
        </motion.button>
      </div>
    </motion.header>
  );
}
