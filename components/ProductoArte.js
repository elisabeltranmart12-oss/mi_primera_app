import { useId } from 'react';

// Ilustración de un producto cuando todavía no tiene foto.
// Estilo "canastilla": tela acolchada con pespuntes, vivo crema, lazo y herrajes dorados.
// La forma depende de la categoría (neceser o bolsa de carro) y la tela del estampado.

const CREMA = '#fffaf3';
const CREMA_SOMBRA = '#eadfce';
const ORO = '#c9a25a';
const ORO_LUZ = '#e9cf8f';

function Flor({ x, y, r, petalo, centro }) {
  const d = r * 0.95;
  return (
    <g>
      {[0, 72, 144, 216, 288].map((a) => (
        <circle
          key={a}
          cx={x + d * Math.cos((a * Math.PI) / 180)}
          cy={y + d * Math.sin((a * Math.PI) / 180)}
          r={r}
          fill={petalo}
        />
      ))}
      <circle cx={x} cy={y} r={r * 0.75} fill={centro} />
    </g>
  );
}

// Tela de fondo según el estampado.
function Tela({ id, tipo, color }) {
  if (tipo === 'rayas') {
    return (
      <pattern id={id} width="12" height="12" patternUnits="userSpaceOnUse">
        <rect width="12" height="12" fill={color} />
        <rect width="4.5" height="12" fill={CREMA} opacity=".9" />
        <rect x="8" width="1" height="12" fill={CREMA} opacity=".45" />
      </pattern>
    );
  }
  if (tipo === 'flores') {
    return (
      <pattern id={id} width="40" height="40" patternUnits="userSpaceOnUse">
        <rect width="40" height="40" fill={color} />
        <ellipse cx="20" cy="8" rx="3.2" ry="1.4" fill="#7fae86" transform="rotate(-30 20 8)" />
        <ellipse cx="5" cy="27" rx="3" ry="1.3" fill="#7fae86" transform="rotate(40 5 27)" />
        <Flor x={10} y={10} r={2.6} petalo={CREMA} centro="#f1c45c" />
        <Flor x={29} y={28} r={2.2} petalo="#fbe3ea" centro="#f1c45c" />
        <Flor x={33} y={6} r={1.4} petalo={CREMA} centro="#f1c45c" />
        <circle cx="14" cy="32" r="1" fill={CREMA} opacity=".8" />
        <circle cx="24" cy="18" r=".9" fill={CREMA} opacity=".7" />
      </pattern>
    );
  }
  // Plumeti (lunares pequeñitos)
  return (
    <pattern id={id} width="11" height="11" patternUnits="userSpaceOnUse">
      <rect width="11" height="11" fill={color} />
      <circle cx="2.75" cy="2.75" r="1.5" fill={CREMA} />
      <circle cx="8.25" cy="8.25" r="1.5" fill={CREMA} />
    </pattern>
  );
}

// Acolchado: rombos con volumen y pespunte.
function Acolchado({ id, idVolumen }) {
  return (
    <>
      <radialGradient id={idVolumen}>
        <stop offset="0" stopColor="#fff" stopOpacity=".22" />
        <stop offset=".7" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity=".12" />
      </radialGradient>
      <pattern id={id} width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="24" height="24" fill={`url(#${idVolumen})`} />
        <path d="M0 .5 H24 M.5 0 V24" stroke={CREMA} strokeOpacity=".75" strokeWidth="1" strokeDasharray="2.2 1.8" fill="none" />
      </pattern>
    </>
  );
}

function Lazo({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-2 4 L-12 26 L-6 23 L-3 29 L3 5 Z" fill={CREMA} stroke={CREMA_SOMBRA} strokeWidth="1" />
      <path d="M2 4 L12 26 L6 23 L3 29 L-3 5 Z" fill={CREMA} stroke={CREMA_SOMBRA} strokeWidth="1" />
      <path d="M0 0 C-14 -16 -28 -10 -25 1 C-22 12 -10 9 0 0 Z" fill={CREMA} stroke={CREMA_SOMBRA} strokeWidth="1" />
      <path d="M0 0 C14 -16 28 -10 25 1 C22 12 10 9 0 0 Z" fill={CREMA} stroke={CREMA_SOMBRA} strokeWidth="1" />
      <path d="M-6 -1 C-12 -6 -18 -6 -20 -1" fill="none" stroke={CREMA_SOMBRA} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M6 -1 C12 -6 18 -6 20 -1" fill="none" stroke={CREMA_SOMBRA} strokeWidth="1.2" strokeLinecap="round" />
      <ellipse cx="0" cy="1" rx="5.5" ry="5" fill={CREMA} stroke={CREMA_SOMBRA} strokeWidth="1" />
    </g>
  );
}

// Parche bordado con un nenúfar.
function Parche({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse rx="17" ry="11" fill={CREMA} stroke={CREMA_SOMBRA} strokeWidth="1" />
      <ellipse rx="14" ry="8.5" fill="none" stroke="#7fae86" strokeWidth=".8" strokeDasharray="1.6 1.4" />
      <path d="M-8 3 a8 4 0 1 0 16 0 a8 4 0 1 0 -16 0" fill="#7fae86" />
      <path d="M0 3 L6 0" stroke={CREMA} strokeWidth="1.2" />
      <circle cx="-2" cy="-1.5" r="2.2" fill="#f2a7b8" />
      <circle cx="1.5" cy="-2.5" r="2" fill="#f7c3cf" />
    </g>
  );
}

