import { ChangeDetectionStrategy, Component } from '@angular/core';

// Box coordinates (0–100 both ways): runs stay in the outer bands, then dive under the window it surrounds.
const TRACES = [
  { d: 'M100 4 H78 L74 8 V30', duration: '7s', delay: '0s' },
  { d: 'M56 0 V30', duration: '5.5s', delay: '1.8s' },
  { d: 'M20 0 V3 L24 7 V30', duration: '8s', delay: '3.1s' },
  { d: 'M100 40 H85', duration: '4.5s', delay: '0.9s' },
  { d: 'M100 70 H97 L94 64 H85', duration: '6.5s', delay: '2.6s' },
  { d: 'M100 96 H70 L66 92 V70', duration: '7.5s', delay: '4.2s' },
  { d: 'M36 100 V94 L32 90 V70', duration: '6s', delay: '1.2s' },
];

/** Faint circuit traces around a window, with teal pulses running into it. */
@Component({
  selector: 'ks-signal-traces',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  styles: `
    :host {
      position: absolute;
      z-index: -1;
      inset: -2rem -1rem -2.5rem;
      pointer-events: none;
    }

    @media (width >= 48rem) {
      :host {
        inset: -2rem -2.5rem -2.5rem;
      }
    }

    @media (width >= 64rem) {
      :host {
        inset: -2rem -3rem -2.5rem -1.5rem;
      }
    }

    svg {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    path {
      fill: none;
      vector-effect: non-scaling-stroke;
    }

    .wire {
      stroke: var(--ks-line);
      stroke-width: 1.5;
    }

    .pulse {
      animation: travel linear infinite;
      stroke: var(--ks-accent);
      stroke-dasharray: 6 94;
      stroke-dashoffset: 6;
      stroke-linecap: round;
      stroke-width: 2;
    }

    @keyframes travel {
      0% {
        opacity: 0;
        stroke-dashoffset: 6;
      }

      8%,
      85% {
        opacity: 1;
      }

      100% {
        opacity: 0;
        stroke-dashoffset: -94;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .pulse {
        display: none;
      }
    }
  `,
  template: `
    <svg viewBox="0 0 100 100" preserveAspectRatio="none">
      @for (trace of traces; track $index) {
        <path class="wire" [attr.d]="trace.d" />
      }
      @for (trace of traces; track $index) {
        <path
          class="pulse"
          [attr.d]="trace.d"
          pathLength="100"
          [style.animation-duration]="trace.duration"
          [style.animation-delay]="trace.delay"
        />
      }
    </svg>
  `,
})
export class SignalTraces {
  protected readonly traces = TRACES;
}
