import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Wordmark } from './wordmark';

@Component({
  selector: 'ks-site-footer',
  imports: [Wordmark],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block border-t border-line py-12 text-[0.95rem]' },
  template: `
    <div class="mx-auto max-w-6xl px-4 md:px-10">
      <ks-wordmark />
      <p class="text-muted" i18n="@@footer.koshi">
        Koshi significa «fuerte» en shipibo.
      </p>
      <p class="mt-4 text-muted">
        Koshisoftware E.I.R.L. · RUC 00000000000 · Lima, Perú
      </p>
    </div>
  `,
})
export class SiteFooter {}
