import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ks-wordmark',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-flex items-baseline gap-[0.15em] text-2xl tracking-tight',
  },
  template: `
    <span class="wordmark font-light"
      ><b class="font-extrabold">koshi</b>software</span
    >
    <i aria-hidden="true" class="size-[0.24em] rounded-[1px] bg-accent"></i>
  `,
})
export class Wordmark {}
