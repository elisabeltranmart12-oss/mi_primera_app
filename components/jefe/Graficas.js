// Gráficas sencillas (una sola serie, un solo color) para el resumen del back office.
// Cada barra tiene su valor escrito y un tooltip al pasar el ratón.

export function BarrasH({ filas, formato = (n) => n, vacio = 'Todavía no hay datos.' }) {
  if (!filas.length) return <p className="bo-vacio">{vacio}</p>;
  const max = Math.max(...filas.map((f) => f.valor), 1);
  return (
    <ul className="barras-h">
      {filas.map((f) => (
        <li key={f.etiqueta} title={`${f.etiqueta}: ${formato(f.valor)}${f.extra ? ` · ${f.extra}` : ''}`}>
          <span className="barras-h-etiqueta">{f.etiqueta}</span>
          <span className="barras-h-pista">
            <span className="barras-h-barra" style={{ width: `${(f.valor / max) * 100}%` }} />
          </span>
          <span className="barras-h-valor">{formato(f.valor)}</span>
        </li>
      ))}
    </ul>
  );
}

export function Columnas({ filas }) {
  const max = Math.max(...filas.map((f) => f.valor), 1);
  const total = filas.reduce((s, f) => s + f.valor, 0);
  return (
    <figure className="columnas" aria-label={`Contactos por día: ${total} en total`}>
      <div className="columnas-plot">
        {filas.map((f) => (
          <div key={f.clave} className="columna" title={`${f.etiqueta}: ${f.valor} contacto${f.valor === 1 ? '' : 's'}`}>
            {f.valor > 0 && <span className="columna-valor">{f.valor}</span>}
            <span className="columna-barra" style={{ height: `${(f.valor / max) * 100}%` }} />
          </div>
        ))}
      </div>
      <div className="columnas-eje">
        {filas.map((f, i) => (
          <span key={f.clave}>{(filas.length - 1 - i) % 2 === 0 ? f.etiqueta : ''}</span>
        ))}
      </div>
    </figure>
  );
}
