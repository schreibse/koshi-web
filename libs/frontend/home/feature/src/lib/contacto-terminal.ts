import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
} from '@angular/core';

const COMMAND = $localize`:@@contact.terminalCommand:nuevo-proyecto`;

/** The decorative prompt beside a closing contact call; it types its command once on view. Screen readers skip it. */
@Component({
  selector: 'ks-contacto-terminal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'block overflow-hidden rounded-[12px] border border-line bg-surface font-mono text-[1.15rem]',
    'aria-hidden': 'true',
  },
  styles: `
    .cmd {
      display: inline-block;
      overflow: hidden;
      vertical-align: bottom;
      white-space: nowrap;
    }

    :host(.typing) {
      .cmd {
        width: 0;
        animation: type calc(var(--chars) * 80ms) steps(var(--chars), end) 0.4s
          forwards;
      }

      .question {
        opacity: 0;
        animation: appear 0s calc(var(--chars) * 80ms + 0.8s) forwards;
      }

      .answer {
        opacity: 0;
        animation: appear 0s calc(var(--chars) * 80ms + 1.2s) forwards;
      }

      .caret {
        animation: blink 1s steps(1, end) calc(var(--chars) * 80ms + 1.2s) 8;
      }
    }

    @keyframes type {
      to {
        width: calc(var(--chars) * 1ch);
      }
    }

    @keyframes appear {
      to {
        opacity: 1;
      }
    }

    @keyframes blink {
      50% {
        opacity: 0;
      }
    }
  `,
  template: `
    <div class="flex gap-1.5 border-b border-line px-4 py-3">
      <i class="size-2.5 rounded-full bg-line"></i>
      <i class="size-2.5 rounded-full bg-line"></i>
      <i class="size-2.5 rounded-full bg-line"></i>
    </div>
    <p class="px-6 pt-6 pb-7 leading-loose" [style.--chars]="command.length">
      <span class="text-accent">$&nbsp;</span
      ><span class="cmd">{{ command }}</span
      ><br />
      <span class="question text-muted" i18n="@@contact.terminalQuestion"
        >? ¿Qué quieres construir?</span
      ><br />
      <span class="answer"
        ><span class="text-accent">›</span> <span class="caret">▍</span></span
      >
    </p>
  `,
})
export class ContactoTerminal {
  protected readonly command = COMMAND;

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          host.classList.add('typing');
          observer.disconnect();
        },
        { threshold: 0.6 },
      );
      observer.observe(host);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
