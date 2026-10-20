import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  inject,
} from '@angular/core';
import {
  CasoKoshisoftware,
  CasoLibro,
  Empresas,
  Home,
  PoliticaDePrivacidad,
} from '@koshi/frontend/home/feature';
import { NotFound, SiteFooter, SiteHeader } from '@koshi/frontend/layout/ui';
import {
  LibroDeReclamaciones,
  Privacidad,
} from '@koshi/frontend/reclamaciones/feature';
import { activarLibro } from '@koshi/frontend/reclamaciones/feature/activar';
import { slug, toLocale } from '@koshi/shared/locale/util';

const locale = toLocale($localize.locale ?? 'es');

const PAGES: Record<
  string,
  | 'home'
  | 'empresas'
  | 'caso'
  | 'casoLibro'
  | 'politica'
  | 'libro'
  | 'privacidad'
> = {
  '': 'home',
  [slug('empresas', locale)]: 'empresas',
  [`${slug('proyectos', locale)}/koshisoftware`]: 'caso',
  [`${slug('proyectos', locale)}/libro-de-reclamaciones`]: 'casoLibro',
  [slug('privacidad', locale)]: 'politica',
  'libro-de-reclamaciones': 'libro',
  'libro-de-reclamaciones/privacidad': 'privacidad',
};

// Every link is a full page load, so the page is picked once from the URL; the router only runs on the server.
@Component({
  imports: [
    Home,
    Empresas,
    CasoKoshisoftware,
    CasoLibro,
    PoliticaDePrivacidad,
    LibroDeReclamaciones,
    Privacidad,
    NotFound,
    SiteHeader,
    SiteFooter,
  ],
  selector: 'ks-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ks-site-header class="print:hidden" />
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
        @case ('casoLibro') {
          @defer (hydrate never) {
            <ks-caso-libro />
          }
        }
        @case ('politica') {
          @defer (hydrate never) {
            <ks-politica-de-privacidad />
          }
        }
        @case ('libro') {
          @defer (hydrate never) {
            <ks-libro-de-reclamaciones />
          }
        }
        @case ('privacidad') {
          @defer (hydrate never) {
            <ks-privacidad />
          }
        }
        @default {
          <ks-not-found />
        }
      }
    </main>
    <ks-site-footer class="print:hidden" />
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

  constructor() {
    afterNextRender(() => {
      if (this.page === 'libro') activarLibro();
    });
  }
}
