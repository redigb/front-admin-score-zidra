import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ❌ QUITADO: output: "export"
  //    Esto causaba el error porque export estático NO soporta API routes.

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  reactStrictMode: false,

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    API_URL: process.env.API_URL,
  },

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
