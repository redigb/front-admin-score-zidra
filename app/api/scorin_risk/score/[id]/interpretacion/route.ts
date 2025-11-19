const API = process.env.PRIVATE_API_URL;

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    console.log("🔵 Interpretación solicitada para scoring ID:", id);
    console.log("🔵 Backend URL:", `${API}/evaluador/scoring/${id}/interpretacion`);

    const res = await fetch(`${API}/evaluador/scoring/${id}/interpretacion`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    console.log("🟣 Status backend interpretación:", res.status);

    const raw = await res.text();
    console.log("🟡 RAW:", raw);

    // Intentar parsear JSON
    let json = null;
    try {
      json = JSON.parse(raw);
    } catch {
      console.error("❌ Backend NO devolvió JSON válido");
      return Response.json(
        { error: "Respuesta inválida del backend", raw },
        { status: 500 }
      );
    }

    if (!res.ok) {
      console.error("❌ Error del backend:", json);
      return Response.json(
        { error: json?.message || "No se pudo obtener la interpretación" },
        { status: res.status }
      );
    }

    console.log("🟢 Interpretación obtenida:", json);

    return Response.json(json);

  } catch (err) {
    console.error("🔴 Error interno interpretacion:", err);
    return new Response("Error interno en interprete", { status: 500 });
  }
}
