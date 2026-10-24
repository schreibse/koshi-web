import { ChangeDetectionStrategy, Component } from '@angular/core';

// [row, column]; negative lines count from the far edge, so cells stay outside the window at any size.
const POSITIONS: readonly (readonly [number, number])[] = [
  [1, 4],
  [2, 9],
  [1, 14],
  [3, 18],
  [2, 23],
  [1, -5],
  [3, -9],
  [2, -14],
  [1, -19],
  [6, -2],
  [10, -3],
  [14, -2],
  [-8, -3],
  [-12, -2],
  [-2, 6],
  [-3, 11],
  [-2, 17],
  [-4, 21],
  [-3, -7],
  [-2, -12],
  [-4, -16],
  [8, 1],
  [16, 1],
  [-6, 1],
  [3, 2],
  [-2, -3],
];
const LEVELS = [0.35, 0.55, 0.8, 1];

const CELLS = POSITIONS.map(([row, column], i) => ({
  area: `${row} / ${column}`,
  level: LEVELS[i % LEVELS.length],
  delay: `${((i * 2.3) % 9).toFixed(1)}s`,
}));

/** A faint commit-history grid behind the hero editor, its cells lighting up out of step. */
@Component({
  selector: 'ks-contribution-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  styles: `
    :host {
      position: absolute;
      z-index: -1;
      inset: -3.5rem -3rem;
      display: grid;
      grid-template-columns: repeat(auto-fill, 12px);
      grid-template-rows: repeat(auto-fill, 12px);
      gap: 4px;
      padding: 4px 0 0 4px;
      background: conic-gradient(
          from 90deg at 4px 4px,
          var(--ks-cell) 90deg,
          transparent 0
        )
        0 0 / 16px 16px;
      mask-image: radial-gradient(
        ellipse 55% 55% at 50% 50%,
        #000 72%,
        transparent 100%
      );
      pointer-events: none;
    }

    @media (width >= 64rem) {
      :host {
        left: -1.5rem;
      }
    }

    i {
      border-radius: 2px;
      background: var(--ks-accent);
      opacity: 0;
      animation: commit 9s ease-in-out infinite;
    }

    @keyframes commit {
      0%,
      100% {
        opacity: 0;
      }

      20%,
      55% {
        opacity: var(--level);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      i {
        opacity: var(--level);
        animation: none;
      }
    }
  `,
  template: `
    @for (cell of cells; track $index) {
      <i
        [style.grid-area]="cell.area"
        [style.--level]="cell.level"
        [style.animation-delay]="cell.delay"
      ></i>
    }
  `,
})
export class ContributionGrid {
  protected readonly cells = CELLS;
}
