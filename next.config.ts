import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🔧 Configuración de linting y TypeScript
  eslint: { 
    ignoreDuringBuilds: true 
  },
  typescript: { 
    ignoreBuildErrors: true 
  },

  // ⚛️ React en modo producción (mejor performance)
  reactStrictMode: false,

  // 🌍 Variables de entorno públicas
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    API_URL: process.env.API_URL,
  },

  // 🖼️ Imágenes sin optimización (útil para desarrollo o imágenes externas)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;