import {
  HojaDeReclamacion,
  errores,
  normalizada,
  numeroDeHoja,
} from '@koshi/shared/reclamacion/util';

const MAX_BYTES = 32_000;

// One statement, so D1's single writer hands out each number exactly once.
const INSERTAR = `
  INSERT INTO hojas (anio, secuencia, registrada, hoja)
  SELECT ?1, COALESCE(MAX(secuencia), 0) + 1, ?2, ?3 FROM hojas WHERE anio = ?1
  RETURNING secuencia`;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
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

  const ahora = new Date();
  const anio = Number(
    new Intl.DateTimeFormat('en', {
      timeZone: 'America/Lima',
      year: 'numeric',
    }).format(ahora),
  );
  const registrada = ahora.toISOString();
  const fila = await env.DB.prepare(INSERTAR)
    .bind(anio, registrada, JSON.stringify(normalizada(hoja)))
    .first<{ secuencia: number }>();
  if (!fila) return error(500);

  return Response.json(
    { numero: numeroDeHoja(fila.secuencia, anio), registrada },
    { status: 201, headers: { 'Cache-Control': 'no-store' } },
  );
};

const error = (status: number) => new Response(null, { status });
