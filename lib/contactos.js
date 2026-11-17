import { neon } from '@neondatabase/serverless';
import { VALORES_ESTADO } from './etiquetas';

const sql = () => neon(process.env.DATABASE_URL);

// Filtros que llegan por la URL (?q=...&estado=...&producto=...&etapa=...).
export function leerFiltros(params = {}) {
  const t = (v) => (typeof v === 'string' ? v.trim().slice(0, 80) : '');
  const estado = t(params.estado);
  return {
    q: t(params.q),
    estado: VALORES_ESTADO.includes(estado) ? estado : '',
    producto: t(params.producto),
    etapa: t(params.etapa),
  };
}

export async function listarContactos(f) {
  const q = f.q ? `%${f.q}%` : null;
  const filas = await sql()`
    SELECT l.id, l.nombre, l.apellidos, l.email, l.telefono, l.codigo_postal, l.producto,
           l.intereses, l.etapa, l.origen, l.newsletter, l.estado, l.notas, l.creado_en,
           p.precio
    FROM leads l
    LEFT JOIN productos p ON p.nombre = l.producto
    WHERE (${q}::text IS NULL OR l.nombre ILIKE ${q} OR l.apellidos ILIKE ${q} OR l.email ILIKE ${q} OR l.telefono ILIKE ${q})
      AND (${f.estado || null}::text IS NULL OR l.estado = ${f.estado || null})
      AND (${f.producto || null}::text IS NULL OR
           (${f.producto} = '__sin__' AND l.producto IS NULL) OR l.producto = ${f.producto || null})
      AND (${f.etapa || null}::text IS NULL OR l.etapa = ${f.etapa || null})
    ORDER BY l.creado_en DESC
    LIMIT 1000`;
  return filas.map((c) => ({ ...c, precio: c.precio == null ? null : Number(c.precio) }));
}

// Datos del panel de resumen.
export async function resumen() {
  const s = sql();
  const [totales, porProducto, porEtapa, porOrigen, porDia, ultimos, productos] = await Promise.all([
    s`SELECT count(*)::int AS total,
             count(*) FILTER (WHERE creado_en > now() - interval '7 days')::int AS semana,
             count(*) FILTER (WHERE newsletter)::int AS newsletter,
             count(*) FILTER (WHERE producto IS NOT NULL)::int AS reservas,
             count(*) FILTER (WHERE estado = 'pendiente')::int AS pendientes,
             count(*) FILTER (WHERE estado = 'vendido')::int AS vendidos
      FROM leads`,
    s`SELECT l.producto, count(*)::int AS n, max(p.precio) AS precio,
             count(*) FILTER (WHERE l.estado = 'vendido')::int AS vendidos
      FROM leads l LEFT JOIN productos p ON p.nombre = l.producto
      WHERE l.producto IS NOT NULL
      GROUP BY l.producto ORDER BY n DESC, l.producto`,
    s`SELECT COALESCE(etapa, '') AS clave, count(*)::int AS n FROM leads GROUP BY 1 ORDER BY n DESC`,
    s`SELECT COALESCE(origen, '') AS clave, count(*)::int AS n FROM leads GROUP BY 1 ORDER BY n DESC`,
    s`SELECT to_char(d, 'YYYY-MM-DD') AS dia, count(l.id)::int AS n
      FROM generate_series((now() AT TIME ZONE 'Europe/Madrid')::date - 13,
                           (now() AT TIME ZONE 'Europe/Madrid')::date, interval '1 day') AS d
      LEFT JOIN leads l ON (l.creado_en AT TIME ZONE 'Europe/Madrid')::date = d::date
      GROUP BY d ORDER BY d`,
    s`SELECT id, nombre, apellidos, email, producto, estado, creado_en FROM leads ORDER BY creado_en DESC LIMIT 5`,
    s`SELECT count(*)::int AS total, count(*) FILTER (WHERE foto IS NULL)::int AS sin_foto FROM productos`,
  ]);

  const reservas = porProducto.map((r) => ({ ...r, precio: r.precio == null ? 0 : Number(r.precio) }));
  return {
    ...totales[0],
    valorReservas: reservas.reduce((s, r) => s + r.n * r.precio, 0),
    valorVendido: reservas.reduce((s, r) => s + r.vendidos * r.precio, 0),
    porProducto: reservas,
    porEtapa,
    porOrigen,
    porDia,
    ultimos,
    productos: productos[0],
  };
}

export async function productosReservables() {
  return sql()`SELECT nombre FROM productos ORDER BY categoria DESC, nombre`;
}
