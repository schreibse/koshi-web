import { SUPPORTED_LOCALES, type Locale } from '@koshi/shared/locale/util';
import { validar } from './validar';

/** One locale's version of a post, as the admin edits it. */
export interface Texto {
  slug: string;
  titulo: string;
  descripcion: string;
  cuerpo: string;
}

export type Textos = Partial<Record<Locale, Texto>>;

export interface Articulo {
  id: number;
  /** `YYYY-MM-DD`, or null while it is a draft. */
  publicado: string | null;
  actualizado: string;
  textos: Textos;
}

/** A post in the admin's list. */
export interface Ficha {
  id: number;
  publicado: string | null;
  actualizado: string;
  titulos: Partial<Record<Locale, string>>;
}

export interface Imagen {
  id: string;
  src: string;
  ancho: number;
  alto: number;
}

export interface Problema {
  locale?: Locale;
  campo?: keyof Texto;
  mensaje: string;
}

export const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Why these texts cannot be saved; a published post needs every locale. */
export function problemas(textos: Textos, publicado: boolean): Problema[] {
  return SUPPORTED_LOCALES.flatMap((locale): Problema[] => {
    const texto = textos[locale];
    if (!texto) {
      return publicado
        ? [{ locale, mensaje: 'A published post needs this language.' }]
        : [];
    }
    return [
      ...(SLUG.test(texto.slug)
        ? []
        : [
            {
              locale,
              campo: 'slug' as const,
              mensaje: 'Lowercase letters, digits and single hyphens only.',
            },
          ]),
      ...(['titulo', 'descripcion', 'cuerpo'] as const)
        .filter((campo) => !texto[campo].trim())
        .map((campo) => ({ locale, campo, mensaje: 'Required.' })),
      ...validar(texto.cuerpo).map((mensaje) => ({
        locale,
        campo: 'cuerpo' as const,
        mensaje,
      })),
    ];
  });
}
