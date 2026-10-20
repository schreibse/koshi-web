import { Locale } from './preferred-locale';

/** Pages whose path differs per locale; a page missing here has the same path in every locale. */
const SLUGS = {
  empresas: { es: 'empresas', en: 'business' },
  proyectos: { es: 'proyectos', en: 'projects' },
  privacidad: { es: 'privacidad', en: 'privacy' },
} satisfies Record<string, Record<Locale, string>>;

export type LocalizedPage = keyof typeof SLUGS;

/** A LOCALE_ID such as `es` or `en-US`, reduced to the site's locale. */
export function toLocale(localeId: string): Locale {
  return localeId.startsWith('es') ? 'es' : 'en';
}

export function slug(page: LocalizedPage, locale: Locale): string {
  return SLUGS[page][locale];
}

/** The same page's URL in another locale; only the first path segment is ever localized. */
export function localizedUrl(url: string, from: Locale, to: Locale): string {
  const [, first, rest] = url.match(/^\/([^/?#]*)(.*)$/) ?? [];
  const page = Object.values(SLUGS).find((slugs) => slugs[from] === first);
  return page ? `/${page[to]}${rest}` : url;
}

/** Cloudflare serves every page as a directory, so a page's own URL ends in a slash. */
export function withTrailingSlash(url: string): string {
  return url.replace(/^([^?#]*[^/?#])(?=[?#]|$)/, '$1/');
}

/** A slug of another locale, mapped to this locale's slug for the same page. */
export function crossLocaleRedirects(
  locale: Locale,
): { from: string; to: string }[] {
  return Object.values(SLUGS).flatMap((slugs) =>
    Object.entries(slugs)
      .filter(([other, from]) => other !== locale && from !== slugs[locale])
      .map(([, from]) => ({ from, to: slugs[locale] })),
  );
}
