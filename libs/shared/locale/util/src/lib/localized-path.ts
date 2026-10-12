import { Locale } from './preferred-locale';

/** Pages whose path differs per locale; a page missing here has the same path in every locale. */
const SLUGS = {
  empresas: { es: 'empresas', en: 'business' },
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
