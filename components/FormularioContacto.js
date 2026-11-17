'use client';

import Link from 'next/link';
import { useState } from 'react';
import ImagenProducto from './ImagenProducto';

const INTERESES = [
  { valor: 'neceseres', texto: 'Neceseres' },
  { valor: 'bolsas-de-carro', texto: 'Bolsas de carro' },
  { valor: 'personalizados', texto: 'Personalizados' },
  { valor: 'regalo', texto: 'Para regalar' },
];

function validar(d) {
  const e = {};
  if (!d.nombre.trim()) e.nombre = 'Escribe tu nombre.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) e.email = 'Escribe un email válido.';
  if (d.telefono && !/^[+\d][\d\s-]{6,18}$/.test(d.telefono.trim())) e.telefono = 'Revisa el teléfono.';
  if (d.codigo_postal && !/^\d{5}$/.test(d.codigo_postal.trim())) e.codigo_postal = 'Debe tener 5 dígitos.';
  if (!d.consentimiento) e.consentimiento = 'Necesitamos tu consentimiento para guardar tus datos.';
  return e;
}

export default function FormularioContacto({ productos, productoInicial }) {
  const [producto, setProducto] = useState(productoInicial || '');
  const [errores, setErrores] = useState({});
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null); // 'nuevo' | 'repetido'

  const elegido = productos.find((p) => p.slug === producto);
  const euros = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

  async function enviar(ev) {
    ev.preventDefault();
    setError('');
    const fd = new FormData(ev.currentTarget);
    const datos = {
      nombre: fd.get('nombre') || '',
      apellidos: fd.get('apellidos') || '',
      email: fd.get('email') || '',
      telefono: fd.get('telefono') || '',
      codigo_postal: fd.get('codigo_postal') || '',
      producto,
      etapa: fd.get('etapa') || '',
      intereses: fd.getAll('intereses'),
      origen: fd.get('origen') || '',
      consentimiento: fd.get('consentimiento') === 'on',
      newsletter: fd.get('newsletter') === 'on',
      website: fd.get('website') || '',
    };

    const e = validar(datos);
    setErrores(e);
    if (Object.keys(e).length) {
      ev.currentTarget.querySelector(`[name="${Object.keys(e)[0]}"]`)?.focus();
      return;
    }

    setEnviando(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (json.errors) setErrores(json.errors);
        throw new Error(json.error || 'No hemos podido guardar tus datos. Inténtalo de nuevo.');
      }
      setResultado(json.duplicate ? 'repetido' : 'nuevo');
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  if (resultado) {
    return (
      <div className="success">
        <img src="/logo.svg" alt="" />
        <h2>{resultado === 'repetido' ? '¡Ya estabas en la lista!' : '¡Ya estás en la lista!'}</h2>
        <p>
          {elegido
            ? `Te guardamos tu ${elegido.nombre.toLowerCase()} para la apertura. Te escribiremos muy pronto.`
            : 'Te escribiremos en cuanto tengamos fecha de apertura.'}
        </p>
        <Link className="btn btn-soft" href="/tienda">Seguir viendo la tienda</Link>
      </div>
    );
  }

  const campo = (nombre) => `field${errores[nombre] ? ' invalid' : ''}`;
  const err = (nombre) => errores[nombre] && <div className="err">{errores[nombre]}</div>;

  return (
    <form onSubmit={enviar} noValidate>
      <h2>Tus datos</h2>
      <p className="sub">Solo te escribiremos para contarte novedades de la apertura.</p>

      {error && <div className="banner" role="alert">{error}</div>}

      {elegido && (
        <div className="reserva">
          <ImagenProducto producto={elegido} />
          <div>
            <strong>{elegido.nombre} · {euros.format(elegido.precio)}</strong>
            <span>Te lo reservamos sin compromiso para el día de la apertura.</span>
          </div>
        </div>
      )}

      <div className="row">
        <div className={campo('nombre')}>
          <label htmlFor="nombre">Nombre</label>
          <input id="nombre" name="nombre" type="text" autoComplete="given-name" required maxLength={80} />
          {err('nombre')}
        </div>
        <div className="field">
          <label htmlFor="apellidos">Apellidos <span className="opt">(opcional)</span></label>
          <input id="apellidos" name="apellidos" type="text" autoComplete="family-name" maxLength={120} />
        </div>
      </div>

      <div className={campo('email')}>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required maxLength={160} />
        {err('email')}
      </div>

      <div className="row">
        <div className={campo('telefono')}>
          <label htmlFor="telefono">Teléfono <span className="opt">(opcional)</span></label>
          <input id="telefono" name="telefono" type="tel" autoComplete="tel" maxLength={20} />
          {err('telefono')}
        </div>
        <div className={campo('codigo_postal')}>
          <label htmlFor="codigo_postal">Código postal <span className="opt">(opcional)</span></label>
          <input id="codigo_postal" name="codigo_postal" type="text" inputMode="numeric" autoComplete="postal-code" maxLength={10} />
          {err('codigo_postal')}
        </div>
      </div>

      <div className="field">
        <label htmlFor="producto">¿Quieres reservar algún producto? <span className="opt">(opcional)</span></label>
        <select id="producto" name="producto" value={producto} onChange={(e) => setProducto(e.target.value)}>
          <option value="">Todavía no lo sé</option>
          {productos.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.nombre} · {euros.format(p.precio)}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="etapa">¿En qué momento estás? <span className="opt">(opcional)</span></label>
        <select id="etapa" name="etapa" defaultValue="">
          <option value="">Selecciona una opción</option>
          <option value="embarazada">Estoy embarazada</option>
          <option value="0-6">Mi bebé tiene 0-6 meses</option>
          <option value="6-12">Mi bebé tiene 6-12 meses</option>
          <option value="mas-1">Mi peque tiene más de 1 año</option>
          <option value="regalo">Busco un regalo</option>
        </select>
      </div>

      <fieldset>
        <legend>¿Qué te interesa? <span className="opt">(opcional)</span></legend>
        <div className="chips">
          {INTERESES.map((i) => (
            <label key={i.valor} className="chip">
              <input type="checkbox" name="intereses" value={i.valor} />
              <span>{i.texto}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="field">
        <label htmlFor="origen">¿Cómo nos has conocido? <span className="opt">(opcional)</span></label>
        <select id="origen" name="origen" defaultValue="">
          <option value="">Selecciona una opción</option>
          <option value="instagram">Instagram</option>
          <option value="tiktok">TikTok</option>
          <option value="amigos">Amigos o familia</option>
          <option value="paseando">Pasando por la tienda</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      <div className="hp" aria-hidden="true">
        <label htmlFor="website">No rellenar</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={campo('consentimiento')}>
        <label className="check">
          <input type="checkbox" name="consentimiento" required />
          <span>
            He leído y acepto que mis datos se usen para informarme sobre la apertura de la tienda, según la{' '}
            <a href="#" onClick={(e) => e.preventDefault()}>política de privacidad</a>.
          </span>
        </label>
        {err('consentimiento')}
      </div>
      <label className="check">
        <input type="checkbox" name="newsletter" />
        <span>Quiero recibir también novedades y ofertas después de la apertura.</span>
      </label>

      <button type="submit" className="btn btn-primary submit" disabled={enviando}>
        {enviando ? 'Enviando…' : elegido ? 'Reservar y apuntarme' : 'Apuntarme'}
      </button>
    </form>
  );
}
