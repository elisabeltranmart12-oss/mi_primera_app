'use client';

import { useEffect, useState } from 'react';

const ITEMS = [
  'Bodies y pijamitas (talla 0 y 1 mes)',
  'Gorrito y calcetines',
  'Pañales de recién nacido y toallitas',
  'Muselinas',
  'Ropa cómoda y sujetador de lactancia',
  'Neceser con tus básicos de aseo',
  'Documentación y cargador del móvil',
];
const CLAVE = 'nenufar-checklist';

export default function Checklist() {
  const [marcados, setMarcados] = useState(() => ITEMS.map(() => false));

  // Recupera lo marcado en este navegador (si se puede).
  useEffect(() => {
    try {
      const guardado = JSON.parse(localStorage.getItem(CLAVE) || '[]');
      if (Array.isArray(guardado)) setMarcados(ITEMS.map((_, i) => !!guardado[i]));
    } catch {}
  }, []);

  const cambiar = (i) => {
    const nuevos = marcados.map((v, j) => (j === i ? !v : v));
    setMarcados(nuevos);
    try { localStorage.setItem(CLAVE, JSON.stringify(nuevos)); } catch {}
  };

  const hechos = marcados.filter(Boolean).length;

  return (
    <div className="checklist">
      <img className="sticker" src="/logo.svg" alt="" />
      <h3>Tu bolsa del hospital</h3>
      <p>Un pequeño regalo: ve marcando lo que ya tienes preparado.</p>
      <ul>
        {ITEMS.map((texto, i) => (
          <li key={texto}>
            <label>
              <input type="checkbox" checked={marcados[i]} onChange={() => cambiar(i)} />
              <span>{texto}</span>
            </label>
          </li>
        ))}
      </ul>
      <div className="progress" aria-hidden="true">
        <div style={{ width: `${(hechos / ITEMS.length) * 100}%` }} />
      </div>
      <div className="progress-text">
        {hechos === ITEMS.length ? '¡Todo listo! Ya solo falta tu bebé 💚' : `${hechos} de ${ITEMS.length} listos`}
      </div>
    </div>
  );
}
