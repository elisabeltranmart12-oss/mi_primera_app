// Validación de los datos del formulario "Apúntate" (se usa en el servidor).
export const INTERESES = ['neceseres', 'bolsas-de-carro', 'personalizados', 'regalo'];
const ETAPAS = ['', 'embarazada', '0-6', '6-12', 'mas-1', 'regalo'];
const ORIGENES = ['', 'instagram', 'tiktok', 'amigos', 'paseando', 'otro'];

const texto = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export function validarLead(body) {
  const lead = {
    nombre: texto(body?.nombre, 80),
    apellidos: texto(body?.apellidos, 120),
    email: texto(body?.email, 160).toLowerCase(),
    telefono: texto(body?.telefono, 20),
    codigo_postal: texto(body?.codigo_postal, 10),
    producto: texto(body?.producto, 80),
    intereses: Array.isArray(body?.intereses) ? body.intereses.filter((i) => INTERESES.includes(i)) : [],
    etapa: ETAPAS.includes(body?.etapa) ? body.etapa : '',
    origen: ORIGENES.includes(body?.origen) ? body.origen : '',
    consentimiento: body?.consentimiento === true,
    newsletter: body?.newsletter === true,
  };

  const errores = {};
  if (!lead.nombre) errores.nombre = 'Escribe tu nombre.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email)) errores.email = 'Escribe un email válido.';
  if (lead.telefono && !/^[+\d][\d\s-]{6,18}$/.test(lead.telefono)) errores.telefono = 'Revisa el teléfono.';
  if (lead.codigo_postal && !/^\d{5}$/.test(lead.codigo_postal)) errores.codigo_postal = 'Debe tener 5 dígitos.';
  if (!lead.consentimiento) errores.consentimiento = 'Necesitamos tu consentimiento para guardar tus datos.';

  // Campo trampa: las personas no lo ven; si viene relleno, es un bot.
  const esBot = typeof body?.website === 'string' && body.website.length > 0;

  return { lead, errores, esBot };
}
