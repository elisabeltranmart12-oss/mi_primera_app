'use client';

import { useEffect, useRef, useState } from 'react';
import ProductoArte from '../ProductoArte';

const LADO_MAX = 1400;

// Reduce la foto en el navegador antes de subirla (más rápida y ligera).
async function prepararFoto(archivo) {
  const imagen = await createImageBitmap(archivo);
  const escala = Math.min(1, LADO_MAX / Math.max(imagen.width, imagen.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(imagen.width * escala);
  canvas.height = Math.round(imagen.height * escala);
  canvas.getContext('2d').drawImage(imagen, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise((ok) => canvas.toBlob(ok, 'image/jpeg', 0.85));
  return new File([blob], 'foto.jpg', { type: 'image/jpeg' });
}

function estampadoDe(nombre) {
  const n = nombre.toLowerCase();
  if (n.includes('flor') || n.includes('liberty')) return 'flores';
  if (n.includes('raya')) return 'rayas';
  return 'lunares';
}

export default function EditorProducto({ producto, nuevo = false, onGuardado, onCancelar }) {
  const [campos, setCampos] = useState({
    nombre: producto.nombre,
    categoria: producto.categoria,
    descripcion: producto.descripcion ?? '',
    precio: String(producto.precio).replace('.', ','),
    color: producto.color || '#9fd0ef',
  });
  const [foto, setFoto] = useState(null); // File nuevo
  const [vistaFoto, setVistaFoto] = useState(
    producto.tiene_foto ? `/api/fotos/${producto.id}?v=${producto.version}` : ''
  );
  const [quitarFoto, setQuitarFoto] = useState(false);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const inputFoto = useRef(null);

  useEffect(() => () => { if (vistaFoto.startsWith('blob:')) URL.revokeObjectURL(vistaFoto); }, [vistaFoto]);

  const cambiar = (campo) => (e) => {
    setCampos({ ...campos, [campo]: e.target.value });
    setMensaje('');
  };

  async function elegirFoto(e) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    setError('');
    try {
      const reducida = await prepararFoto(archivo);
      setFoto(reducida);
      setQuitarFoto(false);
      setVistaFoto(URL.createObjectURL(reducida));
      setMensaje('');
    } catch {
      setError('No se ha podido leer esa imagen. Prueba con otra (JPG o PNG).');
    }
  }

  function borrarFoto() {
    setFoto(null);
    setVistaFoto('');
    setQuitarFoto(true);
    if (inputFoto.current) inputFoto.current.value = '';
  }

  async function guardar(e) {
    e.preventDefault();
    setOcupado(true);
    setError('');
    setErrores({});
    const fd = new FormData();
    Object.entries(campos).forEach(([k, v]) => fd.append(k, v));
    if (foto) fd.append('foto', foto);
    if (quitarFoto) fd.append('quitarFoto', '1');
    try {
      const res = await fetch(nuevo ? '/api/jefe/productos' : `/api/jefe/productos/${producto.id}`, {
        method: nuevo ? 'POST' : 'PUT',
        body: fd,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (json.errores) setErrores(json.errores);
        throw new Error(json.error || 'No se ha podido guardar.');
      }
      setMensaje('Guardado ✓');
      onGuardado?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setOcupado(false);
    }
  }

  async function eliminar() {
    if (!confirm(`¿Seguro que quieres borrar "${producto.nombre}" de la tienda? No se puede deshacer.`)) return;
    setOcupado(true);
    const res = await fetch(`/api/jefe/productos/${producto.id}`, { method: 'DELETE' });
    setOcupado(false);
    if (res.ok) onGuardado?.();
    else setError('No se ha podido borrar.');
  }

  const vistaPrevia = {
    nombre: campos.nombre || 'Producto',
    categoria: campos.categoria,
    color: campos.color,
    estampado: estampadoDe(campos.nombre),
  };

  return (
    <form className={`editor${nuevo ? ' editor-nuevo' : ''}`} onSubmit={guardar}>
      <div className="editor-foto">
        <div className="editor-imagen" style={{ background: 'var(--blue-100)' }}>
          {vistaFoto ? <img src={vistaFoto} alt="" /> : <ProductoArte producto={vistaPrevia} />}
        </div>
        <div className="editor-foto-botones">
          <label className="btn btn-soft btn-sm">
            {vistaFoto ? 'Cambiar foto' : 'Subir foto'}
            <input ref={inputFoto} type="file" accept="image/*" onChange={elegirFoto} hidden />
          </label>
          {vistaFoto && (
            <button type="button" className="btn-link" onClick={borrarFoto}>Quitar foto</button>
          )}
        </div>
        {!vistaFoto && <p className="editor-nota">Sin foto se muestra el dibujo.</p>}
        {errores.foto && <div className="err">{errores.foto}</div>}
      </div>

      <div className="editor-campos">
        {nuevo && <span className="eyebrow">Producto nuevo</span>}
        <div className={`field${errores.nombre ? ' invalid' : ''}`}>
          <label>Nombre</label>
          <input type="text" value={campos.nombre} onChange={cambiar('nombre')} maxLength={80} required />
          {errores.nombre && <div className="err">{errores.nombre}</div>}
        </div>
        <div className="row">
          <div className={`field${errores.categoria ? ' invalid' : ''}`}>
            <label>Categoría</label>
            <input type="text" list="categorias" value={campos.categoria} onChange={cambiar('categoria')} maxLength={40} required />
            {errores.categoria && <div className="err">{errores.categoria}</div>}
          </div>
          <div className={`field${errores.precio ? ' invalid' : ''}`}>
            <label>Precio (€)</label>
            <input type="text" inputMode="decimal" value={campos.precio} onChange={cambiar('precio')} required />
            {errores.precio && <div className="err">{errores.precio}</div>}
          </div>
        </div>
        <div className="field">
          <label>Descripción</label>
          <textarea rows={3} value={campos.descripcion} onChange={cambiar('descripcion')} maxLength={600} />
        </div>
        <div className="field editor-color">
          <label>Color de la tela (para el dibujo)</label>
          <input type="color" value={campos.color} onChange={cambiar('color')} />
        </div>

        {error && <div className="banner" role="alert">{error}</div>}

        <div className="editor-botones">
          <button className="btn btn-primary btn-sm" disabled={ocupado}>
            {ocupado ? 'Guardando…' : nuevo ? 'Añadir a la tienda' : 'Guardar cambios'}
          </button>
          {mensaje && <span className="ok">{mensaje}</span>}
          {nuevo ? (
            <button type="button" className="btn-link" onClick={onCancelar}>Cancelar</button>
          ) : (
            <button type="button" className="btn-link peligro" onClick={eliminar} disabled={ocupado}>Borrar producto</button>
          )}
        </div>
      </div>
    </form>
  );
}
