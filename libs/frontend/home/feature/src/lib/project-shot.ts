import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** A project's screenshot in the site's browser-window frame. */
@Component({
  selector: 'ks-project-shot',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <figure
      class="rounded-xl m-0 overflow-hidden bg-page shadow-[var(--ks-window-shadow)]"
    >
      <div
        class="flex items-center gap-1.5 border-b border-line px-3 py-2.5"
        aria-hidden="true"
      >
        <span class="size-2 rounded-full bg-line"></span>
        <span class="size-2 rounded-full bg-line"></span>
        <span class="size-2 rounded-full bg-line"></span>
        <span
          class="rounded-md ml-2 flex-1 truncate bg-surface px-2.5 py-1 font-mono text-xs text-muted"
          >{{ host() }}</span
        >
      </div>
      <img
        class="block h-auto w-full"
        [src]="image() + '-640.webp'"
        [srcset]="image() + '-640.webp 640w, ' + image() + '-1280.webp 1280w'"
        [sizes]="sizes()"
        width="1280"
        height="640"
        [alt]="alt()"
        [attr.loading]="lazy() ? 'lazy' : null"
        decoding="async"
      />
    </figure>
  `,
})
export class ProjectShot {
  readonly host = input.required<string>();
  /** Path without the width suffix; `-640.webp` and `-1280.webp` must exist. */
  readonly image = input.required<string>();
  readonly alt = input.required<string>();
  readonly sizes = input('(min-width: 1024px) 560px, 100vw');
  readonly lazy = input(true);
}
