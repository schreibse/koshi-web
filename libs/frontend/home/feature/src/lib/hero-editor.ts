import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';

type Tab = 'web' | 'api';
type Kind = 'keyword' | 'string' | 'comment';
type Token = string | { readonly text: string; readonly kind: Kind };

const k = (text: string): Token => ({ text, kind: 'keyword' });
const s = (text: string): Token => ({ text, kind: 'string' });
const c = (text: string): Token => ({ text, kind: 'comment' });

const files: Record<Tab, { name: string; lines: Token[][] }> = {
  web: {
    name: 'pedidos.ts',
    lines: [
      [c(`// ${$localize`:@@hero.code.web:Lista de pedidos con signals`}`)],
      [k('@Component'), '({'],
      ['  selector: ', s("'ks-pedidos'"), ','],
      ['  template: `'],
      [
        '    ',
        k('@for'),
        ' (pedido ',
        k('of'),
        ' pedidos(); ',
        k('track'),
        ' pedido.id) {',
      ],
      ['      <', s('ks-pedido-card'), ' [pedido]="pedido" />'],
      ['    }'],
      ['  `,'],
      ['})'],
      [k('export class'), ' ', s('Pedidos'), ' {'],
      ['  pedidos = ', k('inject'), '(', s('PedidosStore'), ').lista;'],
      ['}'],
    ],
  },
  api: {
    name: 'pedidos.controller.ts',
    lines: [
      [
        c(
          `// ${$localize`:@@hero.code.api:API de pedidos, probada y documentada`}`,
        ),
      ],
      [k('@Controller'), '(', s("'pedidos'"), ')'],
      [k('export class'), ' ', s('PedidosController'), ' {'],
      [
        '  ',
        k('constructor'),
        '(',
        k('private readonly'),
        ' pedidos: ',
        s('PedidosService'),
        ') {}',
      ],
      [],
      ['  ', k('@Get'), '(', s("':id'"), ')'],
      ['  buscar(', k('@Param'), '(', s("'id'"), ') id: ', s('string'), ') {'],
      ['    ', k('return this'), '.pedidos.buscar(id);'],
      ['  }'],
      ['}'],
    ],
  },
};

const kindClass: Record<Kind, string> = {
  keyword: 'text-accent',
  string: 'text-code-string',
  comment: 'text-muted',
};

/** A GNOME-style editor window that shows the web and the api side of one feature in turn. */
@Component({
  selector: 'ks-hero-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="window-backdrop"
      (mouseenter)="paused = true"
      (mouseleave)="paused = false"
      (focusin)="paused = true"
      (focusout)="paused = false"
    >
      <div
        class="overflow-hidden rounded-[12px] border border-line bg-surface shadow-[var(--ks-window-shadow)]"
      >
        <div class="relative border-b border-line px-11 py-2.5 text-center">
          <div class="text-[0.8rem] font-bold">{{ file().name }}</div>
          <div
            role="tablist"
            class="mt-1.5 inline-flex rounded-[6px] bg-page p-0.5 text-xs"
            i18n-aria-label="@@hero.code.tabs"
            aria-label="Código de ejemplo"
          >
            @for (tab of tabs; track tab) {
              <button
                type="button"
                role="tab"
                [id]="'hero-tab-' + tab"
                [attr.aria-controls]="'hero-code-' + tab"
                [attr.aria-selected]="tab === active()"
                [tabIndex]="tab === active() ? 0 : -1"
                class="cursor-pointer rounded-[5px] border-0 px-3 py-0.5 font-sans"
                [class]="
                  tab === active()
                    ? 'bg-line font-semibold text-ink'
                    : 'bg-transparent text-muted'
                "
                (click)="choose(tab)"
                (keydown.arrowleft)="chooseOther($event)"
                (keydown.arrowright)="chooseOther($event)"
              >
                {{ tab }}
              </button>
            }
          </div>
          <span
            class="absolute top-1/2 right-2.5 grid size-[22px] -translate-y-1/2 place-items-center rounded-full bg-line"
            aria-hidden="true"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            >
              <path d="M2 2l6 6M8 2l-6 6" />
            </svg>
          </span>
        </div>
        <!-- Both panels share one cell, so the window keeps the taller one's height when they swap. -->
        <div class="grid">
          @for (tab of tabs; track tab) {
            <pre
              [id]="'hero-code-' + tab"
              role="tabpanel"
              tabindex="0"
              [attr.aria-labelledby]="'hero-tab-' + tab"
              class="m-0 overflow-x-auto px-5 py-4 font-mono text-[0.78rem] leading-[1.7] [grid-area:1/1]"
              [class.invisible]="tab !== active()"
            ><code>@for (line of files[tab].lines; track $index) {<span class="block min-h-[1lh]">@for (token of line; track $index) {<span [class]="classOf(token)">{{ textOf(token) }}</span>}</span>}</code></pre>
          }
        </div>
      </div>
    </div>
  `,
})
export class HeroEditor {
  protected readonly tabs: readonly Tab[] = ['web', 'api'];
  protected readonly files = files;
  protected readonly active = signal<Tab>('web');
  protected readonly file = computed(() => files[this.active()]);
  protected paused = false;
  private timer?: ReturnType<typeof setInterval>;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      this.timer = setInterval(() => {
        if (!this.paused) this.move();
      }, 6000);
      destroyRef.onDestroy(() => clearInterval(this.timer));
    });
  }

  protected choose(tab: Tab): void {
    clearInterval(this.timer);
    this.active.set(tab);
  }

  protected chooseOther(event: Event): void {
    const tab = this.active() === 'web' ? 'api' : 'web';
    this.choose(tab);
    (event.currentTarget as HTMLElement).parentElement
      ?.querySelector<HTMLElement>(`#hero-tab-${tab}`)
      ?.focus();
  }

  protected move(): void {
    this.active.update((tab) => (tab === 'web' ? 'api' : 'web'));
  }

  protected classOf(token: Token): string {
    return typeof token === 'string' ? '' : kindClass[token.kind];
  }

  protected textOf(token: Token): string {
    return typeof token === 'string' ? token : token.text;
  }
}