const NECESER = 'M34 64 Q34 50 50 50 H190 Q206 50 206 64 L214 146 Q216 164 196 164 H44 Q24 164 26 146 Z';
const BOLSA = 'M42 88 H198 L210 192 Q212 212 192 212 H48 Q28 212 30 192 Z';
const BOLSILLO = 'M66 132 H174 L178 184 Q179 196 167 196 H73 Q61 196 62 184 Z';

export default function ProductoArte({ producto, ...props }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const ids = {
    tela: `tela${uid}`,
    acolchado: `acol${uid}`,
    volumen: `vol${uid}`,
    luz: `luz${uid}`,
    brillo: `bri${uid}`,
    clip: `clip${uid}`,
    clipBolsillo: `clipb${uid}`,
  };
  const color = producto.color || '#9fd0ef';
  const esBolsa = producto.categoria?.toLowerCase().includes('bolsa');

  const defs = (
    <defs>
      <Tela id={ids.tela} tipo={producto.estampado} color={color} />
      <Acolchado id={ids.acolchado} idVolumen={ids.volumen} />
      <linearGradient id={ids.luz} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity=".3" />
        <stop offset=".45" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#24404f" stopOpacity=".22" />
      </linearGradient>
      <radialGradient id={ids.brillo} cx=".28" cy=".22" r=".55">
        <stop offset="0" stopColor="#fff" stopOpacity=".35" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
      <clipPath id={ids.clip}><path d={esBolsa ? BOLSA : NECESER} /></clipPath>
      <clipPath id={ids.clipBolsillo}><path d={BOLSILLO} /></clipPath>
    </defs>
  );

  // Tela + acolchado + luces, recortado a una forma.
  const Cuerpo = ({ d, clip, acolchar = true }) => (
    <>
      <path d={d} fill={`url(#${ids.tela})`} />
      <g clipPath={`url(#${clip})`}>
        {acolchar && <rect width="240" height="240" fill={`url(#${ids.acolchado})`} />}
        <rect width="240" height="240" fill={`url(#${ids.luz})`} />
        <rect width="240" height="240" fill={`url(#${ids.brillo})`} />
      </g>
      {/* vivo (ribete) */}
      <path d={d} fill="none" stroke={CREMA} strokeWidth="5" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={CREMA_SOMBRA} strokeWidth="1" strokeLinejoin="round" transform="translate(0 1.5)" opacity=".6" />
    </>
  );

  if (esBolsa) {
    return (
      <svg viewBox="0 0 240 230" role="img" aria-label={producto.nombre} {...props}>
        {defs}
        <ellipse cx="120" cy="218" rx="96" ry="7" fill="#24404f" opacity=".13" />
        {/* asas de tela con vivo */}
        {['M74 90 C74 34 110 34 110 90', 'M130 90 C130 34 166 34 166 90'].map((d) => (
          <g key={d}>
            <path d={d} fill="none" stroke={CREMA} strokeWidth="13" strokeLinecap="round" />
            <path d={d} fill="none" stroke={`url(#${ids.tela})`} strokeWidth="9" strokeLinecap="round" />
          </g>
        ))}
        {/* mosquetones dorados */}
        {[92, 148].map((cx) => (
          <g key={cx}>
            <rect x={cx - 6} y="20" width="12" height="20" rx="6" fill="none" stroke={ORO} strokeWidth="3.4" />
            <path d={`M${cx + 4} 24 v12`} stroke={ORO_LUZ} strokeWidth="1.6" strokeLinecap="round" />
            <rect x={cx - 4} y="38" width="8" height="5" rx="1.5" fill={ORO} />
          </g>
        ))}
        <Cuerpo d={BOLSA} clip={ids.clip} />
        {/* bolsillo delantero liso con vivo */}
        <Cuerpo d={BOLSILLO} clip={ids.clipBolsillo} acolchar={false} />
        <Lazo x={120} y={134} s={0.95} />
        <Parche x={176} y={112} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 240 180" role="img" aria-label={producto.nombre} {...props}>
      {defs}
      <ellipse cx="120" cy="170" rx="96" ry="7" fill="#24404f" opacity=".13" />
      <Cuerpo d={NECESER} clip={ids.clip} />
      {/* cremallera dorada */}
      <rect x="44" y="47" width="152" height="8" rx="4" fill={CREMA} />
      <path d="M48 51 H192" stroke={ORO} strokeWidth="3" strokeDasharray="1.6 1.4" />
      {/* tirador con lengüeta de tela */}
      <circle cx="174" cy="55" r="4" fill="none" stroke={ORO} strokeWidth="2.4" />
      <rect x="168.5" y="58" width="11" height="26" rx="5" fill={`url(#${ids.tela})`} stroke={CREMA} strokeWidth="2" />
      <circle cx="174" cy="64" r="2" fill={ORO} />
      <Lazo x={68} y={70} />
      <Parche x={178} y={138} />
    </svg>
  );
}
