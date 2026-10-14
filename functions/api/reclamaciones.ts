import {
  Contacto,
  HojaDeReclamacion,
  copiaDeHoja,
  errores,
  normalizada,
  numeroDeHoja,
} from '@koshi/shared/reclamacion/util';

const MAX_BYTES = 32_000;
const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const SWEEGO = 'https://api.sweego.io/send';
// Generous, so a real consumer is never refused a copy, but a stranger's inbox cannot be flooded.
const COPIAS_POR_DIA = 3;

interface Buzon {
  email: string;
  name: string;
}

const REMITENTE: Buzon = {
  email: 'libro@mail.koshisoftware.pe',
  name: 'Koshisoftware',
};
const BUZON: Buzon = {
  email: 'reclamaciones@koshisoftware.pe',
  name: 'Koshisoftware',
};

// One statement, so D1's single writer hands out each number exactly once.
const INSERTAR = `
  INSERT INTO hojas (anio, secuencia, registrada, hoja)
  SELECT ?1, COALESCE(MAX(secuencia), 0) + 1, ?2, ?3 FROM hojas WHERE anio = ?1
  RETURNING secuencia`;

const RECIENTES = `
  SELECT COUNT(*) AS n FROM hojas
  WHERE registrada > ?1 AND lower(json_extract(hoja, '$.consumidor.email')) = ?2`;

const COPIA_ENVIADA = `
  UPDATE hojas SET copia_enviada = ?1, copia_id = ?2
  WHERE anio = ?3 AND secuencia = ?4`;

export const onRequestPost: PagesFunction<Env> = async ({
  request,
  env,
  waitUntil,
}) => {
  const texto = await request.text();
  if (texto.length > MAX_BYTES) return error(413);

  let hoja: HojaDeReclamacion;
  try {
    hoja = JSON.parse(texto);
  } catch {
    return error(400);
  }
  if (typeof hoja !== 'object' || hoja === null) return error(400);
  const invalidos = errores(hoja);
  if (invalidos.length)
    return Response.json({ errores: invalidos }, { status: 422 });
  // After validation: the token is single-use, so a 422 must not spend it.
  if (!(await humano(request, env.TURNSTILE_SECRET))) return error(403);

  const ahora = new Date();
  const anio = Number(
    new Intl.DateTimeFormat('en', {
      timeZone: 'America/Lima',
      year: 'numeric',
    }).format(ahora),
  );
  const registrada = ahora.toISOString();
  const guardada = normalizada(hoja);
  const fila = await env.DB.prepare(INSERTAR)
    .bind(anio, registrada, JSON.stringify(guardada))
    .first<{ secuencia: number }>();
  if (!fila) return error(500);

  const numero = numeroDeHoja(fila.secuencia, anio);
  // The sheet is filed by now; a failed copy is logged and shows as copia_enviada IS NULL.
  waitUntil(
    enviarCopias(env, guardada, anio, fila.secuencia, numero, registrada, {
      idioma: request.headers.get('Content-Language') === 'en' ? 'en' : 'es',
    }).catch((e) => console.error('copias', numero, e)),
  );

  return Response.json(
    { numero, registrada },
    { status: 201, headers: { 'Cache-Control': 'no-store' } },
  );
};

const error = (status: number) => new Response(null, { status });

async function humano(request: Request, secret: string): Promise<boolean> {
  const token = request.headers.get('X-Turnstile-Token');
  if (!token) return false;
  const datos = new FormData();
  datos.append('secret', secret);
  datos.append('response', token);
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) datos.append('remoteip', ip);
  const respuesta = await fetch(SITEVERIFY, { method: 'POST', body: datos });
  if (!respuesta.ok) return false;
  const { success } = await respuesta.json<{ success: boolean }>();
  return success;
}

async function enviarCopias(
  env: Env,
  hoja: HojaDeReclamacion,
  anio: number,
  secuencia: number,
  numero: string,
  registrada: string,
  { idioma }: { idioma: 'es' | 'en' },
): Promise<void> {
  const consumidor = buzon(hoja.consumidor);
  const desde = new Date(Date.parse(registrada) - 86_400_000).toISOString();
  const recientes =
    (await env.DB.prepare(RECIENTES)
      .bind(desde, consumidor.email.toLowerCase())
      .first<number>('n')) ?? 0;
  const alConsumidor = recientes <= COPIAS_POR_DIA;

  if (alConsumidor) {
    const copia = copiaDeHoja(hoja, numero, registrada, idioma);
    const id = await enviar(env, consumidor, BUZON, copia);
    if (id !== null) {
      await env.DB.prepare(COPIA_ENVIADA)
        .bind(new Date().toISOString(), id, anio, secuencia)
        .run();
    }
  }

  const interna = copiaDeHoja(hoja, numero, registrada, 'es');
  const aviso = alConsumidor
    ? ''
    : `Copia al consumidor NO enviada: ${recientes} hojas de ${consumidor.email} en 24 h.\n\n`;
  await enviar(env, BUZON, consumidor, {
    asunto: `[Libro] ${interna.asunto}`,
    texto: aviso + interna.texto,
  });
}

const buzon = (c: Contacto): Buzon => ({ email: c.email, name: c.nombre });

/** Sends through Sweego; returns its transaction id, or null when nothing was sent. */
async function enviar(
  env: Env,
  para: Buzon,
  responderA: Buzon,
  { asunto, texto }: { asunto: string; texto: string },
): Promise<string | null> {
  if (!env.SWEEGO_API_KEY) {
    console.log('sin SWEEGO_API_KEY, no enviado:', para.email, asunto);
    return null;
  }
  const respuesta = await fetch(SWEEGO, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': env.SWEEGO_API_KEY,
    },
    body: JSON.stringify({
      channel: 'email',
      provider: 'sweego',
      from: REMITENTE,
      'reply-to': responderA,
      recipients: [para],
      subject: asunto,
      'message-txt': texto,
    }),
  });
  if (!respuesta.ok) {
    console.error('sweego', respuesta.status, await respuesta.text());
    return null;
  }
  const { transaction_id } = await respuesta.json<{
    transaction_id?: string;
  }>();
  return transaction_id ?? '';
}
