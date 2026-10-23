import { RUTA_IMAGEN } from '@koshi/shared/blog/util';

/** An image uploaded through the admin; its id never changes, so neither does the file. */
export async function imagen(
  request: Request,
  env: Env,
): Promise<Response | null> {
  const id = RUTA_IMAGEN.exec(new URL(request.url).pathname)?.[1];
  if (!id) return null;
  const cuerpo = request.method === 'HEAD' ? null : await env.MEDIA.get(id);
  const objeto = cuerpo ?? (await env.MEDIA.head(id));
  if (!objeto) return new Response(null, { status: 404 });
  const headers = new Headers({
    'Cache-Control': 'public, max-age=31536000, immutable',
    'X-Content-Type-Options': 'nosniff',
    ETag: objeto.httpEtag,
  });
  objeto.writeHttpMetadata(headers);
  return new Response(cuerpo?.body ?? null, { headers });
}
