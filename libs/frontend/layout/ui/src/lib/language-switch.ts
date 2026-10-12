import {
  ChangeDetectionStrategy,
  Component,
  LOCALE_ID,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { Locale, localizedUrl, toLocale } from '@koshi/shared/locale/util';

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
  // The header sits outside the router outlet and renders before the first navigation ends.
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(({ urlAfterRedirects }) => urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );
  private readonly locale = toLocale(inject(LOCALE_ID));
  protected readonly other: Locale = this.locale === 'es' ? 'en' : 'es';

  // A plain href, not routerLink: each locale is a separate build under its own base href.
  protected readonly href = computed(
    () => `/${this.other}${localizedUrl(this.url(), this.locale, this.other)}`,
  );
}
