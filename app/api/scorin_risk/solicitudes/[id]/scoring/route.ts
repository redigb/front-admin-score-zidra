const API = process.env.PRIVATE_API_URL;

export async function GET(req: Request, { params }: { params: any }) {
  try {
    const { id } = params;

    console.log("🔵 API Route recibió ID:", id);

    const response = await fetch(`${API}/evaluador/solicitud/${id}/scoring`, {
      cache: "no-store",
    });

    const raw = await response.text();
    console.log("🟡 RAW RESPONSE:", raw);

    let json: any = null;

    // Intentamos parsear SIEMPRE
    try {
      json = JSON.parse(raw);
    } catch {
      console.error("❌ La API devolvió HTML o texto no JSON");
      return Response.json(
        { error: "El backend devolvió una respuesta NO JSON", raw },
        { status: 500 }
      );
    }

    // Si el backend respondió error, lo devolvemos al front
    if (!response.ok) {
      return Response.json(
        {
          ok: false,
          status: response.status,
          message: json.message || "Error en backend",
        },
        { status: response.status }
      );
    }

    // OK → devolvemos scoring
    return Response.json(json);

  } catch (err) {
    console.error("🔴 Error en API route:", err);
    return new Response("Error interno", { status: 500 });
  }
}
