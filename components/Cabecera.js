'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const ENLACES = [
  { href: '/', texto: 'Inicio' },
  { href: '/tienda', texto: 'Tienda' },
  { href: '/#para-ti', texto: 'Para ti' },
];

export default function Cabecera() {
  const ruta = usePathname();
  const [abierto, setAbierto] = useState(false);
  const cerrar = () => setAbierto(false);

  return (
    <header className="site-header">
      <div className="container nav">
        <Link className="brand" href="/" onClick={cerrar}>
          <img src="/logo.svg" alt="" />
          Ranita
        </Link>
        <button
          className="menu-toggle"
          aria-label="Abrir menú"
          aria-expanded={abierto}
          aria-controls="menu"
          onClick={() => setAbierto(!abierto)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
        <ul className={`menu${abierto ? ' open' : ''}`} id="menu">
          {ENLACES.map((e) => (
            <li key={e.href}>
              <Link href={e.href} onClick={cerrar} aria-current={ruta === e.href ? 'page' : undefined}>
                {e.texto}
              </Link>
            </li>
          ))}
          <li>
            <Link className="menu-cta" href="/apuntate" onClick={cerrar} aria-current={ruta === '/apuntate' ? 'page' : undefined}>
              Apúntate
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
