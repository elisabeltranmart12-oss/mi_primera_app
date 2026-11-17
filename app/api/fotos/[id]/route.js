import { sqlProductos } from '@/lib/productos';

// Devuelve la foto de un producto guardada en Neon.
export async function GET(request, { params }) {
  const { id } = await params;
  const num = Number(id);
  if (!Number.isInteger(num)) return new Response('No encontrada', { status: 404 });

  const [fila] = await sqlProductos()`SELECT foto, foto_tipo FROM productos WHERE id = ${num}`;
  if (!fila?.foto) return new Response('No encontrada', { status: 404 });

  return new Response(Buffer.from(fila.foto, 'base64'), {
    headers: {
      'Content-Type': fila.foto_tipo || 'image/jpeg',
      // La URL lleva ?v=<versión>, así que al cambiar la foto cambia la URL.
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
