import { esJefe, noAutorizado } from '@/lib/jefe';
import { errorBD, leerProducto, respuestaErrores } from '@/lib/formProducto';
import { sqlProductos } from '@/lib/productos';

async function leerId(params) {
  const { id } = await params;
  const num = Number(id);
  return Number.isInteger(num) ? num : null;
}

// Modificar un producto (nombre, precio, descripción, color, foto...).
export async function PUT(request, { params }) {
  if (!(await esJefe())) return noAutorizado();
  const id = await leerId(params);
  if (!id) return Response.json({ error: 'Producto no encontrado.' }, { status: 404 });

  const { datos, errores } = await leerProducto(request);
  if (Object.keys(errores).length) return respuestaErrores(errores);

  try {
    const filas = await sqlProductos()`
      UPDATE productos SET
        nombre = ${datos.nombre},
        categoria = ${datos.categoria},
        descripcion = ${datos.descripcion || null},
        precio = ${datos.precio},
        color = ${datos.color},
        foto = CASE WHEN ${datos.quitarFoto} THEN NULL
                    WHEN ${datos.foto}::text IS NOT NULL THEN ${datos.foto}::text
                    ELSE foto END,
        foto_tipo = CASE WHEN ${datos.quitarFoto} THEN NULL
                         WHEN ${datos.fotoTipo}::text IS NOT NULL THEN ${datos.fotoTipo}::text
                         ELSE foto_tipo END,
        actualizado_en = now()
      WHERE id = ${id}
      RETURNING id`;
    if (!filas.length) return Response.json({ error: 'Producto no encontrado.' }, { status: 404 });
    return Response.json({ ok: true });
  } catch (err) {
    return errorBD(err);
  }
}

// Borrar un producto.
export async function DELETE(request, { params }) {
  if (!(await esJefe())) return noAutorizado();
  const id = await leerId(params);
  if (!id) return Response.json({ error: 'Producto no encontrado.' }, { status: 404 });
  try {
    await sqlProductos()`DELETE FROM productos WHERE id = ${id}`;
    return Response.json({ ok: true });
  } catch (err) {
    return errorBD(err);
  }
}
