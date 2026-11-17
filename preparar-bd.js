// Prepara la base de datos de Neon para la web de Nenúfar:
//  - crea la tabla "leads" (contactos del formulario "Apúntate")
//  - añade a "productos" las columnas para fotos que usa la zona de jefe
//  - añade a "leads" el estado (pendiente, contactado, vendido...) y las notas del back office
// Ejecútalo con:  npm run bd
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

  await sql`ALTER TABLE productos ADD COLUMN IF NOT EXISTS foto TEXT`;
  await sql`ALTER TABLE productos ADD COLUMN IF NOT EXISTS foto_tipo TEXT`;
  await sql`ALTER TABLE productos ADD COLUMN IF NOT EXISTS actualizado_en TIMESTAMPTZ DEFAULT now()`;
  await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS estado TEXT NOT NULL DEFAULT 'pendiente'`;
  await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS notas TEXT`;
  await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS actualizado_en TIMESTAMPTZ`;


  const [{ total }] = await sql`SELECT count(*)::int AS total FROM leads`;
  const [{ productos }] = await sql`SELECT count(*)::int AS productos FROM productos`;
  console.log(`✅ Base de datos lista: ${productos} productos y ${total} contactos.`);
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
