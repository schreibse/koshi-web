import {
  ChangeDetectionStrategy,
  Component,
  LOCALE_ID,
  inject,
} from '@angular/core';
import { slug, toLocale } from '@koshi/shared/locale/util';
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
        <span
          class="hidden gap-7 rounded-full border border-line bg-surface px-[1.4rem] py-[0.55rem] lg:flex"
        >
          <a
            href="#servicios"
            class="font-mono text-[0.8rem] tracking-[0.06em] whitespace-nowrap text-muted uppercase no-underline hover:text-ink"
            i18n="@@nav.services"
            >Servicios</a
          >
          <a
            href="#proyectos"
            class="font-mono text-[0.8rem] tracking-[0.06em] whitespace-nowrap text-muted uppercase no-underline hover:text-ink"
            i18n="@@nav.work"
            >Proyectos</a
          >
          <a
            [href]="sobreMi"
            class="font-mono text-[0.8rem] tracking-[0.06em] whitespace-nowrap text-muted uppercase no-underline hover:text-ink"
            i18n="@@nav.about"
            >Sobre mí</a
          >
          <a
            [href]="empresas"
            class="font-mono text-[0.8rem] tracking-[0.06em] whitespace-nowrap text-muted uppercase no-underline hover:text-ink"
            i18n="@@nav.business"
            >Empresas</a
          >
          <a
            href="blog/"
            class="font-mono text-[0.8rem] tracking-[0.06em] whitespace-nowrap text-muted uppercase no-underline hover:text-ink"
            i18n="@@nav.blog"
            >Blog</a
          >
        </span>
        <a [href]="contacto" class="btn btn-primary" i18n="@@nav.contact"
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
export class SiteHeader {
  private readonly locale = toLocale(inject(LOCALE_ID));
  protected readonly empresas = `${slug('empresas', this.locale)}/`;
  protected readonly sobreMi = `${slug('sobre-mi', this.locale)}/`;
  protected readonly contacto = `${slug('contacto', this.locale)}/?tema=proyecto`;
}
