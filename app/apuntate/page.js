import FormularioContacto from '@/components/FormularioContacto';
import { cargarProductos } from '@/lib/productos';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Apúntate · Nenúfar',
  description: 'Apúntate y sé de las primeras en saber cuándo abre Nenúfar.',
};

const Tick = () => (
  <span className="b">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
  </span>
);

export default async function Apuntate({ searchParams }) {
  const { producto } = await searchParams;
  const { productos } = await cargarProductos();
  const lista = productos.map(({ id, nombre, categoria, precio, color, slug, estampado, tiene_foto, version }) => ({
    id, nombre, categoria, precio, color, slug, estampado, tiene_foto, version,
  }));
  const inicial = lista.some((p) => p.slug === producto) ? producto : '';

  return (
    <div className="page">
      <div className="container form-grid">
        <section className="intro">
          <img className="frog" src="/logo.svg" alt="" />
          <h1>¡Sé de las primeras en saber cuándo abrimos!</h1>
          <p>Déjanos tus datos y te contamos todas las novedades de la apertura de Nenúfar antes que a nadie.</p>
          <ul className="perks">
            <li><Tick />Invitación a la inauguración</li>
            <li><Tick />Descuento de bienvenida</li>
            <li><Tick />Reserva tu neceser o bolsa favorita</li>
          </ul>
        </section>
        <section className="form-card" aria-live="polite">
          <FormularioContacto productos={lista} productoInicial={inicial} />
        </section>
      </div>
    </div>
  );
}
