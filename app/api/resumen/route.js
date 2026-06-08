// app/api/resumen/route.js
// Proxy server-side hacia Apps Script — sin CORS ni JSONP.
// Usa la misma variable APPS_SCRIPT_URL que ya tienes en Vercel.

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ramos = searchParams.get('ramos') || '';

  if (!process.env.APPS_SCRIPT_URL) {
    return Response.json(
      { ok: false, resumen: 'Variable APPS_SCRIPT_URL no configurada.', error: true },
      { status: 500 }
    );
  }

  const url = `${process.env.APPS_SCRIPT_URL}?action=resumen&ramos=${encodeURIComponent(ramos)}`;

  try {
    const res  = await fetch(url, { redirect: 'follow' });
    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    console.error('Error al llamar Apps Script (resumen):', err.message);
    return Response.json(
      { ok: false, resumen: 'No se pudo cargar el resumen. Intenta más tarde.', error: true },
      { status: 500 }
    );
  }
}