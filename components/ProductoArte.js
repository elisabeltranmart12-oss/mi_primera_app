import { useId } from 'react';

// Ilustración de un producto cuando todavía no tiene foto.
// Estilo "block print": algodón estampado con pequeñas flores repetidas,
// acolchado en canales verticales y ribete de rayitas verdes en costuras y cremallera.
// La forma depende de la categoría (neceser o bolsa de carro) y la tela del estampado:
//   flores  → claveles sueltos en filas alternas sobre fondo claro
//   lunares → florecitas menudas muy juntas sobre fondo de color
//   rayas   → franjas de enredadera floral alternando con franjas de color

const VERDE_HOJA = '#6f9a4f';
const VERDE_RIBETE = '#9cc46a';
const CRUDO = '#fbf7ef';
const ROSA_FLOR = '#d0506a';

// Mezcla dos colores hex (t = 0 → a, t = 1 → b).
function mezclar(a, b, t) {
  const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('')}`;
}

// Clavel con tallo y dos hojas (motivo "buti").
function Clavel({ x, y, petalo, interior }) {
  const petalos = [0, 60, 120, 180, 240, 300].map((a) => {
    const r = (a * Math.PI) / 180;
    return <circle key={a} cx={(x + 2.5 * Math.cos(r)).toFixed(2)} cy={(y + 2.5 * Math.sin(r)).toFixed(2)} r="2.3" fill={petalo} />;
  });
  return (
    <g>
      <path d={`M${x} ${y + 3} V${y + 13}`} stroke={VERDE_HOJA} strokeWidth="1" />
      <ellipse cx={x - 3.2} cy={y + 9} rx="3.4" ry="1.5" fill={VERDE_HOJA} transform={`rotate(-35 ${x - 3.2} ${y + 9})`} />
      <ellipse cx={x + 3.2} cy={y + 10.5} rx="3.4" ry="1.5" fill={VERDE_HOJA} transform={`rotate(35 ${x + 3.2} ${y + 10.5})`} />
      {petalos}
      <circle cx={x} cy={y} r="2.2" fill={interior} />
      <circle cx={x} cy={y} r=".8" fill={CRUDO} />
    </g>
  );
}

// Florecita de cuatro pétalos.
function Florecita({ x, y, color, r = 1.15 }) {
  return (
    <g>
      {[[0, -1], [1, 0], [0, 1], [-1, 0]].map(([dx, dy]) => (
        <circle key={`${dx}${dy}`} cx={x + dx * r * 1.2} cy={y + dy * r * 1.2} r={r} fill={color} />
      ))}
      <circle cx={x} cy={y} r={r * 0.6} fill={CRUDO} />
    </g>
  );
}

function Estampado({ id, tipo, color }) {
  const oscuro = mezclar(color, '#3a1f2e', 0.38);
  const medio = mezclar(color, '#b8405e', 0.35);

  if (tipo === 'rayas') {
    return (
      <pattern id={id} width="26" height="16" patternUnits="userSpaceOnUse">
        <rect width="26" height="16" fill={color} />
        <rect x="6" width="14" height="16" fill={CRUDO} />
        <path d="M6.6 0 V16 M19.4 0 V16" stroke={oscuro} strokeWidth=".7" />
        <path d="M13 0 Q16 4 13 8 Q10 12 13 16" fill="none" stroke={VERDE_HOJA} strokeWidth=".8" />
        <ellipse cx="15.2" cy="4.5" rx="1.8" ry=".9" fill={VERDE_HOJA} />
        <ellipse cx="10.8" cy="12" rx="1.8" ry=".9" fill={VERDE_HOJA} />
        <Florecita x={11} y={4} color={oscuro} r={1.3} />
        <Florecita x={15} y={12} color={medio} r={1.3} />
        <circle cx="3" cy="8" r=".9" fill={CRUDO} opacity=".8" />
        <circle cx="23" cy="0" r=".9" fill={CRUDO} opacity=".8" />
        <circle cx="23" cy="16" r=".9" fill={CRUDO} opacity=".8" />
      </pattern>
    );
  }

  if (tipo === 'lunares') {
    return (
      <pattern id={id} width="16" height="16" patternUnits="userSpaceOnUse">
        <rect width="16" height="16" fill={color} />
        <ellipse cx="7" cy="6.5" rx="1.6" ry=".8" fill={VERDE_HOJA} transform="rotate(30 7 6.5)" />
        <ellipse cx="15" cy="14.5" rx="1.6" ry=".8" fill={VERDE_HOJA} transform="rotate(-30 15 14.5)" />
        <Florecita x={4} y={4} color={ROSA_FLOR} />
        <Florecita x={12} y={12} color={ROSA_FLOR} />
        <circle cx="12" cy="4" r=".7" fill={CRUDO} />
        <circle cx="4" cy="12" r=".7" fill={CRUDO} />
      </pattern>
    );
  }

  // flores
  const fondo = mezclar(color, CRUDO, 0.62);
  return (
    <pattern id={id} width="30" height="36" patternUnits="userSpaceOnUse">
      <rect width="30" height="36" fill={fondo} />
      <Clavel x={8} y={7} petalo={medio} interior={oscuro} />
      <Clavel x={23} y={25} petalo={medio} interior={oscuro} />
      <Clavel x={23} y={-11} petalo={medio} interior={oscuro} />
      <circle cx="23" cy="9" r=".8" fill={medio} opacity=".6" />
      <circle cx="8" cy="27" r=".8" fill={medio} opacity=".6" />
    </pattern>
  );
}

// Formas
const NECESER = 'M42 42 Q40 20 64 20 H176 Q200 20 198 42 L203 126 Q205 150 180 150 H60 Q35 150 37 126 Z';
const BOLSA = 'M36 82 H204 L214 196 Q216 216 194 216 H46 Q24 216 26 196 Z';
const BOLSILLO = 'M60 126 H180 L183 186 Q184 198 172 198 H68 Q56 198 57 186 Z';

export default function ProductoArte({ producto, ...props }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const id = (n) => `${n}${uid}`;
  const color = producto.color || '#9fd0ef';
  const esBolsa = producto.categoria?.toLowerCase().includes('bolsa');
  const forma = esBolsa ? BOLSA : NECESER;

  const defs = (
    <defs>
      <Estampado id={id('tela')} tipo={producto.estampado} color={color} />
      {/* ribete de rayitas verdes */}
      <pattern id={id('ribete')} width="4" height="4" patternUnits="userSpaceOnUse">
        <rect width="4" height="4" fill="#ffffff" />
        <rect width="2" height="4" fill={VERDE_RIBETE} />
      </pattern>
      {/* acolchado en canales verticales */}
      <linearGradient id={id('canalLuz')} x1="0" x2="1">
        <stop offset="0" stopColor="#000" stopOpacity=".24" />
        <stop offset=".4" stopColor="#fff" stopOpacity=".26" />
        <stop offset=".7" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity=".2" />
      </linearGradient>
      <pattern id={id('canal')} width="9" height="10" patternUnits="userSpaceOnUse">
        <rect width="9" height="10" fill={`url(#${id('canalLuz')})`} />
        <path d="M.4 0 V10" stroke="#fff" strokeOpacity=".55" strokeWidth=".6" strokeDasharray="1.6 1.2" />
      </pattern>
      {/* volumen general: bordes y base más oscuros */}
      <linearGradient id={id('vol')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity=".3" />
        <stop offset=".4" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#2b1d24" stopOpacity=".3" />
      </linearGradient>
      <linearGradient id={id('lados')} x1="0" x2="1">
        <stop offset="0" stopColor="#2b1d24" stopOpacity=".34" />
        <stop offset=".16" stopColor="#2b1d24" stopOpacity="0" />
        <stop offset=".84" stopColor="#2b1d24" stopOpacity="0" />
        <stop offset="1" stopColor="#2b1d24" stopOpacity=".34" />
      </linearGradient>
      <clipPath id={id('clip')}><path d={forma} /></clipPath>
      <clipPath id={id('clipB')}><path d={BOLSILLO} /></clipPath>
    </defs>
  );

  const Tela = ({ d, clip }) => (
    <>
      <path d={d} fill={`url(#${id('tela')})`} />
      <g clipPath={`url(#${clip})`}>
        <rect width="240" height="240" fill={`url(#${id('canal')})`} />
        <rect width="240" height="240" fill={`url(#${id('vol')})`} />
        <rect width="240" height="240" fill={`url(#${id('lados')})`} />
      </g>
      <path d={d} fill="none" stroke={`url(#${id('ribete')})`} strokeWidth="3" strokeLinejoin="round" />
    </>
  );

  // Cremallera con ribete de rayitas a ambos lados.
  const Cremallera = ({ x1, x2, y }) => (
    <g>
      <rect x={x1} y={y - 9} width={x2 - x1} height="5" fill={`url(#${id('ribete')})`} />
      <rect x={x1} y={y + 4} width={x2 - x1} height="5" fill={`url(#${id('ribete')})`} />
      <rect x={x1} y={y - 4} width={x2 - x1} height="8" fill="#ffffff" />
      <path d={`M${x1 + 3} ${y} H${x2 - 3}`} stroke="#d9d4cc" strokeWidth="2.4" strokeDasharray="1.2 1" />
      <rect x={x2 - 22} y={y - 3} width="9" height="6" rx="1.5" fill="#c9c4bb" />
      <rect x={x2 - 14} y={y - 1.6} width="9" height="3.2" rx="1.6" fill="#b5afa5" />
    </g>
  );

  if (esBolsa) {
    return (
      <svg viewBox="0 0 240 232" role="img" aria-label={producto.nombre} {...props}>
        {defs}
        <ellipse cx="120" cy="222" rx="96" ry="6" fill="#24404f" opacity=".13" />
        {/* asas acolchadas con ribete */}
        {['M70 84 C70 30 106 30 106 84', 'M134 84 C134 30 170 30 170 84'].map((d) => (
          <g key={d}>
            <path d={d} fill="none" stroke={VERDE_RIBETE} strokeWidth="13" strokeLinecap="round" />
            <path d={d} fill="none" stroke={`url(#${id('tela')})`} strokeWidth="9" strokeLinecap="round" />
          </g>
        ))}
        {/* mosquetones */}
        {[88, 152].map((cx) => (
          <g key={cx}>
            <rect x={cx - 6} y="16" width="12" height="20" rx="6" fill="none" stroke="#c9a25a" strokeWidth="3.2" />
            <path d={`M${cx + 4} 20 v12`} stroke="#ecd59b" strokeWidth="1.4" strokeLinecap="round" />
          </g>
        ))}
        <Tela d={BOLSA} clip={id('clip')} />
        {/* vivo de rayitas en la boca de la bolsa */}
        <rect x="35" y="80" width="170" height="8" rx="2" fill={`url(#${id('ribete')})`} />
        <Tela d={BOLSILLO} clip={id('clipB')} />
        <rect x="59" y="124" width="122" height="6" rx="2" fill={`url(#${id('ribete')})`} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 240 166" role="img" aria-label={producto.nombre} {...props}>
      {defs}
      <ellipse cx="120" cy="158" rx="98" ry="6" fill="#24404f" opacity=".13" />
      <Tela d={NECESER} clip={id('clip')} />
      <Cremallera x1={40} x2={200} y={46} />
    </svg>
  );
}
