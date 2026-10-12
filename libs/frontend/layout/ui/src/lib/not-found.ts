import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  inject,
  LOCALE_ID,
  signal,
} from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { slug, toLocale } from '@koshi/shared/locale/util';

// Fluent Emoji High Contrast "llama" (Microsoft, MIT licence), via Iconify.
const LLAMA = [
  'M6.86 8.203a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1',
  'm29.844 21.558l.087.084a3.47 3.47 0 0 1 1.06 2.547v5.491a2.31 2.31 0 0 1-2.31 2.31h-1.37a2.31 2.31 0 0 1-2.31-2.31v-2.151l-.644-.395l-1.775 3.222l-.021.028c-.267.355-.68.585-1.15.585h-1.03c-.624 0-.96-.645-.744-1.155l1.676-4.547l.014-.027l.001-.002a5.5 5.5 0 0 1-.784-.732A6.4 6.4 0 0 1 18.07 25h-.551l1.277 4.952l.002.008a.94.94 0 0 1-.052.581a.71.71 0 0 1-.656.428h-.004l-1.398-.01c-.127 0-.3-.02-.466-.105a.76.76 0 0 1-.397-.507l-.872-3.308a.15.15 0 0 0-.06-.087l-.003-.002a3 3 0 0 1-.143-.092a4.7 4.7 0 0 1-.747 1.39v1.442c0 1.316-1.077 2.31-2.32 2.31h-1.37c-1.225 0-2.333-.998-2.3-2.345V23.87A6.72 6.72 0 0 1 5 18.26v-5.729h-.73c-1.141 0-1.982-.641-2.46-1.238A3.68 3.68 0 0 1 1 9.031c0-.511.123-1.048.303-1.5c.158-.395.51-1.115 1.241-1.57l.004-.002l3.108-1.922q.207-.132.415-.245l-.268-.818A2.25 2.25 0 0 1 7.941 0a4.23 4.23 0 0 1 3.989 2.842l.005.015l3.342 10.103h7.974c1.142 0 2.206.333 3.101.908a2 2 0 1 1 2.35 3.006c.194.577.3 1.194.3 1.836v2.21zm-2.573.562a.94.94 0 0 1-.27-.66v-2.75c0-2.07-1.68-3.75-3.75-3.75h-8.17c-.66 0-1.27-.38-1.57-.97L10.041 3.5a2.24 2.24 0 0 0-1.53-1.425l-.034-.009A2.2 2.2 0 0 0 7.941 2c-.18 0-.3.17-.24.34L8.571 5a1 1 0 0 0-.135.016c-.136.025-.34.079-.579.164a2.96 2.96 0 0 1 1.944 2.77v1c0 1.126-.911 2.05-2.04 2.05h-.76v7.26c0 2.01 1.25 3.72 3.01 4.41v7.02c-.01.17.13.31.3.31h1.37c.137 0 .25-.08.297-.194a.3.3 0 0 0 .023-.116v-1.96q0-.057.01-.11a.67.67 0 0 1 .17-.33c.53-.52.82-1.23.82-1.97V23h5.07a4.45 4.45 0 0 0 3.33-1.5c0 .749.305 1.396.884 1.932q.222.205.496.388l3.96 2.43a.61.61 0 0 1 .26.5v2.93c0 .17.14.31.31.31h1.37c.17 0 .31-.14.31-.31v-5.51c.01-.4-.15-.8-.45-1.09zM3.03 9c.125.572.633 1 1.241 1h3.49c.57 0 1.04-.47 1.04-1.05v-1A1.96 1.96 0 0 0 5.89 6.245L3.6 7.66a1 1 0 0 0-.307.34H3.5c.28 0 .5.22.5.5s-.22.5-.5.5z',
];

/** The 404 page, written as a shell session: the failed `cd`, then `ls` with the ways back. */
@Component({
  selector: 'ks-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="py-20 md:py-28">
      <div class="mx-auto max-w-6xl px-4 md:px-10">
        <span class="eyebrow" i18n="@@notFound.eyebrow">Error 404</span>
        <h1 class="mb-8 text-4xl md:text-5xl" i18n="@@notFound.title">
          Página no encontrada
        </h1>
        <div
          class="rounded-xl max-w-3xl overflow-hidden bg-surface font-mono text-sm shadow-[var(--ks-window-shadow)] md:text-base"
        >
          <div
            class="flex items-center gap-1.5 border-b border-line px-4 py-2.5"
          >
            <span class="size-2.5 rounded-full bg-line"></span>
            <span class="size-2.5 rounded-full bg-line"></span>
            <span class="size-2.5 rounded-full bg-line"></span>
            <span class="flex-1 text-center text-xs font-semibold text-muted"
              >koshi&#64;lima: ~</span
            >
          </div>
          <div
            class="grid grid-cols-[1fr_auto] gap-4 px-5 py-5 leading-loose md:px-6"
          >
            <div class="min-w-0 break-words">
              <div>
                <span class="text-code-string">koshi&#64;lima</span>:<span
                  class="text-accent"
                  >~</span
                >$ cd {{ ruta() }}
              </div>
              <div class="text-accent" i18n="@@notFound.error">
                bash: cd: {{ ruta() }}: No existe el archivo o el directorio
              </div>
              <div>
                <span class="text-code-string">koshi&#64;lima</span>:<span
                  class="text-accent"
                  >~</span
                >$ ls
              </div>
              <nav
                class="flex flex-col gap-x-6 sm:flex-row"
                i18n-aria-label="@@notFound.links"
                aria-label="Páginas"
              >
                <a href="./" class="text-ink" i18n="@@notFound.home">inicio/</a>
                <a [href]="empresas" class="text-ink">{{ empresas }}</a>
              </nav>
              <div>
                <span class="text-code-string">koshi&#64;lima</span>:<span
                  class="text-accent"
                  >~</span
                >$
                <span
                  aria-hidden="true"
                  class="inline-block h-[1.1em] w-[0.6em] translate-y-[0.15em] bg-ink motion-safe:animate-pulse"
                ></span>
              </div>
            </div>
            <svg
              aria-hidden="true"
              class="size-16 self-end text-muted md:size-20"
              viewBox="0 0 32 32"
              fill="currentColor"
            >
              @for (d of llama; track $index) {
                <path [attr.d]="d" />
              }
            </svg>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class NotFound {
  protected readonly llama = LLAMA;
  protected readonly empresas = `${slug('empresas', toLocale(inject(LOCALE_ID)))}/`;
  // Prerendered once as /404; on the served 404.html the browser knows the path that was asked for.
  protected readonly ruta = signal('/…');

  constructor() {
    inject(Meta).updateTag({ name: 'robots', content: 'noindex' });
    afterNextRender(() => this.ruta.set(location.pathname));
  }
}
