import { ChangeDetectionStrategy, Component } from '@angular/core';

/** A faint dot grid behind a hero; a teal spot drifts over the window's half, never over the text. */
@Component({
  selector: 'ks-dot-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  styles: `
    :host,
    :host::after {
      position: absolute;
      inset: 0;
      background-position: 11px 11px;
      background-size: 22px 22px;
      pointer-events: none;
    }

    :host {
      background-image: radial-gradient(
        circle,
        var(--ks-cell) 1.5px,
        transparent 2px
      );
      mask-image: radial-gradient(
        ellipse 70% 90% at 72% 50%,
        #000 35%,
        transparent 80%
      );
    }

    :host::after {
      background-image: radial-gradient(
        circle,
        var(--ks-accent) 1.7px,
        transparent 2.2px
      );
      clip-path: inset(50% 0 0);
      content: '';
      mask-image: radial-gradient(circle closest-side, #000 40%, transparent);
      mask-position: 60% 0%;
      mask-repeat: no-repeat;
      mask-size: 460px 460px;
      animation: sweep 14s ease-in-out infinite alternate;
    }

    @media (width >= 64rem) {
      :host::after {
        clip-path: inset(0 0 0 50%);
      }
    }

    @keyframes sweep {
      0% {
        mask-position: 55% 0%;
      }

      50% {
        mask-position: 100% 60%;
      }

      100% {
        mask-position: 70% 100%;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      :host::after {
        display: none;
      }
    }
  `,
  template: '',
})
export class DotField {}
