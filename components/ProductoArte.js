// Ilustración de cada producto: la forma depende de la categoría
// (neceser o bolsa de carro) y el estampado del nombre (flores, lunares, rayas).

function Patron({ id, tipo, color }) {
  if (tipo === 'rayas') {
    return (
      <pattern id={id} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
        <rect width="16" height="16" fill={color} />
        <rect width="7" height="16" fill="#ffffff" opacity=".55" />
      </pattern>
    );
  }
  if (tipo === 'flores') {
    return (
      <pattern id={id} width="34" height="34" patternUnits="userSpaceOnUse">
        <rect width="34" height="34" fill={color} />
        <g fill="#ffffff" opacity=".8">
          <circle cx="9" cy="5" r="3.2" />
          <circle cx="13" cy="9" r="3.2" />
          <circle cx="9" cy="13" r="3.2" />
          <circle cx="5" cy="9" r="3.2" />
        </g>
        <circle cx="9" cy="9" r="2.4" fill="#ffd56b" />
        <g fill="#ffffff" opacity=".6">
          <circle cx="26" cy="22" r="2.2" />
          <circle cx="29" cy="25" r="2.2" />
          <circle cx="26" cy="28" r="2.2" />
          <circle cx="23" cy="25" r="2.2" />
        </g>
      </pattern>
    );
  }
  return (
    <pattern id={id} width="20" height="20" patternUnits="userSpaceOnUse">
      <rect width="20" height="20" fill={color} />
      <circle cx="5" cy="5" r="3.4" fill="#ffffff" opacity=".75" />
      <circle cx="15" cy="15" r="3.4" fill="#ffffff" opacity=".75" />
    </pattern>
  );
}

export default function ProductoArte({ producto }) {
  const id = `pat-${producto.id}`;
  const color = producto.color || '#9fd0ef';
  const esBolsa = producto.categoria.toLowerCase().includes('bolsa');

  if (esBolsa) {
    return (
      <svg viewBox="0 0 200 180" role="img" aria-label={producto.nombre}>
        <defs><Patron id={id} tipo={producto.estampado} color={color} /></defs>
        {/* asas con mosquetones */}
        <path d="M62 62 V40 a14 14 0 0 1 28 0 V62" fill="none" stroke="#24404f" strokeWidth="6" strokeLinecap="round" />
        <path d="M110 62 V40 a14 14 0 0 1 28 0 V62" fill="none" stroke="#24404f" strokeWidth="6" strokeLinecap="round" />
        <circle cx="76" cy="26" r="6" fill="none" stroke="#24404f" strokeWidth="4" />
        <circle cx="124" cy="26" r="6" fill="none" stroke="#24404f" strokeWidth="4" />
        {/* cuerpo */}
        <path d="M32 62 H168 L158 160 Q156 172 144 172 H56 Q44 172 42 160 Z" fill={`url(#${id})`} />
        <path d="M32 62 H168 L166 80 H34 Z" fill="#24404f" opacity=".12" />
        {/* bolsillo */}
        <rect x="68" y="104" width="64" height="40" rx="12" fill="#ffffff" opacity=".85" />
        <path d="M100 132 c-8 -5 -12 -9 -12 -13 a5 5 0 0 1 12 -2 a5 5 0 0 1 12 2 c0 4 -4 8 -12 13z" fill="#f7b9c4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 200 150" role="img" aria-label={producto.nombre}>
      <defs><Patron id={id} tipo={producto.estampado} color={color} /></defs>
      {/* cuerpo del neceser */}
      <path d="M26 46 Q26 30 42 30 H158 Q174 30 174 46 L182 122 Q184 140 164 140 H36 Q16 140 18 122 Z" fill={`url(#${id})`} />
      {/* cremallera */}
      <path d="M30 44 H170" stroke="#24404f" strokeWidth="3" strokeDasharray="5 5" strokeLinecap="round" opacity=".55" />
      <circle cx="150" cy="44" r="7" fill="#ffffff" stroke="#24404f" strokeWidth="3" />
      <path d="M150 51 v16" stroke="#24404f" strokeWidth="3" strokeLinecap="round" />
      {/* etiqueta ranita */}
      <rect x="40" y="104" width="38" height="22" rx="6" fill="#ffffff" />
      <circle cx="53" cy="113" r="3.4" fill="#8fd3a7" />
      <circle cx="65" cy="113" r="3.4" fill="#8fd3a7" />
      <path d="M52 119 q7 5 14 0" fill="none" stroke="#24404f" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
