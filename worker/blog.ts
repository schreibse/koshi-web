import {
  aBloques,
  type PaginaBlog,
  type Resumen,
} from '@koshi/shared/blog/util';
import type { Locale } from '@koshi/shared/locale/util';
import { renderizar } from 'angular-server';

const RUTA = /^\/(es|en)\/blog(?:\/([a-z0-9-]+))?(\/?)$/;

const PUBLICO = `a.publicado IS NOT NULL AND a.publicado <= date('now')`;

// apps/web/_headers covers files only; rendered pages get the same headers as the static ones.
const CABECERAS = {
  'Cache-Control': 'public, max-age=0, must-revalidate',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Content-Type-Options': 'nosniff',
};

/** The blog index or a post, rendered by the Angular server from what D1 holds. */
export async function paginaBlog(
  request: Request,
  env: Env,
): Promise<Response | null> {
  const url = new URL(request.url);
  const [, locale, slug, barra] = url.pathname.match(RUTA) ?? [];
  if (!locale) return null;
  // Same as the static pages: a page's own URL ends in a slash.
  if (!barra) {
    url.pathname += '/';
    return Response.redirect(url.href, 307);
  }
  const blog = slug
    ? await post(env.BLOG, locale as Locale, slug)
    : await indice(env.BLOG, locale as Locale);
  if (!blog) return null;
  const pagina = await renderizar(request, { blog });
  if (!pagina) return null;
  const headers = new Headers(pagina.headers);
  for (const [nombre, valor] of Object.entries(CABECERAS)) {
    headers.set(nombre, valor);
  }
  return new Response(pagina.body, { status: pagina.status, headers });
}

async function indice(db: D1Database, locale: Locale): Promise<PaginaBlog> {
  const { results } = await db
    .prepare(
      `SELECT t.slug, t.titulo, t.descripcion, a.publicado
       FROM articulos a JOIN textos t ON t.articulo = a.id AND t.locale = ?1
       WHERE ${PUBLICO}
         AND EXISTS (SELECT 1 FROM textos o WHERE o.articulo = a.id AND o.locale != ?1)
       ORDER BY a.publicado DESC, a.id DESC`,
    )
    .bind(locale)
    .all<Resumen>();
  return { tipo: 'indice', posts: results };
}

async function post(
  db: D1Database,
  locale: Locale,
  slug: string,
): Promise<PaginaBlog | null> {
  const fila = await db
    .prepare(
      `SELECT t.slug, t.titulo, t.descripcion, t.cuerpo, a.publicado,
              o.locale AS otroLocale, o.slug AS otroSlug
       FROM textos t
         JOIN articulos a ON a.id = t.articulo
         JOIN textos o ON o.articulo = a.id AND o.locale != t.locale
       WHERE t.locale = ?1 AND t.slug = ?2 AND ${PUBLICO}`,
    )
    .bind(locale, slug)
    .first<
      Resumen & { cuerpo: string; otroLocale: Locale; otroSlug: string }
    >();
  if (!fila) return null;
  const { cuerpo, otroLocale, otroSlug, ...resumen } = fila;
  return {
    tipo: 'post',
    post: {
      ...resumen,
      bloques: aBloques(cuerpo),
      rutas: {
        [locale]: `/blog/${slug}/`,
        [otroLocale]: `/blog/${otroSlug}/`,
      } as Record<Locale, string>,
    },
  };
}
