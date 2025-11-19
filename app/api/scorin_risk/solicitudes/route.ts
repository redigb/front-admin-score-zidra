const API = process.env.PRIVATE_API_URL;

export async function GET() {
  try {
    // 1. Llamamos al proxy interno de preclientes
    const preRes = await fetch(`http://localhost:3000/api/scorin_risk/pre_clientes`, {
      cache: "no-store",
    });

    if (!preRes.ok) {
      return new Response("Error cargando preclientes", { status: 500 });
    }

    const preclientes = await preRes.json();
    let solicitudes: any[] = [];

    // 2. Pedimos solicitudes a la API privada
    for (const p of preclientes) {
      const res = await fetch(`${API}/evaluador/pre-cliente/${p.id}/solicitudes`, {
        cache: "no-store",
      });

      if (!res.ok) continue;

      const solList = await res.json();

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