import { abrirSesion, cerrarSesion, claveCorrecta, hayClave } from '@/lib/jefe';

// Entrar con la clave de jefe.
export async function POST(request) {
  if (!hayClave()) {
    return Response.json(
      { error: 'Todavía no hay clave de jefe configurada (variable ADMIN_PASSWORD).' },
      { status: 503 }
    );
  }
  const { clave } = await request.json().catch(() => ({}));
  if (!claveCorrecta(clave)) {
    // Pequeña espera para que no se puedan probar claves a toda velocidad.
    await new Promise((r) => setTimeout(r, 800));
    return Response.json({ error: 'Clave incorrecta.' }, { status: 401 });
  }
  await abrirSesion();
  return Response.json({ ok: true });
}

// Salir.
export async function DELETE() {
  await cerrarSesion();
  return Response.json({ ok: true });
}
