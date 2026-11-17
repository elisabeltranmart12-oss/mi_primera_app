import { cookies } from 'next/headers';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

// Acceso a la zona de jefe con una clave guardada en la variable de entorno ADMIN_PASSWORD.
// Al entrar se guarda una cookie firmada con esa clave: si cambias la clave, se cierran todas las sesiones.

export const COOKIE_JEFE = 'nenufar_jefe';
const DIAS_SESION = 7;

const clave = () => process.env.ADMIN_PASSWORD || '';
export const hayClave = () => clave().length > 0;

const sha = (texto) => createHash('sha256').update(String(texto)).digest();

function firma() {
  return createHmac('sha256', clave()).update('nenufar-jefe-v1').digest('hex');
}

export function claveCorrecta(intento) {
  if (!hayClave() || typeof intento !== 'string') return false;
  return timingSafeEqual(sha(intento), sha(clave()));
}

export async function esJefe() {
  if (!hayClave()) return false;
  const valor = (await cookies()).get(COOKIE_JEFE)?.value;
  if (!valor || valor.length !== 64) return false;
  return timingSafeEqual(Buffer.from(valor), Buffer.from(firma()));
}

export async function abrirSesion() {
  (await cookies()).set(COOKIE_JEFE, firma(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * DIAS_SESION,
  });
}

export async function cerrarSesion() {
  (await cookies()).delete(COOKIE_JEFE);
}

export const noAutorizado = () => Response.json({ error: 'Necesitas la clave de jefe.' }, { status: 401 });
