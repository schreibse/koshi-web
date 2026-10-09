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
      <p class="mt-4 flex flex-col text-muted md:flex-row md:gap-2">
        <span>KOSHISOFTWARE E.I.R.L.</span>
        <span class="hidden md:inline" aria-hidden="true">·</span>
        <span>RUC 20612884201</span>
        <span class="hidden md:inline" aria-hidden="true">·</span>
        <span>Punta Hermosa, Lima, Perú</span>
      </p>
    </div>
  `,
})
export class SiteFooter {}
