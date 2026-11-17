// Script para comprobar que tu app se conecta a la base de datos de Neon.
// Ejecútalo con:  npm run probar
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function main() {
  const url = process.env.DATABASE_URL;

  if (!url || url.includes('PEGA_AQUI')) {
    console.error('❌ Falta la cadena de conexión.');
    console.error('   Abre el archivo .env y pega tu DATABASE_URL de Neon.');
    process.exit(1);
  }

  const sql = neon(url);

  try {
    const [fila] = await sql`SELECT version(), current_database() AS base, now() AS hora`;
    console.log('✅ ¡Conectado a Neon!');
    console.log('   Base de datos:', fila.base);
    console.log('   Hora del servidor:', fila.hora);
    console.log('   Versión:', fila.version.split(',')[0]);
  } catch (err) {
    console.error('❌ No se pudo conectar:', err.message);
    console.error('   Revisa que la cadena del .env esté completa y bien copiada.');
    process.exit(1);
  }
}

main();
