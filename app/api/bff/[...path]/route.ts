// app/api/bff/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> } // 👈 cambia aquí
) {
  const { path } = await context.params; // 👈 y aquí

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Reconstruir la URL hacia tu backend
  const url = `${process.env.API_URL}/${path.join("/")}${req.nextUrl.search}`;

  const backendRes = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}
