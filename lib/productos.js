import { neon } from '@neondatabase/serverless';

export const euros = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

export const slug = (texto) =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// Deduce el estampado a partir del nombre ("Neceser estampado Flores" → "flores").
export function estampado(nombre) {
  const n = nombre.toLowerCase();
  if (n.includes('flor')) return 'flores';
  if (n.includes('raya')) return 'rayas';
  return 'lunares';
}

// Lee los productos de la tabla "productos" de Neon.
export async function cargarProductos() {
  const url = process.env.DATABASE_URL;
  if (!url) return { ok: false, error: 'Falta la variable DATABASE_URL.', productos: [] };
  try {
    const sql = neon(url);
    const filas = await sql`
      SELECT id, nombre, categoria, descripcion, precio, color
      FROM productos
      ORDER BY categoria DESC, nombre`;
    const productos = filas.map((p) => ({
      ...p,
      precio: Number(p.precio),
      slug: slug(p.nombre),
      estampado: estampado(p.nombre),
    }));
    return { ok: true, productos };
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
