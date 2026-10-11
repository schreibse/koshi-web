import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  siAngular,
  siCloudflare,
  siDocker,
  siGithubactions,
  siGitlab,
  siNestjs,
  siNodedotjs,
  siNx,
  siTypescript,
  siVitest,
} from 'simple-icons';

const STACK = [
  { icon: siAngular, url: 'https://angular.dev' },
  { icon: siNestjs, url: 'https://nestjs.com' },
  { icon: siTypescript, url: 'https://www.typescriptlang.org' },
  { icon: siNx, url: 'https://nx.dev' },
  { icon: siNodedotjs, url: 'https://nodejs.org' },
  { icon: siVitest, url: 'https://vitest.dev' },
  { icon: siDocker, url: 'https://www.docker.com' },
  { icon: siGithubactions, url: 'https://github.com/features/actions' },
  { icon: siGitlab, url: 'https://about.gitlab.com' },
  { icon: siCloudflare, url: 'https://www.cloudflare.com' },
];

/** The tools Koshisoftware works with, logo plus name: most visitors know the names, not the marks. */
@Component({
  selector: 'ks-tech-stack',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="border-t border-line py-12 md:py-16"
      aria-labelledby="stack-title"
    >
      <div class="mx-auto max-w-6xl px-4 md:px-10">
        <h2
          id="stack-title"
          class="mb-7 text-center text-sm font-semibold tracking-[0.08em] text-muted uppercase"
          i18n="@@stack.title"
        >
          Tecnologías con las que trabajo
        </h2>
        <ul
          class="m-0 grid list-none grid-cols-2 border-t border-l border-line p-0 md:grid-cols-5"
        >
          @for (tool of stack; track tool.url) {
            <li class="border-r border-b border-line">
              <a
                [href]="tool.url"
                target="_blank"
                rel="noopener"
                class="flex h-full items-center justify-center gap-2.5 px-3 py-5 font-semibold text-ink no-underline hover:bg-surface"
              >
                <svg
                  aria-hidden="true"
                  class="size-6 flex-none fill-current"
                  viewBox="0 0 24 24"
                >
                  <path [attr.d]="tool.icon.path" />
                </svg>
                {{ tool.icon.title }}
                <span class="sr-only" i18n="@@stack.newTab"
                  >(se abre en una pestaña nueva)</span
                >
              </a>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
})
export class TechStack {
  protected readonly stack = STACK;
}
