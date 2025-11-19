const API = process.env.PRIVATE_API_URL;

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const res = await fetch(`${API}/evaluador/pre-cliente/${id}`, {
      //cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.error("❌ Error backend:", res.status);
      const raw = await res.text();
      return Response.json(
        { error: "No se pudo obtener precliente", raw },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log("🟢 Precliente recibido:", data);
    return Response.json(data);
  } catch (err) {
    return new Response("Error interno en proxy", { status: 500 });
  }
}