import {
  ChangeDetectionStrategy,
  Component,
  LOCALE_ID,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ks-language-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      class="font-semibold text-ink no-underline"
      [href]="href()"
      [attr.hreflang]="other"
      [attr.lang]="other"
    >
      {{ other.toUpperCase() }}
    </a>
  `,
})
export class LanguageSwitch {
  private readonly router = inject(Router);
  protected readonly other = inject(LOCALE_ID).startsWith('es') ? 'en' : 'es';

  // A plain href, not routerLink: each locale is a separate build under its own base href.
  protected href(): string {
    return `/${this.other}${this.router.url}`;
  }
}
