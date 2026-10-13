import { DOCUMENT } from '@angular/common';
import {
  EnvironmentProviders,
  LOCALE_ID,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  Locale,
  SUPPORTED_LOCALES,
  localizedUrl,
  withTrailingSlash,
  toLocale,
} from '@koshi/shared/locale/util';
import { filter } from 'rxjs';

const SITE_ORIGIN = 'https://koshisoftware.pe';

/** Keeps canonical and hreflang links in the head in step with the current route. */
export function provideHeadLinks(): EnvironmentProviders {
  return provideAppInitializer(() => {
    const document = inject(DOCUMENT);
    const locale = toLocale(inject(LOCALE_ID));
    const router = inject(Router);
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(({ urlAfterRedirects }) =>
        replaceHeadLinks(
          document,
          locale,
          urlAfterRedirects,
          isNotFound(router),
        ),
      );
  });
}

function replaceHeadLinks(
  document: Document,
  locale: Locale,
  url: string,
  notFound: boolean,
) {
  document.head
    .querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang]')
    .forEach((link) => link.remove());

  if (notFound) return;
  const localized = (target: Locale) =>
    `${SITE_ORIGIN}/${target}${withTrailingSlash(localizedUrl(url, locale, target))}`;
  appendLink(document, { rel: 'canonical', href: localized(locale) });
  for (const target of SUPPORTED_LOCALES) {
    appendLink(document, {
      rel: 'alternate',
      hreflang: target,
      href: localized(target),
    });
  }
  // Only the root redirects by Accept-Language (functions/index.ts).
  if (url === '/') {
    appendLink(document, {
      rel: 'alternate',
      hreflang: 'x-default',
      href: `${SITE_ORIGIN}/`,
    });
  }
}

function appendLink(document: Document, attributes: Record<string, string>) {
  const link = document.createElement('link');
  for (const [name, value] of Object.entries(attributes)) {
    link.setAttribute(name, value);
  }
  document.head.appendChild(link);
}

function isNotFound(router: Router): boolean {
  let route = router.routerState.snapshot.root;
  while (route.firstChild) route = route.firstChild;
  return route.data['notFound'] === true;
}
