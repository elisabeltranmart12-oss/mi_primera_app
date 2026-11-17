import { esJefe, noAutorizado } from '@/lib/jefe';
import { errorBD, leerProducto, respuestaErrores } from '@/lib/formProducto';
import { sqlProductos } from '@/lib/productos';

// Añadir un producto nuevo.
export async function POST(request) {
  if (!(await esJefe())) return noAutorizado();
  const { datos, errores } = await leerProducto(request);
  if (Object.keys(errores).length) return respuestaErrores(errores);

  try {
    const [fila] = await sqlProductos()`
      INSERT INTO productos (nombre, categoria, descripcion, precio, color, foto, foto_tipo, actualizado_en)
      VALUES (${datos.nombre}, ${datos.categoria}, ${datos.descripcion || null}, ${datos.precio},
              ${datos.color}, ${datos.foto}, ${datos.fotoTipo}, now())
      RETURNING id`;
    return Response.json({ ok: true, id: fila.id }, { status: 201 });
  } catch (err) {
    return errorBD(err);
  }
}
