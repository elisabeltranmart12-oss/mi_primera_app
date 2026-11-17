import TarjetaProducto from '@/components/TarjetaProducto';
import { agruparPorCategoria, cargarProductos, euros } from '@/lib/productos';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Tienda · Nenúfar',
  description: 'Neceseres (25 €) y bolsas de carro (50 €) de tela estampada.',
};

const FONDOS = ['var(--blue-100)', 'var(--green-100)', '#fdeef1'];

export default async function Tienda() {
  const datos = await cargarProductos();
  const categorias = agruparPorCategoria(datos.productos);

  return (
    <>
      <section className="page-head">
        <div className="container">
          <span className="eyebrow">Tienda</span>
          <h1>Neceseres y bolsas de carro</h1>
          <p>Todos de tela estampada en flores, lunares o rayas. Elige tu favorito y te lo reservamos para la apertura.</p>
          <div className="ventajas">
            <span>Tela estampada</span>
            <span>Hechos con cariño</span>
            <span>Reserva sin compromiso</span>
          </div>
        </div>
      </section>

      <section className="section productos-bg" style={{ paddingTop: 48 }}>
        <div className="container">
          {!datos.ok && (
            <div className="aviso">
              <h3>No se han podido cargar los productos</h3>
              <p>{datos.error}</p>
            </div>
          )}

          {Object.entries(categorias).map(([categoria, productos]) => {
            const precios = [...new Set(productos.map((p) => p.precio))];
            return (
              <div key={categoria} className="categoria-bloque">
                <div className="categoria-titulo">
                  <h2>{categoria}</h2>
                  <span>
                    {precios.length === 1 ? euros.format(precios[0]) : `desde ${euros.format(Math.min(...precios))}`}
                  </span>
                </div>
                <div className="rejilla">
                  {productos.map((p, i) => (
                    <TarjetaProducto key={p.id} producto={p} fondo={FONDOS[i % FONDOS.length]} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
