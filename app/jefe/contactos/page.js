import FilaContacto from '@/components/jefe/FilaContacto';
import { leerFiltros, listarContactos, productosReservables } from '@/lib/contactos';
import { ESTADOS, ETAPAS } from '@/lib/etiquetas';

export const dynamic = 'force-dynamic';

export default async function Contactos({ searchParams }) {
  const filtros = leerFiltros(await searchParams);
  const [contactos, productos] = await Promise.all([listarContactos(filtros), productosReservables()]);
  const hayFiltros = Object.values(filtros).some(Boolean);
  const csv = `/api/jefe/contactos/csv?${new URLSearchParams(Object.entries(filtros).filter(([, v]) => v))}`;

  return (
    <div className="container bo-seccion">
      <div className="bo-cabecera">
        <div>
          <h1>Contactos</h1>
          <p>Personas apuntadas a la lista de espera. Cambia su estado según vayas hablando con ellas.</p>
        </div>
        <a className="btn btn-soft" href={csv}>Descargar {hayFiltros ? 'esta lista' : 'todo'} (Excel)</a>
      </div>

      <form className="bo-filtros" method="get">
        <input type="search" name="q" defaultValue={filtros.q} placeholder="Buscar nombre, email o teléfono" aria-label="Buscar" />
        <select name="estado" defaultValue={filtros.estado} aria-label="Estado">
          <option value="">Todos los estados</option>
          {ESTADOS.map((e) => <option key={e.valor} value={e.valor}>{e.texto}</option>)}
        </select>
        <select name="producto" defaultValue={filtros.producto} aria-label="Producto reservado">
          <option value="">Cualquier producto</option>
          <option value="__sin__">Sin reserva</option>
          {productos.map((p) => <option key={p.nombre} value={p.nombre}>{p.nombre}</option>)}
        </select>
        <select name="etapa" defaultValue={filtros.etapa} aria-label="Etapa">
          <option value="">Cualquier etapa</option>
          {Object.entries(ETAPAS).map(([v, t]) => <option key={v} value={v}>{t}</option>)}
        </select>
        <button className="btn btn-primary btn-sm">Filtrar</button>
        {hayFiltros && <a className="btn-link" href="/jefe/contactos">Quitar filtros</a>}
      </form>

      <p className="bo-sub">{contactos.length} contacto{contactos.length === 1 ? '' : 's'}</p>

      {contactos.length ? (
        <div className="tabla-wrap">
          <table className="tabla">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Persona</th>
                <th>Reserva</th>
                <th>Etapa · origen</th>
                <th>Estado</th>
                <th><span className="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              {contactos.map((c) => (
                <FilaContacto key={c.id} contacto={JSON.parse(JSON.stringify(c))} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bo-tarjeta bo-vacio-grande">
          <img src="/logo.svg" alt="" />
          <p>{hayFiltros ? 'Ningún contacto coincide con estos filtros.' : 'Todavía no se ha apuntado nadie. ¡Comparte la web!'}</p>
        </div>
      )}
    </div>
  );
}
