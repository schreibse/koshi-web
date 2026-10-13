import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  CasoKoshisoftware,
  Empresas,
  Home,
} from '@koshi/frontend/home/feature';
import { NotFound, SiteFooter, SiteHeader } from '@koshi/frontend/layout/ui';
import { slug, toLocale } from '@koshi/shared/locale/util';

const locale = toLocale($localize.locale ?? 'es');

const PAGES: Record<string, 'home' | 'empresas' | 'caso'> = {
  '': 'home',
  [slug('empresas', locale)]: 'empresas',
  [`${slug('proyectos', locale)}/koshisoftware`]: 'caso',
};

// Every link is a full page load, so the page is picked once from the URL; the router only runs on the server.
@Component({
  imports: [
    Home,
    Empresas,
    CasoKoshisoftware,
    NotFound,
    SiteHeader,
    SiteFooter,
  ],
  selector: 'ks-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ks-site-header />
    <main>
      @switch (page) {
        @case ('home') {
          <ks-home />
        }
        @case ('empresas') {
          <ks-empresas />
        }
        @case ('caso') {
          <ks-caso-koshisoftware />
        }
        @default {
          <ks-not-found />
        }
      }
    </main>
    <ks-site-footer />
  `,
})
export class App {
  protected readonly page =
    PAGES[
      inject(Location)
        .path()
        .replace(/[?#].*$/, '')
        .replace(/^\/|\/$/g, '')
    ];
}
