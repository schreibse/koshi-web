import { DOCUMENT } from '@angular/common';
import {
  EnvironmentProviders,
  LOCALE_ID,
  REQUEST_CONTEXT,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { BEFORE_APP_SERIALIZED } from '@angular/platform-server';
import { NavigationEnd, Router } from '@angular/router';
import type { ContextoBlog } from '@koshi/shared/blog/util';
import {
  Locale,
  SUPPORTED_LOCALES,
  localizedUrl,
  withTrailingSlash,
  toLocale,
} from '@koshi/shared/locale/util';
import { filter } from 'rxjs';

const SITE_ORIGIN = 'https://koshisoftware.pe';

/** Canonical and hreflang links for the current route, and link-preview tags derived from them. */
export function provideHeadLinks(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideAppInitializer(() => {
      const document = inject(DOCUMENT);
      const locale = toLocale(inject(LOCALE_ID));
      const router = inject(Router);
      // A post's slug differs per locale and lives in D1, so the Worker sends its paths along.
      const blog = (
        inject(REQUEST_CONTEXT, { optional: true }) as ContextoBlog | null
      )?.blog;
      const postRutas = blog?.tipo === 'post' ? blog.post.rutas : undefined;
      router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(({ urlAfterRedirects }) =>
          replaceHeadLinks(
            document,
            locale,
            urlAfterRedirects,
            isNotFound(router),
            postRutas,
          ),
        );
    }),
    {
      provide: BEFORE_APP_SERIALIZED,
      multi: true,
      useFactory: () => {
        const document = inject(DOCUMENT);
        const locale = toLocale(inject(LOCALE_ID));
        return () => addPreviewTags(document, locale);
      },
    },
  ]);
}

function replaceHeadLinks(
  document: Document,
  locale: Locale,
  url: string,
  notFound: boolean,
  postRutas?: Record<Locale, string>,
) {
  document.head
    .querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang]')
    .forEach((link) => link.remove());

  if (notFound) return;
  const localized = (target: Locale) =>
    `${SITE_ORIGIN}/${target}${postRutas?.[target] ?? withTrailingSlash(localizedUrl(url, locale, target))}`;
  appendLink(document, { rel: 'canonical', href: localized(locale) });
  for (const target of SUPPORTED_LOCALES) {
    appendLink(document, {
      rel: 'alternate',
      hreflang: target,
      href: localized(target),
    });
  }
  // Only the root redirects by Accept-Language (worker/root-redirect.ts).
  if (url === '/') {
    appendLink(document, {
      rel: 'alternate',
      hreflang: 'x-default',
      href: `${SITE_ORIGIN}/`,
    });
  }
}

const OG_LOCALES: Record<Locale, string> = { es: 'es_PE', en: 'en_US' };

/** Open Graph and Twitter tags, so shared links show title, description and image. */
function addPreviewTags(document: Document, locale: Locale) {
  const head = document.head;
  const url = head.querySelector('link[rel="canonical"]')?.getAttribute('href');
  if (!url) return;
  const image = head.querySelector('meta[property="og:image"]');
  // Pages may set their own og:image, relative to the locale root.
  const imagePath = image?.getAttribute('content') ?? 'img/og-default.png';
  image?.remove();
  const description =
    head.querySelector('meta[name="description"]')?.getAttribute('content') ??
    '';
  const tags: [string, string][] = [
    ['og:type', 'website'],
    ['og:site_name', 'Koshisoftware'],
    ['og:title', document.title],
    ['og:description', description],
    ['og:url', url],
    ['og:image', new URL(imagePath, `${SITE_ORIGIN}/${locale}/`).href],
    ['og:image:width', '1200'],
    ['og:image:height', '630'],
    ['og:locale', OG_LOCALES[locale]],
    ...SUPPORTED_LOCALES.filter((other) => other !== locale).map(
      (other): [string, string] => ['og:locale:alternate', OG_LOCALES[other]],
    ),
  ];
  for (const [property, content] of tags) {
    appendElement(document, 'meta', { property, content });
  }
  appendElement(document, 'meta', {
    name: 'twitter:card',
    content: 'summary_large_image',
  });
}

function appendLink(document: Document, attributes: Record<string, string>) {
  appendElement(document, 'link', attributes);
}

function appendElement(
  document: Document,
  tag: string,
  attributes: Record<string, string>,
) {
  const element = document.createElement(tag);
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }
  document.head.appendChild(element);
}

function isNotFound(router: Router): boolean {
  let route = router.routerState.snapshot.root;
  while (route.firstChild) route = route.firstChild;
  return route.data['notFound'] === true;
}
