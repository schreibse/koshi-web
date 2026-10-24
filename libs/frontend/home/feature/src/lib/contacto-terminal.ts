import { ChangeDetectionStrategy, Component } from '@angular/core';

/** The decorative prompt beside a closing contact call; screen readers skip it. */
@Component({
  selector: 'ks-contacto-terminal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'block overflow-hidden rounded-[12px] border border-line bg-surface font-mono text-[1.15rem]',
    'aria-hidden': 'true',
  },
  template: `
    <div class="flex gap-1.5 border-b border-line px-4 py-3">
      <i class="size-2.5 rounded-full bg-line"></i>
      <i class="size-2.5 rounded-full bg-line"></i>
      <i class="size-2.5 rounded-full bg-line"></i>
    </div>
    <p class="px-6 pt-6 pb-7 leading-loose">
      <span class="text-accent">$&nbsp;</span
      ><span i18n="@@contact.terminalCommand">nuevo-proyecto</span><br />
      <span class="text-muted" i18n="@@contact.terminalQuestion"
        >? ¿Qué quieres construir?</span
      ><br />
      <span class="text-accent">›</span> ▍
    </p>
  `,
})
export class ContactoTerminal {}
