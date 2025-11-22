import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Asegúrate de que apunte a tu backend real
const API_URL = process.env.PRIVATE_API_URL || "http://localhost:3050/api";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(req, await params);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(req, await params);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(req, await params);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(req, await params);
}

async function handleRequest(req: NextRequest, params: { path: string[] }) {
  const { path } = params;
  // 1. Debug de Cookies
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  //console.log(`🔍 [Proxy] Petición a: /${path.join("/")}`);
  //console.log(`🍪 [Proxy] Cookies disponibles: [${allCookies.map(c => c.name).join(", ")}]`);
  // INTENTO DE RECUPERACIÓN
  let token = cookieStore.get("access_token")?.value;

  if (!token) {
    token = cookieStore.get("token")?.value;
  }
  // MODIFICACIÓN: Token opcional para debugging
  // Ya no bloqueamos si no hay token.
  if (!token) {
    //console.warn("⚠️ [Proxy] No se encontró token, pero se enviará la petición sin auth (Modo Debug).");
    // Comentado para permitir el paso sin token:
    // return NextResponse.json({ error: "No token found in cookies" }, { status: 401 });
  }
  // 2. Construir URL
  const destinationUrl = `${API_URL}/${path.join("/")}${req.nextUrl.search}`;
  // 3. Configurar Headers
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  // Solo agregamos el header Authorization SI existe el token
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const fetchOptions: RequestInit = {
    method: req.method,
    headers,
  };
  // 4. Body
  if (req.method !== "GET" && req.method !== "HEAD") {
    try {
      const body = await req.json();
      fetchOptions.body = JSON.stringify(body);
    } catch (e) {
      // ignore empty body
    }
  }

  try {
    // 5. Llamada al Backend
    const response = await fetch(destinationUrl, fetchOptions);

    // PASO CLAVE: Leemos el texto primero para evitar errores de parseo
    const bodyText = await response.text();

    let data = null;
    if (bodyText) {
      try {
        data = JSON.parse(bodyText);
      } catch (e) {
        // Si falla el parseo (ej: el backend devolvió texto plano "OK"), 
        // devolvemos el texto tal cual o null.
        console.warn("⚠️ [Proxy] La respuesta no es un JSON válido:", bodyText);
        data = { message: bodyText };
      }
    }

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Si data es null (cuerpo vacío) devolvemos un objeto vacío o null
    return NextResponse.json(data || {}, { status: 200 });

  } catch (error) {
    console.error("💥 [Proxy] Error:", error);
    return NextResponse.json(
      { error: "Proxy Error" },
      { status: 502 }
    );
  }
}