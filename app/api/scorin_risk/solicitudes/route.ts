const API = process.env.PRIVATE_API_URL;

export async function GET(request: Request) {
  try {
    // Obtener origin automático
    const { origin } = new URL(request.url);

    // 1. Proxy interno
    const preRes = await fetch(`${origin}/api/scorin_risk/pre_clientes`, {
      cache: "no-store",
    });

    if (!preRes.ok) {
      return new Response("Error cargando preclientes", { status: 500 });
    }

    // Tipado opcional para los preclientes
    const preclientes: Array<any> = await preRes.json();

    const solicitudes: Array<any> = [];

    // 2. Llamada a API privada
    for (const p of preclientes) {
      const res = await fetch(
        `${API}/evaluador/pre-cliente/${p.id}/solicitudes`,
        { cache: "no-store" }
      );

      if (!res.ok) continue;

      // Tipado de solList
      const solList: Array<any> = await res.json();

      const enriched = solList.map((sol: any) => ({
        ...sol,
        preClienteNombre: `${p.nombre} ${p.apellido}`,
        preClienteDni: p.numero_dni || p.numeroDni,
        distrito: p.distrito,
      }));

      solicitudes.push(...enriched);
    }

    return Response.json(solicitudes);

  } catch (err) {
    console.error("Proxy error:", err);
    return new Response("Error al generar solicitudes", { status: 500 });
  }
}
