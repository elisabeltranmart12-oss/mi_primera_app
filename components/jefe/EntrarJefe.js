'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EntrarJefe({ configurada }) {
  const router = useRouter();
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [entrando, setEntrando] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    setError('');
    setEntrando(true);
    try {
      const res = await fetch('/api/jefe/sesion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clave }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'No se ha podido entrar.');
      router.refresh();
    } catch (err) {
      setError(err.message);
      setEntrando(false);
    }
  }

  return (
    <div className="page jefe-login">
      <div className="container">
        <form className="form-card jefe-login-card" onSubmit={entrar}>
          <img className="frog" src="/logo.svg" alt="" />
          <h1>Zona jefe</h1>
          <p className="sub">Escribe tu clave para editar los productos de la tienda.</p>
          {!configurada && (
            <div className="banner" role="alert">
              Falta configurar la clave de jefe (variable <code>ADMIN_PASSWORD</code>).
            </div>
          )}
          {error && <div className="banner" role="alert">{error}</div>}
          <div className="field">
            <label htmlFor="clave">Clave de jefe</label>
            <input
              id="clave"
              type="password"
              autoComplete="current-password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              required
              autoFocus
            />
          </div>
          <button className="btn btn-primary submit" disabled={entrando || !clave}>
            {entrando ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
