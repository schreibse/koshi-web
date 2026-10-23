import {
  problemas,
  SLUG,
  type Articulo,
  type Ficha,
  type Imagen,
  type Problema,
  type Texto,
  type Textos,
} from '@koshi/shared/blog/util';
import { SUPPORTED_LOCALES, type Locale } from '@koshi/shared/locale/util';

const MAX_IMAGEN = 5 * 1024 * 1024;
const MAX_LADO = 10_000;

// Peru has no daylight saving time; a post published in the evening keeps Lima's date.
const HOY_LIMA = `date('now', '-5 hours')`;
const AHORA = `strftime('%Y-%m-%dT%H:%M:%SZ', 'now')`;

const FIRMAS: [string, (b: Uint8Array) => boolean][] = [
  ['image/png', (b) => cabecera(b, 0, [0x89, 0x50, 0x4e, 0x47])],
  ['image/jpeg', (b) => cabecera(b, 0, [0xff, 0xd8, 0xff])],
  ['image/webp', (b) => ascii(b, 0, 'RIFF') && ascii(b, 8, 'WEBP')],
  ['image/avif', (b) => ascii(b, 4, 'ftypavif')],
];

/** The admin's JSON API under /api/admin/; the caller has already passed the Access check. */
export async function admin(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const { method } = request;
  // Access adds its token from the cookie on cross-site requests too, so writes prove their origin.
  if (method !== 'GET' && request.headers.get('Origin') !== url.origin) {
    return json({ mensaje: 'Cross-origin request.' }, 403);
  }
  const ruta = url.pathname.slice('/api/admin/'.length);
  const [, id, accion] = ruta.match(/^articulos\/(\d+)(?:\/(\w+))?$/) ?? [];
  const db = env.BLOG;

  if (ruta === 'articulos' && method === 'GET') return json(await fichas(db));
  if (ruta === 'articulos' && method === 'POST') return crear(db);
  if (ruta === 'imagenes' && method === 'POST') return subir(request, url, env);
  if (id && !accion && method === 'GET') return leer(db, Number(id));
  if (id && !accion && method === 'PUT')
    return guardar(request, db, Number(id));
  if (id && accion === 'publicar' && method === 'POST') {
    return publicar(db, Number(id));
  }
  if (id && accion === 'despublicar' && method === 'POST') {
    await db
      .prepare('UPDATE articulos SET publicado = NULL WHERE id = ?1')
      .bind(Number(id))
      .run();
    return leer(db, Number(id));
  }
  return json({ mensaje: 'Not found.' }, 404);
}

async function fichas(db: D1Database): Promise<Ficha[]> {
  const { results } = await db
    .prepare(
      `SELECT a.id, a.publicado, a.actualizado,
              json_group_object(t.locale, t.titulo) FILTER (WHERE t.locale IS NOT NULL) AS titulos
       FROM articulos a LEFT JOIN textos t ON t.articulo = a.id
       GROUP BY a.id ORDER BY a.actualizado DESC, a.id DESC`,
    )
    .all<Omit<Ficha, 'titulos'> & { titulos: string | null }>();
  return results.map((fila) => ({
    ...fila,
    titulos: JSON.parse(fila.titulos ?? '{}'),
  }));
}

async function crear(db: D1Database): Promise<Response> {
  const fila = await db
    .prepare(
      `INSERT INTO articulos (publicado, actualizado) VALUES (NULL, ${AHORA}) RETURNING id`,
    )
    .first<{ id: number }>();
  if (!fila) throw new Error('INSERT … RETURNING returned no row');
  return leer(db, fila.id, 201);
}

async function articulo(db: D1Database, id: number): Promise<Articulo | null> {
  const [cabeza, textos] = await db.batch([
    db
      .prepare('SELECT id, publicado, actualizado FROM articulos WHERE id = ?1')
      .bind(id),
    db
      .prepare(
        'SELECT locale, slug, titulo, descripcion, cuerpo FROM textos WHERE articulo = ?1',
      )
      .bind(id),
  ]);
  const [fila] = cabeza.results as Omit<Articulo, 'textos'>[];
  if (!fila) return null;
  return {
    ...fila,
    textos: Object.fromEntries(
      (textos.results as (Texto & { locale: Locale })[]).map(
        ({ locale, ...texto }) => [locale, texto],
      ),
    ),
  };
}

async function leer(db: D1Database, id: number, status = 200) {
  const encontrado = await articulo(db, id);
  return encontrado
    ? json(encontrado, status)
    : json({ mensaje: 'Not found.' }, 404);
}

