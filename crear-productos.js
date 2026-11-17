// Crea la tabla "productos" en Neon y añade los productos de la tienda.
// Ejecútalo con:  npm run productos
// Se puede ejecutar varias veces: no duplica productos.
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

// ✏️ Edita esta lista para cambiar nombres, descripciones o precios.
const PRODUCTOS = [
  { nombre: 'Neceser estampado Flores',  categoria: 'Neceseres',      precio: 25, color: '#e8a0b4', descripcion: 'Neceser de tela estampada con cremallera, ideal para viaje o maquillaje.' },
  { nombre: 'Neceser estampado Lunares', categoria: 'Neceseres',      precio: 25, color: '#8fb8de', descripcion: 'Neceser de tela estampada con cremallera, ideal para viaje o maquillaje.' },
  { nombre: 'Neceser estampado Rayas',   categoria: 'Neceseres',      precio: 25, color: '#9ccfa8', descripcion: 'Neceser de tela estampada con cremallera, ideal para viaje o maquillaje.' },
  { nombre: 'Bolsa de carro Flores',     categoria: 'Bolsas de carro', precio: 50, color: '#e8a0b4', descripcion: 'Bolsa de tela estampada para carro de bebé, amplia y resistente.' },
  { nombre: 'Bolsa de carro Lunares',    categoria: 'Bolsas de carro', precio: 50, color: '#8fb8de', descripcion: 'Bolsa de tela estampada para carro de bebé, amplia y resistente.' },
  { nombre: 'Bolsa de carro Rayas',      categoria: 'Bolsas de carro', precio: 50, color: '#9ccfa8', descripcion: 'Bolsa de tela estampada para carro de bebé, amplia y resistente.' },
];

async function main() {
  const sql = neon(process.env.DATABASE_URL);

  await sql`
    CREATE TABLE IF NOT EXISTS productos (
      id          SERIAL PRIMARY KEY,
      nombre      TEXT NOT NULL UNIQUE,
      categoria   TEXT NOT NULL,
      descripcion TEXT,
      precio      NUMERIC(10, 2) NOT NULL,
      color       TEXT,
      creado_en   TIMESTAMPTZ DEFAULT now()
    )`;

  for (const p of PRODUCTOS) {
    await sql`
      INSERT INTO productos (nombre, categoria, descripcion, precio, color)
      VALUES (${p.nombre}, ${p.categoria}, ${p.descripcion}, ${p.precio}, ${p.color})
      ON CONFLICT (nombre) DO UPDATE
        SET categoria = EXCLUDED.categoria,
            descripcion = EXCLUDED.descripcion,
            precio = EXCLUDED.precio,
            color = EXCLUDED.color`;
  }

  const filas = await sql`SELECT nombre, precio FROM productos ORDER BY categoria, nombre`;
  console.log(`✅ Tabla "productos" lista con ${filas.length} productos:`);
  for (const f of filas) console.log(`   - ${f.nombre}: ${Number(f.precio)} €`);
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
