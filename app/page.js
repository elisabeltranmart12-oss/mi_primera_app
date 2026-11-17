import { neon } from '@neondatabase/serverless';

// La página se genera en cada visita, para mostrar siempre los productos actuales de la base de datos.
export const dynamic = 'force-dynamic';

const euros = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

async function cargarProductos() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return { ok: false, error: 'Falta la variable DATABASE_URL.' };
  }
  try {
    const sql = neon(url);
    const productos = await sql`
      SELECT id, nombre, categoria, descripcion, precio, color
      FROM productos
      ORDER BY categoria DESC, nombre`;
    return { ok: true, productos };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export default async function Tienda() {
  const datos = await cargarProductos();

  // Agrupa los productos por categoría (Neceseres, Bolsas de carro...).
  const categorias = {};
  if (datos.ok) {
    for (const p of datos.productos) {
      (categorias[p.categoria] ??= []).push(p);
    }
  }

  return (
    <main>
      <header className="cabecera">
        <h1>Mi primera app 🧵</h1>
        <p className="sub">Neceseres y bolsas de tela estampada, hechos con cariño.</p>
      </header>

      {!datos.ok && (
        <section className="aviso">
          <h2>❌ No se han podido cargar los productos</h2>
          <p>{datos.error}</p>
        </section>
      )}

      {Object.entries(categorias).map(([categoria, productos]) => (
        <section key={categoria} className="categoria">
          <h2>{categoria}</h2>
          <div className="rejilla">
            {productos.map((p) => (
              <article key={p.id} className="producto">
                <div className="foto" style={{ '--color': p.color || '#ccc' }} aria-hidden="true">
                  <span>{categoria === 'Neceseres' ? '👝' : '👜'}</span>
                </div>
                <div className="info">
                  <h3>{p.nombre}</h3>
                  <p className="descripcion">{p.descripcion}</p>
                  <p className="precio">{euros.format(Number(p.precio))}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      {datos.ok && (
        <footer className="pie">✅ Productos cargados desde la base de datos de Neon</footer>
      )}
    </main>
  );
}
