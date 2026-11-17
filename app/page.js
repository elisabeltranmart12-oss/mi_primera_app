import { neon } from '@neondatabase/serverless';

// La página se genera en cada visita, para mostrar datos actuales de la base de datos.
export const dynamic = 'force-dynamic';

async function estadoBaseDeDatos() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return { ok: false, error: 'Falta la variable DATABASE_URL.' };
  }
  try {
    const sql = neon(url);
    const [fila] = await sql`SELECT current_database() AS base, now() AS hora, version() AS version`;
    return {
      ok: true,
      base: fila.base,
      hora: new Date(fila.hora).toLocaleString('es-ES', { timeZone: 'Europe/Madrid' }),
      version: fila.version.split(' on ')[0],
    };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export default async function Inicio() {
  const db = await estadoBaseDeDatos();

  return (
    <main>
      <h1>Mi primera app 🚀</h1>
      <p className="sub">Hecha con Next.js, guardada en GitHub y publicada en Vercel.</p>

      <section className={`tarjeta ${db.ok ? 'ok' : 'error'}`}>
        <h2>{db.ok ? '✅ Conectada a Neon' : '❌ Sin conexión con Neon'}</h2>
        {db.ok ? (
          <ul>
            <li><strong>Base de datos:</strong> {db.base}</li>
            <li><strong>Hora del servidor:</strong> {db.hora}</li>
            <li><strong>Versión:</strong> {db.version}</li>
          </ul>
        ) : (
          <p>{db.error}</p>
        )}
      </section>
    </main>
  );
}
