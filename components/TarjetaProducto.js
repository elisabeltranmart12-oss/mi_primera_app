import Link from 'next/link';
import ImagenProducto from './ImagenProducto';
import { euros } from '@/lib/productos';

export default function TarjetaProducto({ producto, fondo }) {
  return (
    <article className="producto">
      <div className={`producto-arte${producto.tiene_foto ? ' con-foto' : ''}`} style={{ background: fondo }}>
        <ImagenProducto producto={producto} />
      </div>
      <div className="producto-info">
        <span className="producto-cat">{producto.categoria}</span>
        <h3>{producto.nombre}</h3>
        <p className="producto-desc">{producto.descripcion}</p>
        <div className="producto-pie">
          <span className="precio">{euros.format(producto.precio)}</span>
          <Link className="btn btn-primary btn-sm" href={`/apuntate?producto=${producto.slug}`}>
            Lo quiero
          </Link>
        </div>
      </div>
    </article>
  );
}
