import { NextRequest, NextResponse } from "next/server";

const API = process.env.PRIVATE_API_URL;

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const body = await req.json();

    const token = req.cookies.get("session")?.value ?? "";
    const response = await fetch(`${API}/evaluador/solicitud/${id}/evaluar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const raw = await response.text();

    let json;
    try {
      json = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "Backend no devolvió JSON válido", raw },
        { status: 500 }
      );
    }

    return NextResponse.json(json, {
      status: response.status,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Error interno al recalcular", details: String(err) },
      { status: 500 }
    );
  }
}
