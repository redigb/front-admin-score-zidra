import axios, { AxiosError } from "axios";
// 📌 AHORA apuntamos a nuestra propia API de Next.js
// Usamos una ruta relativa porque el cliente llama al servidor de Next.js (mismo dominio)
const baseURL = "/api/bff"; 
export const nextApi = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
// 🔹 Interceptor de response para manejar errores del Proxy
nextApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      // Si el proxy devuelve 401, es porque el token expiró o no existe en las cookies
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    
    return Promise.reject(error);
  }
);