import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  LOCALE_ID,
  inject,
} from '@angular/core';
import {
  Locale,
  localizedUrl,
  toLocale,
  withTrailingSlash,
} from '@koshi/shared/locale/util';

@Component({
  selector: 'ks-language-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      class="font-semibold text-ink no-underline"
      [href]="href"
      [attr.hreflang]="other"
      [attr.lang]="other"
    >
      {{ other.toUpperCase() }}
    </a>
  `,
})
export class LanguageSwitch {
  private readonly url = inject(Location).path() || '/';
  private readonly locale = toLocale(inject(LOCALE_ID));
  protected readonly other: Locale = this.locale === 'es' ? 'en' : 'es';

  // A plain href, not routerLink: each locale is a separate build under its own base href.
  protected readonly href = `/${this.other}${withTrailingSlash(localizedUrl(this.url, this.locale, this.other))}`;
}
