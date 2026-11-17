import { neon } from '@neondatabase/serverless';
import { validarLead } from '@/lib/validar';
import { slug } from '@/lib/productos';

// Recibe el formulario "Apúntate" y lo guarda en la tabla "leads" de Neon.
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Petición no válida.' }, { status: 400 });
  }

  const { lead, errores, esBot } = validarLead(body);
  if (esBot) return Response.json({ ok: true });
  if (Object.keys(errores).length) {
    return Response.json({ error: 'Revisa los campos marcados.', errors: errores }, { status: 422 });
  }

  if (!process.env.DATABASE_URL) {
    console.error('Falta la variable DATABASE_URL');
    return Response.json({ error: 'El servicio no está disponible ahora mismo.' }, { status: 500 });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    // El producto llega como "slug"; guardamos su nombre real si existe en la tienda.
    let producto = null;
    if (lead.producto) {
      const productos = await sql`SELECT nombre FROM productos`;
      producto = productos.find((p) => slug(p.nombre) === lead.producto)?.nombre ?? null;
    }

    const filas = await sql`
      INSERT INTO leads (nombre, apellidos, email, telefono, codigo_postal, producto,
                         intereses, etapa, origen, consentimiento, newsletter)
      VALUES (${lead.nombre}, ${lead.apellidos || null}, ${lead.email}, ${lead.telefono || null},
              ${lead.codigo_postal || null}, ${producto}, ${lead.intereses}, ${lead.etapa || null},
              ${lead.origen || null}, ${lead.consentimiento}, ${lead.newsletter})
      ON CONFLICT (email) DO UPDATE
        SET producto = COALESCE(EXCLUDED.producto, leads.producto)
      RETURNING (xmax = 0) AS nuevo`;

    const nuevo = filas[0]?.nuevo === true;
    return Response.json({ ok: true, duplicate: !nuevo }, { status: nuevo ? 201 : 200 });
  } catch (err) {
    console.error('Error guardando lead:', err);
    return Response.json({ error: 'No hemos podido guardar tus datos. Inténtalo de nuevo.' }, { status: 500 });
  }
}
