import type { Locale } from '@koshi/shared/locale/util';
import type { Bloque } from './bloques';

/** A published post as the blog index lists it. */
export interface Resumen {
  slug: string;
  titulo: string;
  descripcion: string;
  /** ISO date, `YYYY-MM-DD`. */
  publicado: string;
}

export interface Post extends Resumen {
  bloques: Bloque[];
  /** The post's path in each locale, as `/blog/<slug>/`; slugs differ per locale. */
  rutas: Record<Locale, string>;
}

/** What the Worker hands the server-rendered app as request context for a blog URL. */
export type PaginaBlog =
  { tipo: 'indice'; posts: Resumen[] } | { tipo: 'post'; post: Post };

export interface ContextoBlog {
  blog: PaginaBlog;
}
