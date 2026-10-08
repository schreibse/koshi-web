import { Component } from '@angular/core';

@Component({
  selector: 'ks-wordmark',
  template: `<span class="wordmark"><b>koshi</b>software</span
    ><i aria-hidden="true"></i>`,
  styles: `
    :host {
      display: inline-flex;
      align-items: baseline;
      gap: 0.15em;
      font-size: 1.5rem;
      letter-spacing: -0.01em;
    }
    .wordmark {
      font-weight: 300;
    }
    b {
      font-weight: 800;
    }
    i {
      width: 0.24em;
      height: 0.24em;
      border-radius: 1px;
      background: var(--accent);
    }
  `,
})
export class Wordmark {}
