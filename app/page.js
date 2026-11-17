import Link from 'next/link';
import Checklist from '@/components/Checklist';
import ProductoArte from '@/components/ProductoArte';
import TarjetaProducto from '@/components/TarjetaProducto';
import { cargarProductos } from '@/lib/productos';

// Se genera en cada visita para mostrar siempre los productos y precios actuales de Neon.
export const dynamic = 'force-dynamic';

const NECESER_PORTADA = { id: 'portada', nombre: 'Neceser de flores', categoria: 'Neceseres', color: '#9fd0ef', estampado: 'flores' };

const FONDOS =['var(--blue-100)', 'var(--green-100)', '#fdeef1'];

// Para la home elegimos un neceser y una bolsa de cada estampado, sin repetir.
function destacados(productos) {
  const elegidos = [];
  const usados = new Set();
  for (const p of productos) {
    if (!usados.has(p.estampado) && elegidos.filter((e) => e.categoria === p.categoria).length < 2) {
      elegidos.push(p);
      usados.add(p.estampado);
    }
    if (elegidos.length === 3) break;
  }
  return elegidos.length ? elegidos : productos.slice(0, 3);
}

export default async function Inicio() {
  const datos = await cargarProductos();
  const lista = destacados(datos.productos);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="pill"><span className="dot" />Muy pronto abrimos</span>
            <h1>Todo lo de tu bebé, <span className="hl">ordenado</span> y bonito</h1>
            <p>
              Neceseres y bolsas de carro de tela estampada, pensados para mamás primerizas. Para que salir de casa
              con tu peque sea un paseo.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/tienda">Ver la tienda</Link>
              <Link className="btn btn-soft" href="/apuntate">Avísame de la apertura</Link>
            </div>
          </div>

          <div className="hero-art" aria-hidden="true">
            <svg viewBox="0 0 420 410">
              <g className="float d2"><ellipse cx="70" cy="70" rx="44" ry="18" fill="#fff" /><ellipse cx="92" cy="58" rx="26" ry="18" fill="#fff" /></g>
              <g className="float d3"><ellipse cx="350" cy="110" rx="36" ry="14" fill="#fff" /><ellipse cx="366" cy="100" rx="20" ry="14" fill="#fff" /></g>
              <path className="float" d="M330 40 l5 11 12 2 -9 8 2 12 -10 -6 -10 6 2 -12 -9 -8 12 -2z" fill="#f7b9c4" />
              <path className="float d3" d="M50 190 l4 8 9 1 -7 6 2 9 -8 -4 -8 4 2 -9 -7 -6 9 -1z" fill="#9fd0ef" />
              <circle className="float d2" cx="385" cy="230" r="7" fill="#8fd3a7" />
              <circle className="float" cx="30" cy="290" r="5" fill="#f7b9c4" />
              <g className="float">
                <circle cx="168" cy="112" r="34" fill="#8fd3a7" />
                <circle cx="262" cy="112" r="34" fill="#8fd3a7" />
                <g className="blink">
                  <circle cx="168" cy="110" r="24" fill="#fff" />
                  <circle cx="262" cy="110" r="24" fill="#fff" />
                  <circle cx="172" cy="114" r="13" fill="#24404f" />
                  <circle cx="258" cy="114" r="13" fill="#24404f" />
                  <circle cx="177" cy="108" r="4.5" fill="#fff" />
                  <circle cx="263" cy="108" r="4.5" fill="#fff" />
                </g>
                <ellipse cx="215" cy="175" rx="92" ry="58" fill="#8fd3a7" />
                <ellipse cx="160" cy="180" rx="12" ry="7" fill="#f7b9c4" />
                <ellipse cx="270" cy="180" rx="12" ry="7" fill="#f7b9c4" />
                <path d="M190 172 Q215 194 240 172" fill="none" stroke="#24404f" strokeWidth="5" strokeLinecap="round" />
              </g>
              <ProductoArte producto={NECESER_PORTADA} x="40" y="150" width="340" height="255" />
              <g className="float">
                <ellipse cx="160" cy="222" rx="20" ry="11" fill="#8fd3a7" />
                <ellipse cx="270" cy="222" rx="20" ry="11" fill="#8fd3a7" />
              </g>
            </svg>
          </div>
        </div>
      </section>

      <svg className="wave" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 30 C240 70 480 -10 720 30 C960 70 1200 -10 1440 30 V60 H0Z" fill="#f1fbf4" />
      </svg>

      {/* PRODUCTOS DESTACADOS */}
      <section className="section productos-bg" id="productos">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Nuestra colección</span>
            <h2>Tela estampada, hecha con cariño</h2>
            <p>Neceseres a 25 € y bolsas de carro a 50 €, en flores, lunares y rayas.</p>
          </div>

          {!datos.ok && (
            <div className="aviso">
              <h3>No se han podido cargar los productos</h3>
              <p>{datos.error}</p>
            </div>
          )}

          <div className="rejilla">
            {lista.map((p, i) => (
              <TarjetaProducto key={p.id} producto={p} fondo={FONDOS[i % FONDOS.length]} />
            ))}
          </div>

          <div className="centro">
            <Link className="btn btn-soft" href="/tienda">Ver todos los productos</Link>
          </div>
        </div>
      </section>

      <svg className="wave" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true" style={{ background: '#f1fbf4' }}>
        <path d="M0 30 C240 -10 480 70 720 30 C960 -10 1200 70 1440 30 V60 H0Z" fill="#f2f9fe" />
      </svg>

      {/* PARA TI */}
      <section className="section para-ti" id="para-ti">
        <div className="container para-ti-grid">
          <div>
            <span className="eyebrow">Pensado para mamás primerizas</span>
            <h2>Porque al principio, todo es nuevo</h2>
            <p className="lead">
              Sabemos lo que es salir de casa con mil cosas en la mano. Por eso diseñamos cada neceser y cada bolsa
              para que encuentres lo que buscas con una sola mano (la otra suele estar ocupada).
            </p>
            <div className="features">
              <div className="feature">
                <span className="b"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z" /></svg></span>
                <div><h3>Lavables</h3><p>Tela que se limpia con un paño o en la lavadora.</p></div>
              </div>
              <div className="feature">
                <span className="b"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M4 12h16M12 4v16" /></svg></span>
                <div><h3>Bolsillos para todo</h3><p>Cada cosa en su sitio, sin rebuscar.</p></div>
              </div>
              <div className="feature">
                <span className="b"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M5 10l7-7 7 7" /></svg></span>
                <div><h3>Ligeros</h3><p>Bastante peso llevas ya con tu peque en brazos.</p></div>
              </div>
              <div className="feature">
                <span className="b"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21c-5-3-8-6-8-10a4 4 0 0 1 8-1 4 4 0 0 1 8 1c0 4-3 7-8 10z" /></svg></span>
                <div><h3>Estampados bonitos</h3><p>Flores, lunares y rayas en colores suaves.</p></div>
              </div>
            </div>
          </div>
          <Checklist />
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <div className="cta-box">
            <img src="/logo.svg" alt="" />
            <div>
              <h2>¡Salta a la lista de espera!</h2>
              <p>Te avisamos de la apertura antes que a nadie, con invitación a la inauguración y un descuento de bienvenida.</p>
            </div>
            <Link className="btn btn-primary" href="/apuntate">Quiero apuntarme</Link>
          </div>
        </div>
      </section>
    </>
  );
}
