// Textos legibles para los valores guardados en la base de datos.
// Se usa tanto en el servidor como en el navegador.

export const ESTADOS = [
  { valor: 'pendiente', texto: 'Pendiente' },
  { valor: 'contactado', texto: 'Contactado' },
  { valor: 'vendido', texto: 'Vendido' },
  { valor: 'descartado', texto: 'Descartado' },
];
export const VALORES_ESTADO = ESTADOS.map((e) => e.valor);

export const ETAPAS = {
  embarazada: 'Embarazada',
  '0-6': 'Bebé 0-6 meses',
  '6-12': 'Bebé 6-12 meses',
  'mas-1': 'Más de 1 año',
  regalo: 'Busca regalo',
};

export const ORIGENES = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  amigos: 'Amigos o familia',
  paseando: 'Pasando por la tienda',
  otro: 'Otro',
};

export const INTERESES = {
  neceseres: 'Neceseres',
  'bolsas-de-carro': 'Bolsas de carro',
  personalizados: 'Personalizados',
  regalo: 'Para regalar',
};

export const fechaCorta = (f) =>
  new Date(f).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', timeZone: 'Europe/Madrid' });

export const fechaHora = (f) =>
  new Date(f).toLocaleString('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid',
  });
