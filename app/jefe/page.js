import Link from 'next/link';
import { BarrasH, Columnas } from '@/components/jefe/Graficas';
import { resumen } from '@/lib/contactos';
import { ESTADOS, ETAPAS, ORIGENES, fechaCorta } from '@/lib/etiquetas';
import { euros } from '@/lib/productos';

export const dynamic = 'force-dynamic';

const textoEstado = Object.fromEntries(ESTADOS.map((e) => [e.valor, e.texto]));

function Cifra({ titulo, valor, detalle, href }) {
  const contenido = (
    <>
      <span className="cifra-titulo">{titulo}</span>
      <span className="cifra-valor">{valor}</span>
      {detalle && <span className="cifra-detalle">{detalle}</span>}
    </>
  );
  return href ? <Link className="cifra" href={href}>{contenido}</Link> : <div className="cifra">{contenido}</div>;
}

export default async function Resumen() {
  let r;
  try {
    r = await resumen();
  } catch (err) {
    console.error(err);
    return (
      <div className="container bo-seccion">
        <div className="aviso"><h3>No se ha podido cargar el resumen</h3><p>Revisa la conexión con Neon.</p></div>
      </div>
    );
  }

  const dias = r.porDia.map((d) => {
    const fecha = new Date(`${d.dia}T12:00:00`);
    return {
      clave: d.dia,
      valor: d.n,
      etiqueta: fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
    };
  });

  return (
    <div className="container bo-seccion">
      <div className="bo-cabecera">
        <div>
          <h1>Resumen</h1>
          <p>Cómo va la lista de espera de Nenúfar.</p>
        </div>
        <a className="btn btn-soft" href="/api/jefe/contactos/csv">Descargar contactos (Excel)</a>
      </div>

      <div className="cifras">
        <Cifra titulo="Contactos" valor={r.total} detalle={`+${r.semana} en los últimos 7 días`} href="/jefe/contactos" />
        <Cifra titulo="Pendientes de contactar" valor={r.pendientes} detalle="Personas a las que aún no has escrito" href="/jefe/contactos?estado=pendiente" />
        <Cifra titulo="Reservas de producto" valor={r.reservas} detalle={`${euros.format(r.valorReservas)} en reservas`} />
        <Cifra titulo="Vendido" valor={euros.format(r.valorVendido)} detalle={`${r.vendidos} contacto${r.vendidos === 1 ? '' : 's'} marcado${r.vendidos === 1 ? '' : 's'} como vendido`} href="/jefe/contactos?estado=vendido" />
      </div>

      {r.productos.sin_foto > 0 && (
        <div className="bo-tarea">
          <span>📷 {r.productos.sin_foto} de {r.productos.total} productos todavía no tienen foto.</span>
          <Link href="/jefe/productos">Subir fotos</Link>
        </div>
      )}

      <div className="bo-grid">
        <section className="bo-tarjeta bo-ancha">
          <h2>Contactos nuevos por día</h2>
          <p className="bo-sub">Últimos 14 días</p>
          <Columnas filas={dias} />
        </section>

        <section className="bo-tarjeta">
          <h2>Reservas por producto</h2>
          <p className="bo-sub">Número de personas que han pedido cada producto</p>
          <BarrasH
            filas={r.porProducto.map((p) => ({
              etiqueta: p.producto,
              valor: p.n,
              extra: euros.format(p.n * p.precio),
            }))}
            vacio="Aún nadie ha reservado un producto."
          />
        </section>

        <section className="bo-tarjeta">
          <h2>¿En qué momento están?</h2>
          <p className="bo-sub">Etapa que indican al apuntarse</p>
          <BarrasH
            filas={r.porEtapa.map((e) => ({ etiqueta: ETAPAS[e.clave] || 'Sin indicar', valor: e.n }))}
          />
        </section>

        <section className="bo-tarjeta">
          <h2>¿Cómo nos conocen?</h2>
          <p className="bo-sub">Origen de los contactos</p>
          <BarrasH
            filas={r.porOrigen.map((o) => ({ etiqueta: ORIGENES[o.clave] || 'Sin indicar', valor: o.n }))}
          />
        </section>

        <section className="bo-tarjeta">
          <h2>Últimos contactos</h2>
          <p className="bo-sub">{r.newsletter} de {r.total} quieren recibir novedades</p>
          {r.ultimos.length ? (
            <ul className="ultimos">
              {r.ultimos.map((c) => (
                <li key={c.id}>
                  <div>
                    <strong>{c.nombre} {c.apellidos}</strong>
                    <span>{c.producto ? `Reserva: ${c.producto}` : c.email}</span>
                  </div>
                  <div className="ultimos-derecha">
                    <span className={`estado estado-${c.estado}`}>{textoEstado[c.estado] || c.estado}</span>
                    <span className="ultimos-fecha">{fechaCorta(c.creado_en)}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="bo-vacio">Todavía no se ha apuntado nadie.</p>
          )}
          <Link className="btn-link" href="/jefe/contactos">Ver todos los contactos →</Link>
        </section>
      </div>
    </div>
  );
}
