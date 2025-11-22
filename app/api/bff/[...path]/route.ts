import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.PRIVATE_API_URL;

// Obligamos a definir la variable de entorno en producción
if (!API_URL) {
  throw new Error("PRIVATE_API_URL is missing in environment variables");
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleRequest(req, await params);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleRequest(req, await params);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleRequest(req, await params);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleRequest(req, await params);
}

async function handleRequest(req: NextRequest, params: { path: string[] }) {
  const { path } = params;

  // Cookie → Token
  const cookieStore = await cookies();
  let token =
    cookieStore.get("access_token")?.value ||
    cookieStore.get("token")?.value ||
    null;

  // Construir URL destino
  const destinationUrl = `${API_URL}/${path.join("/")}${req.nextUrl.search}`;

  // Armamos headers
  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const fetchOptions: RequestInit = {
    method: req.method,
    headers,
  };

  // ------------ 🔥 LECTURA DE BODY SEGURA (FUNCIONA EN PRODUCCIÓN) ------------
  if (req.method !== "GET" && req.method !== "HEAD") {
    try {
      const clone = req.clone();        // <-- clave en producción
      const body = await clone.json();

      if (body && Object.keys(body).length > 0) {
        fetchOptions.body = JSON.stringify(body);
        headers["Content-Type"] = "application/json";
      }
    } catch (err) {
      // Sin body → NO agregamos Content-Type
    }
  }
  // ---------------------------------------------------------------------------

  try {
    const response = await fetch(destinationUrl, fetchOptions);

    // ----- Lectura robusta del body del backend -----
    const raw = await response.text();
    let data: any = null;

    if (raw.trim() !== "") {
      try {
        data = JSON.parse(raw);
      } catch {
        console.warn("⚠️ Backend no devolvió JSON. Respuesta:", raw);
        data = { message: raw };
      }
    }

    // Devolver tal cual cuando hay error
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Si no hay cuerpo → enviamos {}
    return NextResponse.json(data ?? {}, { status: 200 });

  } catch (err) {
    console.error("💥 [Proxy] Error:", err);
    return NextResponse.json({ error: "Proxy Error" }, { status: 502 });
  }
}
