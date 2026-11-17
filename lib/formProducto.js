// Lee y valida el formulario de producto que envía la zona de jefe.
const TIPOS_FOTO = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FOTO = 3 * 1024 * 1024; // 3 MB (el navegador ya la reduce antes de subirla)

const texto = (fd, campo, max) => String(fd.get(campo) ?? '').trim().slice(0, max);

export async function leerProducto(request) {
  const fd = await request.formData();
  const datos = {
    nombre: texto(fd, 'nombre', 80),
    categoria: texto(fd, 'categoria', 40),
    descripcion: texto(fd, 'descripcion', 600),
    precio: Number(texto(fd, 'precio', 12).replace(',', '.')),
    color: texto(fd, 'color', 7),
    quitarFoto: fd.get('quitarFoto') === '1',
    foto: null,
    fotoTipo: null,
  };

  const errores = {};
  if (!datos.nombre) errores.nombre = 'Pon un nombre.';
  if (!datos.categoria) errores.categoria = 'Pon una categoría.';
  if (!Number.isFinite(datos.precio) || datos.precio < 0 || datos.precio > 100000) errores.precio = 'Precio no válido.';
  datos.precio = Math.round(datos.precio * 100) / 100;
  if (!/^#[0-9a-fA-F]{6}$/.test(datos.color)) datos.color = '#9fd0ef';

  const foto = fd.get('foto');
  if (foto && typeof foto === 'object' && foto.size > 0) {
    if (!TIPOS_FOTO.includes(foto.type)) errores.foto = 'La foto tiene que ser JPG, PNG o WEBP.';
    else if (foto.size > MAX_FOTO) errores.foto = 'La foto es demasiado grande (máximo 3 MB).';
    else {
      datos.foto = Buffer.from(await foto.arrayBuffer()).toString('base64');
      datos.fotoTipo = foto.type;
    }
  }

  return { datos, errores };
}

export const respuestaErrores = (errores) =>
  Response.json({ error: 'Revisa los campos marcados.', errores }, { status: 422 });

export function errorBD(err) {
  if (err?.code === '23505') {
    return Response.json({ error: 'Ya hay un producto con ese nombre.', errores: { nombre: 'Ese nombre ya existe.' } }, { status: 409 });
  }
  console.error('Error en productos:', err);
  return Response.json({ error: 'No se ha podido guardar. Inténtalo de nuevo.' }, { status: 500 });
}
