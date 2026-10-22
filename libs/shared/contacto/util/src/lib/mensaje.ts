export const TEMAS = ['proyecto', 'cv', 'correccion', 'datos', 'otro'] as const;
export type Tema = (typeof TEMAS)[number];

// The mail is for us, so it is always in Spanish.
const ASUNTOS: Record<Tema, string> = {
  proyecto: 'Proyecto web',
  cv: 'CV',
  correccion: 'Corrección',
  datos: 'Datos personales',
  otro: 'Otro',
};

/** What the contact form sends. */
export interface Mensaje {
  nombre: string;
  email: string;
  tema: Tema;
  mensaje: string;
}

export const MAX_MENSAJE = 4000;
const MAX_LINEA = 200;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function errores(m: Mensaje): string[] {
  const out: string[] = [];
  for (const key of ['nombre', 'email'] as const) {
    const value = m[key];
    if (typeof value !== 'string' || !value.trim() || value.length > MAX_LINEA)
      out.push(key);
  }
  if (!out.includes('email') && !EMAIL.test(m.email.trim())) out.push('email');
  if (!TEMAS.includes(m.tema)) out.push('tema');
  if (
    typeof m.mensaje !== 'string' ||
    !m.mensaje.trim() ||
    m.mensaje.length > MAX_MENSAJE
  ) {
    out.push('mensaje');
  }
  return out;
}

/** Copies only the known fields, so a crafted request cannot send anything else. */
export function normalizado(m: Mensaje): Mensaje {
  return {
    nombre: m.nombre.trim(),
    email: m.email.trim(),
    tema: m.tema,
    mensaje: m.mensaje.trim(),
  };
}

export function correoInterno(m: Mensaje): { asunto: string; texto: string } {
  return {
    asunto: `[Contacto] ${ASUNTOS[m.tema]} · ${m.nombre}`,
    texto: `${m.mensaje}\n\n— ${m.nombre} <${m.email}>`,
  };
}
