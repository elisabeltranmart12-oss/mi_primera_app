// Crea la tabla "leads" en Neon, donde se guardan los contactos del formulario "Apúntate".
// Ejecútalo con:  npm run leads
// Se puede ejecutar varias veces: no borra nada.
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function main() {
  const sql = neon(process.env.DATABASE_URL);

  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id              BIGSERIAL PRIMARY KEY,
      nombre          TEXT        NOT NULL,
      apellidos       TEXT,
      email           TEXT        NOT NULL UNIQUE,
      telefono        TEXT,
      codigo_postal   TEXT,
      producto        TEXT,
      intereses       TEXT[]      NOT NULL DEFAULT '{}',
      etapa           TEXT,
      origen          TEXT,
      consentimiento  BOOLEAN     NOT NULL,
      newsletter      BOOLEAN     NOT NULL DEFAULT FALSE,
      creado_en       TIMESTAMPTZ NOT NULL DEFAULT now()
    )`;

  const [{ total }] = await sql`SELECT count(*)::int AS total FROM leads`;
  console.log(`✅ Tabla "leads" lista (${total} contactos guardados).`);
  console.log('   Para verlos, en la consola SQL de Neon: SELECT * FROM leads ORDER BY creado_en DESC;');
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
