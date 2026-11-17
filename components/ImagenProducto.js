import ProductoArte from './ProductoArte';

// Si el producto tiene foto subida desde la zona de jefe, se muestra la foto;
// si no, la ilustración.
export default function ImagenProducto({ producto, className = '' }) {
  if (producto.tiene_foto) {
    return (
      <img
        className={`foto-producto ${className}`}
        src={`/api/fotos/${producto.id}?v=${producto.version}`}
        alt={producto.nombre}
        loading="lazy"
      />
    );
  }
  return <ProductoArte producto={producto} className={className} />;
}
