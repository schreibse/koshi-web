import { ChangeDetectionStrategy, Component } from '@angular/core';

const WIDTH = 150;
const HEIGHT = 46;
const BEAT = 1.2;

interface Node {
  readonly x: number;
  readonly y: number;
  readonly name: string;
  readonly kind: string;
  /** Build order: a project builds after everything it depends on. */
  readonly layer: number;
}

const NODES = {
  web: { x: 20, y: 20, name: 'web', kind: 'app · Angular', layer: 3 },
  api: { x: 230, y: 20, name: 'api', kind: 'app · NestJS', layer: 2 },
  feature: { x: 20, y: 110, name: 'pedidos', kind: 'lib · feature', layer: 2 },
  module: {
    x: 230,
    y: 110,
    name: 'pedidos',
    kind: $localize`:@@services.graph.module:módulo · NestJS`,
    layer: 1,
  },
  data: { x: 20, y: 200, name: 'data-access', kind: 'lib · HTTP', layer: 1 },
  shared: {
    x: 125,
    y: 286,
    name: 'contratos',
    kind: $localize`:@@services.graph.shared:lib · tipos compartidos`,
    layer: 0,
  },
} satisfies Record<string, Node>;

const DEPENDENCIES: readonly (readonly [
  keyof typeof NODES,
  keyof typeof NODES,
])[] = [
  ['web', 'feature'],
  ['feature', 'data'],
  ['data', 'shared'],
  ['api', 'module'],
  ['module', 'shared'],
];

const builtAt = (node: Node) => node.layer * BEAT + 0.3;

const EDGES = DEPENDENCIES.map(([from, to]) => {
  const a: Node = NODES[from];
  const b: Node = NODES[to];
  const x1 = a.x + WIDTH / 2;
  const y1 = a.y + HEIGHT;
  const x2 = b.x + WIDTH / 2;
  const mid = (y1 + b.y) / 2;
  return {
    d: `M${x2} ${b.y} C${x2} ${mid} ${x1} ${mid} ${x1} ${y1}`,
    delay: `${builtAt(a) - 0.6}s`,
  };
});

/** An example monorepo, an Angular app and a NestJS API sharing one contracts lib, lighting up in build order. */
@Component({
  selector: 'ks-project-graph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  styles: `
    svg {
      display: block;
      width: 100%;
      max-width: 30rem;
      height: auto;
      margin-inline: auto;
    }

    .edge,
    .lit {
      fill: none;
    }

    .edge {
      stroke: var(--ks-line);
      stroke-width: 1.5;
    }

    .lit {
      animation: draw 8s ease-out infinite;
      stroke: var(--ks-accent);
      stroke-dasharray: 1;
      stroke-dashoffset: 1;
      stroke-width: 2;
    }

    .box {
      fill: var(--ks-surface);
      stroke: var(--ks-line);
      stroke-width: 1.5;
    }

    .ring {
      animation: glow 8s ease-out infinite;
      fill: none;
      opacity: 0;
      stroke: var(--ks-accent);
      stroke-width: 2;
    }

    .name {
      fill: var(--ks-ink);
      font-family: var(--ks-font-mono);
      font-size: 14px;
    }

    .kind {
      fill: var(--ks-muted);
      font-family: var(--ks-font);
      font-size: 11.5px;
    }

    .http {
      fill: none;
      stroke: var(--ks-muted);
      stroke-dasharray: 3 4;
      stroke-width: 1.5;
    }

    .http-label {
      fill: var(--ks-muted);
      font-family: var(--ks-font-mono);
      font-size: 10.5px;
    }

    .request {
      animation: request 4s ease-in-out infinite;
      fill: var(--ks-code-keyword);
    }

    @keyframes draw {
      0% {
        opacity: 1;
        stroke-dashoffset: 1;
      }

      9%,
      62% {
        opacity: 1;
        stroke-dashoffset: 0;
      }

      75%,
      100% {
        opacity: 0;
        stroke-dashoffset: 0;
      }
    }

    @keyframes glow {
      0%,
      78%,
      100% {
        opacity: 0;
      }

      4%,
      66% {
        opacity: 1;
      }
    }

    @keyframes request {
      0%,
      10% {
        opacity: 0;
        transform: translateX(0);
      }

      15% {
        opacity: 1;
      }

      45% {
        opacity: 1;
        transform: translateX(56px);
      }

      50%,
      100% {
        opacity: 0;
        transform: translateX(56px);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .lit,
      .ring,
      .request {
        display: none;
      }
    }
  `,
  template: `
    <svg
      viewBox="0 0 400 350"
      role="img"
      i18n-aria-label="@@services.graph.label"
      aria-label="Ejemplo de proyecto: una app Angular y una API NestJS que comparten contratos"
    >
      @for (edge of edges; track $index) {
        <path class="edge" [attr.d]="edge.d" />
      }
      @for (edge of edges; track $index) {
        <path
          class="lit"
          [attr.d]="edge.d"
          pathLength="1"
          [style.animation-delay]="edge.delay"
        />
      }
      <path class="http" d="M170 43 H230" />
      <text class="http-label" x="200" y="36" text-anchor="middle">HTTP</text>
      <circle class="request" cx="172" cy="43" r="3.5" />
      @for (node of nodes; track $index) {
        <rect
          class="box"
          [attr.x]="node.x"
          [attr.y]="node.y"
          [attr.width]="width"
          [attr.height]="height"
          rx="6"
        />
        <rect
          class="ring"
          [attr.x]="node.x"
          [attr.y]="node.y"
          [attr.width]="width"
          [attr.height]="height"
          rx="6"
          [style.animation-delay]="delayOf(node)"
        />
        <text class="name" [attr.x]="node.x + 12" [attr.y]="node.y + 20">
          {{ node.name }}
        </text>
        <text class="kind" [attr.x]="node.x + 12" [attr.y]="node.y + 36">
          {{ node.kind }}
        </text>
      }
    </svg>
  `,
})
export class ProjectGraph {
  protected readonly nodes: readonly Node[] = Object.values(NODES);
  protected readonly edges = EDGES;
  protected readonly width = WIDTH;
  protected readonly height = HEIGHT;

  protected delayOf(node: Node): string {
    return `${builtAt(node)}s`;
  }
}
