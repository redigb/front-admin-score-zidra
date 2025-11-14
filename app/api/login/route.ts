// app/api/auth/login/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  // Validación simple (puedes cambiar por llamada a tu backend)
  const isValid = username === "admin" && password === "1234";
  if (!isValid) {
    return NextResponse.json({ ok: false, message: "Credenciales inválidas" }, { status: 401 });
  }

  // Genera un token simple (en real, usa JWT o un uuid + validación en backend)
  const token = crypto.randomUUID();

  const res = NextResponse.json({ ok: true, user: { username } });
  res.cookies.set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8h
  });

  return res;
}
