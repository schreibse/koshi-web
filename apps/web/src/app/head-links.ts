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
  toLocale,
} from '@koshi/shared/locale/util';
import { filter } from 'rxjs';

const SITE_ORIGIN = 'https://koshisoftware.pe';

/** Keeps canonical and hreflang links in the head in step with the current route. */
export function provideHeadLinks(): EnvironmentProviders {
  return provideAppInitializer(() => {
    const document = inject(DOCUMENT);
    const locale = toLocale(inject(LOCALE_ID));
    inject(Router)
      .events.pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(({ urlAfterRedirects }) =>
        replaceHeadLinks(document, locale, urlAfterRedirects),
      );
  });
}

function replaceHeadLinks(document: Document, locale: Locale, url: string) {
  // Hydration re-runs this on top of the prerendered links.
  document.head
    .querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang]')
    .forEach((link) => link.remove());

  const localized = (target: Locale) =>
    `${SITE_ORIGIN}/${target}${localizedUrl(url, locale, target)}`;
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
