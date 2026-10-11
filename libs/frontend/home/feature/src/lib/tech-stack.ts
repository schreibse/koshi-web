import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SimpleIcon,
  siAngular,
  siCloudflare,
  siDocker,
  siEslint,
  siGit,
  siGitlab,
  siNestjs,
  siNgrx,
  siNodedotjs,
  siNx,
  siPostgresql,
  siStorybook,
  siTailwindcss,
  siTypescript,
  siVitest,
} from 'simple-icons';
import { PLAYWRIGHT_LOGO } from './playwright-logo';

interface Tool {
  title: string;
  url: string;
  viewBox: string;
  paths: string[];
}

const simple = (icon: SimpleIcon, url: string): Tool => ({
  title: icon.title,
  url,
  viewBox: '0 0 24 24',
  paths: [icon.path],
});

const STACK: Tool[] = [
  simple(siAngular, 'https://angular.dev'),
  simple(siNestjs, 'https://nestjs.com'),
  simple(siTypescript, 'https://www.typescriptlang.org'),
  simple(siNx, 'https://nx.dev'),
  simple(siNgrx, 'https://ngrx.io'),
  simple(siNodedotjs, 'https://nodejs.org'),
  simple(siPostgresql, 'https://www.postgresql.org'),
  simple(siTailwindcss, 'https://tailwindcss.com'),
  simple(siStorybook, 'https://storybook.js.org'),
  simple(siVitest, 'https://vitest.dev'),
  simple(siEslint, 'https://eslint.org'),
  { title: 'Playwright', url: 'https://playwright.dev', ...PLAYWRIGHT_LOGO },
  simple(siDocker, 'https://www.docker.com'),
  simple(siGit, 'https://git-scm.com'),
  simple(siGitlab, 'https://about.gitlab.com'),
  simple(siCloudflare, 'https://www.cloudflare.com'),
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
          class="m-0 grid list-none grid-cols-2 border-t border-l border-line p-0 md:grid-cols-4"
        >
          @for (tool of stack; track tool.url) {
            <li class="flex border-r border-b border-line">
              <a
                [href]="tool.url"
                target="_blank"
                rel="noopener"
                class="flex flex-1 items-center justify-center gap-2.5 px-2 py-5 text-base font-semibold whitespace-nowrap text-ink no-underline hover:bg-surface md:px-3 md:text-lg"
              >
                <svg
                  aria-hidden="true"
                  class="size-6 flex-none fill-current"
                  [attr.viewBox]="tool.viewBox"
                >
                  @for (d of tool.paths; track $index) {
                    <path [attr.d]="d" />
                  }
                </svg>
                {{ tool.title }}
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
