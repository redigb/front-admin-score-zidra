import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Genera build estático para S3 o GitHub Pages
  output: "export",

  // ✅ Ignora errores de lint y typescript durante el build
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // ✅ Desactiva React Strict Mode para evitar dobles renderizados
  reactStrictMode: false,

  // ✅ Variables de entorno accesibles desde el cliente
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },

  // ✅ Necesario para imágenes si usas <Image> de Next
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
