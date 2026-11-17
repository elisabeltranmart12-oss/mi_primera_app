import { esJefe, noAutorizado } from '@/lib/jefe';
import { leerFiltros, listarContactos } from '@/lib/contactos';
import { ESTADOS, ETAPAS, INTERESES, ORIGENES, fechaHora } from '@/lib/etiquetas';

const textoEstado = Object.fromEntries(ESTADOS.map((e) => [e.valor, e.texto]));

// Excel en español usa ";" como separador. Escapamos comillas y evitamos fórmulas.
function celda(valor) {
  let s = valor == null ? '' : String(valor);
  if (/^[=+\-@]/.test(s)) s = `'${s}`;
  return /[;"\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// Descarga los contactos (con los mismos filtros que la pantalla) en un CSV que abre Excel.
export async function GET(request) {
  if (!(await esJefe())) return noAutorizado();
  const params = Object.fromEntries(new URL(request.url).searchParams);
  const contactos = await listarContactos(leerFiltros(params));

  const cabecera = ['Fecha', 'Nombre', 'Apellidos', 'Email', 'Teléfono', 'Código postal', 'Producto reservado',
    'Precio', 'Intereses', 'Etapa', 'Cómo nos conoció', 'Quiere novedades', 'Estado', 'Notas'];
  const filas = contactos.map((c) => [
    fechaHora(c.creado_en), c.nombre, c.apellidos, c.email, c.telefono, c.codigo_postal, c.producto,
    c.precio == null ? '' : c.precio.toFixed(2).replace('.', ','),
    (c.intereses || []).map((i) => INTERESES[i] || i).join(', '),
    ETAPAS[c.etapa] || '', ORIGENES[c.origen] || '', c.newsletter ? 'Sí' : 'No',
    textoEstado[c.estado] || c.estado, c.notas,
  ]);

  const csv = '﻿' + [cabecera, ...filas].map((f) => f.map(celda).join(';')).join('\r\n');
  const hoy = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="contactos-nenufar-${hoy}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
