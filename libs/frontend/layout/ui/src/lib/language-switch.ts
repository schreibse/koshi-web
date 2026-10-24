import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  LOCALE_ID,
  REQUEST_CONTEXT,
  TransferState,
  inject,
  makeStateKey,
} from '@angular/core';
import type { ContextoBlog } from '@koshi/shared/blog/util';
import {
  Locale,
  localizedUrl,
  toLocale,
  withTrailingSlash,
} from '@koshi/shared/locale/util';

// A post's slug differs per locale and only the server knows the other one, so it hands it to the browser.
export const POST_PATHS = makeStateKey<Record<Locale, string>>('postPaths');

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
  private readonly postPaths = postPaths();

  // A plain href, not routerLink: each locale is a separate build under its own base href.
  protected readonly href = `/${this.other}${this.postPaths?.[this.other] ?? withTrailingSlash(localizedUrl(this.url, this.locale, this.other))}`;
}

function postPaths(): Record<Locale, string> | null {
  const state = inject(TransferState);
  const blog = (
    inject(REQUEST_CONTEXT, { optional: true }) as ContextoBlog | null
  )?.blog;
  const paths =
    (blog?.tipo === 'post' ? blog.post.rutas : null) ??
    state.get(POST_PATHS, null);
  if (paths) state.set(POST_PATHS, paths);
  return paths;
}
