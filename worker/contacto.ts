import {
  Mensaje,
  correoInterno,
  errores,
  normalizado,
} from '@koshi/shared/contacto/util';
import { Buzon, enviar } from './correo';
import { humano } from './turnstile';

const MAX_BYTES = 16_000;

const BUZON: Buzon = { email: 'hola@koshisoftware.pe', name: 'Koshisoftware' };

/** Mails a contact-form message to our inbox only; the sender gets no copy, so the form cannot mail strangers. */
export const enviarMensaje = async (
  request: Request,
  env: Env,
): Promise<Response> => {
  const texto = await request.text();
  if (texto.length > MAX_BYTES) return error(413);

  let mensaje: Mensaje;
  try {
    mensaje = JSON.parse(texto);
  } catch {
    return error(400);
  }
  if (typeof mensaje !== 'object' || mensaje === null) return error(400);
  const invalidos = errores(mensaje);
  if (invalidos.length)
    return Response.json({ errores: invalidos }, { status: 422 });
  // After validation: the token is single-use, so a 422 must not spend it.
  if (!(await humano(request, env.TURNSTILE_SECRET))) return error(403);

  const limpio = normalizado(mensaje);
  // Awaited, unlike the Libro's copies: nothing else records the message, so a failure must reach the sender.
  const id = await enviar(
    env,
    BUZON,
    { email: limpio.email, name: limpio.nombre },
    correoInterno(limpio),
  );
  if (id === null) return error(502);
  return new Response(null, {
    status: 204,
    headers: { 'Cache-Control': 'no-store' },
  });
};

const error = (status: number) => new Response(null, { status });
