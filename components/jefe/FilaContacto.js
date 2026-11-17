'use client';

import { useRouter } from 'next/navigation';
import { Fragment, useState } from 'react';
import { ESTADOS, ETAPAS, INTERESES, ORIGENES, fechaHora } from '@/lib/etiquetas';

const euros = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

export default function FilaContacto({ contacto: c }) {
  const router = useRouter();
  const [estado, setEstado] = useState(c.estado);
  const [notas, setNotas] = useState(c.notas || '');
  const [abierta, setAbierta] = useState(false);
  const [aviso, setAviso] = useState('');
  const [ocupado, setOcupado] = useState(false);

  async function guardar(cambios) {
    setOcupado(true);
    setAviso('');
    const res = await fetch(`/api/jefe/contactos/${c.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cambios),
    });
    setOcupado(false);
    if (!res.ok) {
      setAviso('No se ha podido guardar.');
      return false;
    }
    setAviso('Guardado ✓');
    router.refresh();
    return true;
  }

  async function cambiarEstado(e) {
    const anterior = estado;
    setEstado(e.target.value);
    if (!(await guardar({ estado: e.target.value }))) setEstado(anterior);
  }

  async function borrar() {
    if (!confirm(`¿Borrar a ${c.nombre} (${c.email}) de la lista? Se eliminan sus datos y no se puede deshacer.`)) return;
    setOcupado(true);
    const res = await fetch(`/api/jefe/contactos/${c.id}`, { method: 'DELETE' });
    setOcupado(false);
    if (res.ok) router.refresh();
    else setAviso('No se ha podido borrar.');
  }

  const intereses = (c.intereses || []).map((i) => INTERESES[i] || i).join(', ');

  return (
    <Fragment>
      <tr className={abierta ? 'abierta' : ''}>
        <td className="tabla-fecha">{fechaHora(c.creado_en)}</td>
        <td>
          <strong>{c.nombre} {c.apellidos}</strong>
          <a href={`mailto:${c.email}`}>{c.email}</a>
          {c.telefono && <a href={`tel:${c.telefono.replace(/\s/g, '')}`}>{c.telefono}</a>}
        </td>
        <td>
          {c.producto ? (
            <>
              <strong>{c.producto}</strong>
              {c.precio != null && <span>{euros.format(c.precio)}</span>}
            </>
          ) : (
            <span className="tenue">—</span>
          )}
        </td>
        <td>
          <span>{ETAPAS[c.etapa] || <span className="tenue">Sin etapa</span>}</span>
          <span className="tenue">{ORIGENES[c.origen] || ''}</span>
        </td>
        <td>
          <select
            className={`estado-select estado-${estado}`}
            value={estado}
            onChange={cambiarEstado}
            disabled={ocupado}
            aria-label={`Estado de ${c.nombre}`}
          >
            {ESTADOS.map((e) => <option key={e.valor} value={e.valor}>{e.texto}</option>)}
          </select>
          {aviso && <span className={aviso.startsWith('No') ? 'err' : 'ok-mini'}>{aviso}</span>}
        </td>
        <td className="tabla-acciones">
          <button className="btn-link" onClick={() => setAbierta(!abierta)} aria-expanded={abierta}>
            {abierta ? 'Cerrar' : notas ? 'Notas •' : 'Notas'}
          </button>
        </td>
      </tr>
      {abierta && (
        <tr className="tabla-detalle">
          <td colSpan={6}>
            <div className="detalle">
              <div className="detalle-datos">
                <span><b>Código postal:</b> {c.codigo_postal || '—'}</span>
                <span><b>Le interesa:</b> {intereses || '—'}</span>
                <span><b>Novedades:</b> {c.newsletter ? 'Sí quiere recibirlas' : 'No'}</span>
              </div>
              <label htmlFor={`notas-${c.id}`}>Notas internas (solo las ves tú)</label>
              <textarea
                id={`notas-${c.id}`}
                rows={3}
                value={notas}
                maxLength={2000}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Ej.: Le escribí por WhatsApp el 20/11, quiere el de flores con su nombre bordado"
              />
              <div className="detalle-botones">
                <button className="btn btn-primary btn-sm" disabled={ocupado} onClick={() => guardar({ notas })}>
                  Guardar notas
                </button>
                <button className="btn-link peligro" disabled={ocupado} onClick={borrar}>
                  Borrar contacto
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </Fragment>
  );
}
