// middleware.ts (en la RAÍZ del proyecto)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "token";

// Rutas públicas (no requieren token)
const PUBLIC_PATHS = new Set<string>([
  "/login",
  "/api/auth/login",
  "/api/auth/logout",
  "/favicon.ico",
]);

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = req.cookies.get(AUTH_COOKIE)?.value;

  // DEBUG: verás cada navegación en la consola del server
  console.log("[MW]", pathname, "token:", token ? "yes" : "no");

  const isPublic =
    PUBLIC_PATHS.has(pathname) ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/public");

  // Si NO hay token y la ruta NO es pública -> /login
  if (!token && !isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(pathname + (search || ""))}`;
    return NextResponse.redirect(url);
  }

  // Si SÍ hay token y entra a /login -> envíalo a tu landing privada
  if (token && pathname === "/login") {
    const url = req.nextUrl.clone();
    url.pathname = "/module-selection"; // ajusta si quieres otro destino
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"], // aplica a todo (luego puedes refinar)
};
