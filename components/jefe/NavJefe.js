'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const SECCIONES = [
  { href: '/jefe', texto: 'Resumen' },
  { href: '/jefe/contactos', texto: 'Contactos' },
  { href: '/jefe/productos', texto: 'Productos' },
];

export default function NavJefe() {
  const ruta = usePathname();
  const router = useRouter();

  async function salir() {
    await fetch('/api/jefe/sesion', { method: 'DELETE' });
    router.push('/jefe');
    router.refresh();
  }

  return (
    <div className="bo-nav">
      <div className="container bo-nav-dentro">
        <span className="bo-titulo">Back office</span>
        <nav aria-label="Secciones del back office">
          {SECCIONES.map((s) => (
            <Link key={s.href} href={s.href} aria-current={ruta === s.href ? 'page' : undefined}>
              {s.texto}
            </Link>
          ))}
        </nav>
        <div className="bo-nav-derecha">
          <Link href="/tienda" className="btn-link">Ver la tienda ↗</Link>
          <button className="btn btn-soft btn-sm" onClick={salir}>Salir</button>
        </div>
      </div>
    </div>
  );
}
