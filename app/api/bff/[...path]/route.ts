import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// --- CONFIG BACKEND (limpia slashes) ---
const API_URL = (process.env.PRIVATE_API_URL ?? "").replace(/\/$/, "");
if (!API_URL) {
  throw new Error("❌ PRIVATE_API_URL is missing in environment variables");
}

// --- Entrypoints ---
export async function GET(req: NextRequest, ctx: any) {
  return handleRequest(req, await ctx.params);
}
export async function POST(req: NextRequest, ctx: any) {
  return handleRequest(req, await ctx.params);
}
export async function PUT(req: NextRequest, ctx: any) {
  return handleRequest(req, await ctx.params);
}
export async function DELETE(req: NextRequest, ctx: any) {
  return handleRequest(req, await ctx.params);
}

// --------------------------------------------------------------
//              🔥   HANDLER PRINCIPAL (PRO FINAL)
// --------------------------------------------------------------
async function handleRequest(req: NextRequest, params: { path: string[] }) {
  const { path } = params;

  // --- TOKEN DE COOKIES ---
  const cookieStore = await cookies();
  const token =
    cookieStore.get("access_token")?.value ||
    cookieStore.get("token")?.value ||
    null;

  // --- Construimos URL destino ---
  const destinationUrl = `${API_URL}/${path.join("/")}${req.nextUrl.search}`;
  console.log("🔥 BFF DESTINATION:", destinationUrl);

  // --- Headers para el backend ---
  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const fetchOptions: RequestInit = {
    method: req.method,
    headers,
  };

  // --------------------------------------------------------------
  // 🔥 BODY COMPATIBLE 100% CON SPRING WEBFLUX (CLAVE)
  // --------------------------------------------------------------
  if (req.method !== "GET" && req.method !== "HEAD") {
    try {
      const bodyText = await req.text(); // ⭐ Leer SIEMPRE como texto

      console.log("🔥 BODY RECEIVED:", bodyText);

      if (bodyText.trim() !== "") {
        fetchOptions.body = bodyText;
        headers["Content-Type"] = "application/json"; // WebFlux requiere JSON puro
      } else {
        delete headers["Content-Type"]; // Evita errores 415 en WebFlux
      }

    } catch (err) {
      console.warn("⚠ No se pudo leer el body en el BFF");
      delete headers["Content-Type"];
    }
  }

  console.log("🔥 FETCH OPTIONS:", fetchOptions);

  // --------------------------------------------------------------
  //                     🔥 FETCH AL BACKEND
  // --------------------------------------------------------------
  try {
    const response = await fetch(destinationUrl, fetchOptions);

    const raw = await response.text();
    console.log("🔥 BACKEND STATUS:", response.status);
    console.log("🔥 BACKEND RAW:", raw);

    let data: any = null;

    if (raw.trim() !== "") {
      try {
        data = JSON.parse(raw);
      } catch {
        console.warn("⚠ Backend devolvió texto plano:", raw);
        data = { message: raw };
      }
    }

    // Si backend falla → devolvemos su error real
    if (!response.ok) {
      return NextResponse.json(data ?? {}, { status: response.status });
    }

    // Si backend respondió vacío → devolvemos {}
    return NextResponse.json(data ?? {}, { status: 200 });

  } catch (err) {
    console.error("💥 [Proxy Error]:", err);
    return NextResponse.json({ error: "Proxy Error" }, { status: 502 });
  }
}
