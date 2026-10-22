import {
  Contacto,
  HojaDeReclamacion,
  copiaDeHoja,
  errores,
  normalizada,
  numeroDeHoja,
} from '@koshi/shared/reclamacion/util';
import { Buzon, enviar } from './correo';
import { humano } from './turnstile';

const MAX_BYTES = 32_000;
// Generous, so a real consumer is never refused a copy, but a stranger's inbox cannot be flooded.
const COPIAS_POR_DIA = 3;

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

export const registrarHoja = async (
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> => {
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
  ctx.waitUntil(
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