async function guardar(
  request: Request,
  db: D1Database,
  id: number,
): Promise<Response> {
  const actual = await articulo(db, id);
  if (!actual) return json({ mensaje: 'Not found.' }, 404);
  const textos = await leerTextos(request);
  if (!textos) return json({ mensaje: 'Malformed body.' }, 400);
  const errores = [
    ...problemas(textos, actual.publicado !== null),
    ...(await slugsOcupados(db, id, textos)),
  ];
  if (errores.length > 0) return json({ problemas: errores }, 422);

  await db.batch([
    ...SUPPORTED_LOCALES.map((locale) => {
      const texto = textos[locale];
      return texto
        ? db
            .prepare(
              `INSERT INTO textos (articulo, locale, slug, titulo, descripcion, cuerpo)
               VALUES (?1, ?2, ?3, ?4, ?5, ?6)
               ON CONFLICT (articulo, locale) DO UPDATE SET
                 slug = excluded.slug, titulo = excluded.titulo,
                 descripcion = excluded.descripcion, cuerpo = excluded.cuerpo`,
            )
            .bind(
              id,
              locale,
              texto.slug,
              texto.titulo,
              texto.descripcion,
              texto.cuerpo,
            )
        : db
            .prepare('DELETE FROM textos WHERE articulo = ?1 AND locale = ?2')
            .bind(id, locale);
    }),
    db
      .prepare(`UPDATE articulos SET actualizado = ${AHORA} WHERE id = ?1`)
      .bind(id),
  ]);
  return leer(db, id);
}

/** The texts in a save request; a locale left out is removed from the post. */
async function leerTextos(request: Request): Promise<Textos | null> {
  const cuerpo = (await request.json().catch(() => null)) as {
    textos?: unknown;
  } | null;
  const textos = cuerpo?.textos;
  if (typeof textos !== 'object' || textos === null) return null;
  const resultado: Textos = {};
  const campos = ['slug', 'titulo', 'descripcion', 'cuerpo'] as const;
  for (const [locale, valor] of Object.entries(textos)) {
    if (!(SUPPORTED_LOCALES as readonly string[]).includes(locale)) return null;
    const texto = valor as Record<string, unknown> | null;
    if (campos.some((campo) => typeof texto?.[campo] !== 'string')) return null;
    resultado[locale as Locale] = Object.fromEntries(
      campos.map((campo) => [campo, texto?.[campo]]),
    ) as unknown as Texto;
  }
  return resultado;
}

async function slugsOcupados(
  db: D1Database,
  id: number,
  textos: Textos,
): Promise<Problema[]> {
  const pedidos = SUPPORTED_LOCALES.flatMap((locale) => {
    const slug = textos[locale]?.slug;
    return slug && SLUG.test(slug) ? [{ locale, slug }] : [];
  });
  const ocupados = await Promise.all(
    pedidos.map(({ locale, slug }) =>
      db
        .prepare(
          'SELECT 1 FROM textos WHERE locale = ?1 AND slug = ?2 AND articulo != ?3',
        )
        .bind(locale, slug, id)
        .first(),
    ),
  );
  return pedidos
    .filter((_, i) => ocupados[i])
    .map(({ locale }) => ({
      locale,
      campo: 'slug' as const,
      mensaje: 'Another post already uses this slug.',
    }));
}

async function publicar(db: D1Database, id: number): Promise<Response> {
  const actual = await articulo(db, id);
  if (!actual) return json({ mensaje: 'Not found.' }, 404);
  const errores = problemas(actual.textos, true);
  if (errores.length > 0) return json({ problemas: errores }, 422);
  await db
    .prepare(
      `UPDATE articulos SET publicado = ${HOY_LIMA} WHERE id = ?1 AND publicado IS NULL`,
    )
    .bind(id)
    .run();
  return leer(db, id);
}

async function subir(request: Request, url: URL, env: Env): Promise<Response> {
  const ancho = lado(url.searchParams.get('ancho'));
  const alto = lado(url.searchParams.get('alto'));
  if (!ancho || !alto) return json({ mensaje: 'Missing image size.' }, 400);
  const bytes = new Uint8Array(await request.arrayBuffer());
  if (bytes.length === 0 || bytes.length > MAX_IMAGEN) {
    return json({ mensaje: 'Images must be between 1 byte and 5 MB.' }, 413);
  }
  const tipo = FIRMAS.find(([, firma]) => firma(bytes))?.[0];
  if (!tipo) {
    return json({ mensaje: 'Only PNG, JPEG, WebP or AVIF images.' }, 415);
  }
  const id = crypto.randomUUID().replaceAll('-', '');
  await env.MEDIA.put(id, bytes, { httpMetadata: { contentType: tipo } });
  await env.BLOG.prepare(
    `INSERT INTO imagenes (id, tipo, ancho, alto, bytes, subida)
     VALUES (?1, ?2, ?3, ?4, ?5, ${AHORA})`,
  )
    .bind(id, tipo, ancho, alto, bytes.length)
    .run();
  const imagen: Imagen = { id, src: `/media/${id}`, ancho, alto };
  return json(imagen, 201);
}

function lado(valor: string | null): number | null {
  const numero = Number(valor);
  return Number.isInteger(numero) && numero > 0 && numero <= MAX_LADO
    ? numero
    : null;
}

function cabecera(bytes: Uint8Array, desde: number, firma: number[]): boolean {
  return firma.every((byte, i) => bytes[desde + i] === byte);
}

function ascii(bytes: Uint8Array, desde: number, firma: string): boolean {
  return cabecera(
    bytes,
    desde,
    [...firma].map((c) => c.charCodeAt(0)),
  );
}

function json(datos: unknown, status = 200): Response {
  return Response.json(datos, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}
