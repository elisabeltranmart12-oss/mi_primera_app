import { neon } from '@neondatabase/serverless';
import { esJefe, noAutorizado } from '@/lib/jefe';
import { VALORES_ESTADO } from '@/lib/etiquetas';

const sql = () => neon(process.env.DATABASE_URL);

async function leerId(params) {
  const { id } = await params;
  const num = Number(id);
  return Number.isInteger(num) ? num : null;
}

// Cambiar el estado o las notas de un contacto.
export async function PATCH(request, { params }) {
  if (!(await esJefe())) return noAutorizado();
  const id = await leerId(params);
  if (!id) return Response.json({ error: 'Contacto no encontrado.' }, { status: 404 });

  const body = await request.json().catch(() => ({}));
  const estado = VALORES_ESTADO.includes(body.estado) ? body.estado : null;
  const notas = typeof body.notas === 'string' ? body.notas.slice(0, 2000) : null;
  if (!estado && notas === null) return Response.json({ error: 'Nada que cambiar.' }, { status: 400 });

  const filas = await sql()`
    UPDATE leads SET
      estado = COALESCE(${estado}::text, estado),
      notas = CASE WHEN ${notas}::text IS NULL THEN notas ELSE NULLIF(${notas}::text, '') END,
      actualizado_en = now()
    WHERE id = ${id}
    RETURNING id`;
  if (!filas.length) return Response.json({ error: 'Contacto no encontrado.' }, { status: 404 });
  return Response.json({ ok: true });
}

// Borrar un contacto (por ejemplo, si te pide que elimines sus datos).
export async function DELETE(request, { params }) {
  if (!(await esJefe())) return noAutorizado();
  const id = await leerId(params);
  if (!id) return Response.json({ error: 'Contacto no encontrado.' }, { status: 404 });
  await sql()`DELETE FROM leads WHERE id = ${id}`;
  return Response.json({ ok: true });
}
