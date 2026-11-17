'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import EditorProducto from './EditorProducto';

export default function PanelJefe({ productos, error }) {
  const router = useRouter();
  const [creando, setCreando] = useState(false);
  const categorias = [...new Set(['Neceseres', 'Bolsas de carro', ...productos.map((p) => p.categoria)])];

  return (
    <div className="container bo-seccion">
      <div className="bo-cabecera">
        <div>
          <h1>Productos</h1>
          <p>Cambia fotos, precios y descripciones. Los cambios se ven en la tienda al momento.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setCreando(true)} disabled={creando}>
          + Añadir producto
        </button>
      </div>

      {error && <div className="aviso"><h3>Error</h3><p>{error}</p></div>}

      <datalist id="categorias">
        {categorias.map((c) => <option key={c} value={c} />)}
      </datalist>

      <div className="jefe-lista">
        {creando && (
          <EditorProducto
            nuevo
            producto={{ nombre: '', categoria: 'Neceseres', descripcion: '', precio: 25, color: '#9fd0ef' }}
            onCancelar={() => setCreando(false)}
            onGuardado={() => { setCreando(false); router.refresh(); }}
          />
        )}
        {productos.map((p) => (
          <EditorProducto key={`${p.id}-${p.version}`} producto={p} onGuardado={() => router.refresh()} />
        ))}
      </div>
    </div>
  );
}
