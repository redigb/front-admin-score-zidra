const API = process.env.PRIVATE_API_URL;

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const res = await fetch(`${API}/evaluador/solicitud/${params.id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return new Response("Solicitud no encontrada", { status: res.status });
    }

    const data = await res.json();
    return Response.json(data);

  } catch (err) {
    console.error("Error solicitud:", err);
    return new Response("Error interno", { status: 500 });
  }
}