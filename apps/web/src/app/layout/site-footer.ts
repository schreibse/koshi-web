import { Component } from '@angular/core';
import { Wordmark } from './wordmark';

@Component({
  selector: 'ks-site-footer',
  imports: [Wordmark],
  template: `
    <div class="container">
      <ks-wordmark />
      <p class="muted" i18n="@@footer.koshi">
        Koshi significa «fuerte» en shipibo.
      </p>
      <p class="muted legal">
        Koshisoftware E.I.R.L. · RUC 00000000000 · Lima, Perú
      </p>
    </div>
  `,
  styles: `
    :host {
      display: block;
      padding-block: 3rem;
      border-top: 1px solid var(--line);
      font-size: 0.95rem;
    }
    .legal {
      margin-top: 1rem;
    }
  `,
})
export class SiteFooter {}
