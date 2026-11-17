import { neon } from '@neondatabase/serverless';

export const euros = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

export const slug = (texto) =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// Deduce el estampado de la ilustración a partir del nombre ("Neceser estampado Flores" → "flores").
export function estampado(nombre) {
  const n = nombre.toLowerCase();
  if (n.includes('flor') || n.includes('liberty')) return 'flores';
  if (n.includes('raya')) return 'rayas';
  return 'lunares';
}

// Prepara una fila de la base de datos para usarla en la web.
export function prepararProducto(p) {
  return {
    id: p.id,
    nombre: p.nombre,
    categoria: p.categoria,
    descripcion: p.descripcion ?? '',
    precio: Number(p.precio),
    color: p.color,
    tiene_foto: !!p.tiene_foto,
    version: Number(p.version ?? 0),
    slug: slug(p.nombre),
    estampado: estampado(p.nombre),
  };
}

export const sqlProductos = () => neon(process.env.DATABASE_URL);

// Lee los productos de la tabla "productos" de Neon (sin los datos de la foto, que pesan).
export async function cargarProductos() {
  if (!process.env.DATABASE_URL) return { ok: false, error: 'Falta la variable DATABASE_URL.', productos: [] };
  try {
    const sql = sqlProductos();
    const filas = await sql`
      SELECT id, nombre, categoria, descripcion, precio, color,
             (foto IS NOT NULL) AS tiene_foto,
             COALESCE(EXTRACT(EPOCH FROM actualizado_en)::bigint, 0) AS version
      FROM productos
      ORDER BY categoria DESC, nombre`;
    return { ok: true, productos: filas.map(prepararProducto) };
  } catch (err) {
    console.error('Error cargando productos:', err);
    return { ok: false, error: 'No se han podido cargar los productos.', productos: [] };
  }
}

// Agrupa por categoría manteniendo el orden ("Neceseres", "Bolsas de carro"...).
export function agruparPorCategoria(productos) {
  const grupos = {};
  for (const p of productos) (grupos[p.categoria] ??= []).push(p);
  return grupos;
}
