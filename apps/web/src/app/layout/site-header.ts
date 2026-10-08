import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LanguageSwitch } from './language-switch';
import { ThemeToggle } from './theme-toggle';
import { Wordmark } from './wordmark';

@Component({
  selector: 'ks-site-header',
  imports: [Wordmark, LanguageSwitch, ThemeToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'sticky top-0 z-10 block border-b border-line bg-page' },
  template: `
    <div
      class="mx-auto flex min-h-18 max-w-6xl items-center gap-4 px-4 md:gap-8 md:px-10"
    >
      <a href="./" class="text-ink no-underline" aria-label="Koshisoftware"
        ><ks-wordmark
      /></a>
      <nav class="ml-auto hidden items-center gap-6 sm:flex">
        <a
          href="#servicios"
          class="hidden text-muted no-underline hover:text-ink md:inline"
          i18n="@@nav.services"
          >Servicios</a
        >
        <a
          href="#proyectos"
          class="hidden text-muted no-underline hover:text-ink md:inline"
          i18n="@@nav.work"
          >Proyectos</a
        >
        <a
          href="#nosotros"
          class="hidden text-muted no-underline hover:text-ink md:inline"
          i18n="@@nav.about"
          >Nosotros</a
        >
        <a href="#contacto" class="btn btn-primary" i18n="@@nav.contact"
          >Hablemos</a
        >
      </nav>
      <div class="ml-auto flex items-center gap-4 sm:ml-0">
        <ks-language-switch />
        <ks-theme-toggle />
      </div>
    </div>
  `,
})
export class SiteHeader {}
