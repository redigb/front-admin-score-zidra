// src/lib/api.ts
import axios, { AxiosError } from "axios";

// 📌 URL base desde variables de entorno
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3050/api";

// 👉 Cliente autenticado (usa cookies HttpOnly)
export const authApi = axios.create({
  baseURL,
  withCredentials: true, // 🔥 envía cookies automáticamente
});

// 🔹 Interceptor de request
authApi.interceptors.request.use(
  (config) => {
    if (config.headers) {
      config.headers["Content-Type"] = "application/json";
      config.headers["Accept"] = "application/json";
      // 👉 Ejemplo: añadir idioma por defecto
      // config.headers["Accept-Language"] = "es";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Interceptor de response (manejo global de errores)
authApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("⚠️ 401 Unauthorized → redirigiendo a login...");
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }
    } else if (status === 403) {
      console.error("🚫 403 Forbidden → sin permisos suficientes.");
    } else if (error.code === "ERR_NETWORK") {
      console.error("🌐 Error de red: No se pudo conectar al servidor.");
    }
    return Promise.reject(error);
  }
);

// 👉 Cliente público (sin auth, solo para endpoints abiertos)
export const publicApi = axios.create({
  baseURL,
});