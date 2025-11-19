export async function GET() {
  try {
    const res = await fetch(`${process.env.PRIVATE_API_URL}/evaluador/pre-cliente`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      //cache: "no-store",
    });

    const data = await res.json();
    return Response.json(data);

  } catch (err) {
    console.error("Proxy error:", err);
    return new Response("Error al obtener datos", { status: 500 });
  }
}