import { NextResponse } from "next/server";

export async function GET() {
  try {
   
    const API_URL = process.env.NEXT_PUBLIC_API_N8N_URL; 
    
    const res = await fetch(`${API_URL}/webhook/models/active`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Error fetching data: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener el modelo activo" }, 
      { status: 500 }
    );
  }
}