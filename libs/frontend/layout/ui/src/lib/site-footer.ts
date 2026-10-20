import {
  ChangeDetectionStrategy,
  Component,
  LOCALE_ID,
  inject,
} from '@angular/core';
import { slug, toLocale } from '@koshi/shared/locale/util';
import { Wordmark } from './wordmark';

@Component({
  selector: 'ks-site-footer',
  imports: [Wordmark],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block bg-band py-12 text-[0.95rem]' },
  template: `
    <div class="mx-auto max-w-6xl px-4 md:px-10">
      <ks-wordmark />
      <p class="mt-4 flex flex-col text-muted md:flex-row md:gap-2">
        <span>KOSHISOFTWARE E.I.R.L.</span>
        <span class="hidden md:inline" aria-hidden="true">·</span>
        <span>RUC 20612884201</span>
        <span class="hidden md:inline" aria-hidden="true">·</span>
        <span>Punta Hermosa, Lima, Perú</span>
      </p>
      <!-- Reglamento del Libro de Reclamaciones art. 9: the Anexo III notice, linked, on the home page. -->
      <a
        href="libro-de-reclamaciones/"
        class="mt-8 inline-flex items-center gap-3 rounded-base border border-line px-4 py-3 text-ink no-underline hover:border-ink"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M12 7v14" />
          <path
            d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"
          />
        </svg>
        <span class="font-semibold">Libro de Reclamaciones</span>
      </a>
      <p class="mt-6">
        <a
          [href]="privacidad"
          class="text-muted hover:text-ink"
          i18n="@@footer.privacy"
          >Política de privacidad</a
        >
      </p>
    </div>
  `,
})
export class SiteFooter {
  protected readonly privacidad = `${slug('privacidad', toLocale(inject(LOCALE_ID)))}/`;
}
