import { ChangeDetectionStrategy, Component } from '@angular/core';

// Lucide icons (ISC), stroke paths only.
const ICONS = {
  talk: ['M7.9 20A9 9 0 1 0 4 16.1L2 22Z'],
  plan: [
    'M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z',
    'M15 5.764v15',
    'M9 3.236v15',
  ],
  build: ['m16 18 6-6-6-6', 'm8 6-6 6 6 6'],
  launch: [
    'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z',
    'm12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z',
    'M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0',
    'M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5',
  ],
  support: [
    'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20',
    'm4.93 4.93 4.24 4.24',
    'm14.83 9.17 4.24-4.24',
    'm14.83 14.83 4.24 4.24',
    'm9.17 14.83-4.24 4.24',
    'M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8',
  ],
};

const PASOS = [
  {
    icono: ICONS.talk,
    titulo: $localize`:@@process.talk.title:Conversamos`,
    texto: $localize`:@@process.talk.text:Entiendo tu objetivo, tu equipo y tu plazo.`,
  },
  {
    icono: ICONS.plan,
    titulo: $localize`:@@process.plan.title:Planificamos`,
    texto: $localize`:@@process.plan.text:Alcance claro, entregas cortas y un precio acordado.`,
  },
  {
    icono: ICONS.build,
    titulo: $localize`:@@process.build.title:Construyo`,
    texto: $localize`:@@process.build.text:Avances visibles cada semana, en una URL de prueba.`,
  },
  {
    icono: ICONS.launch,
    titulo: $localize`:@@process.launch.title:Lanzamos`,
    texto: $localize`:@@process.launch.text:Tests, Lighthouse 100 y salida a producción sin sustos.`,
  },
  {
    icono: ICONS.support,
    titulo: $localize`:@@process.support.title:Acompaño`,
    texto: $localize`:@@process.support.text:Mantenimiento, mejoras y capacitación para tu equipo.`,
  },
];

/** How a project runs, drawn as a CI pipeline whose stages have all passed. */
@Component({
  selector: 'ks-process-pipeline',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="border-t border-line bg-tint py-16 md:py-28">
      <div class="mx-auto max-w-6xl px-4 md:px-10">
        <span class="eyebrow" i18n="@@process.eyebrow">Cómo trabajo</span>
        <h2 class="mb-10 text-3xl md:mb-12 md:text-5xl" i18n="@@process.title">
          Cinco pasos, sin sorpresas
        </h2>
        <div
          class="rounded-xl bg-surface p-5 shadow-[var(--ks-window-shadow)] md:p-8"
        >
          <div
            class="mb-6 flex items-center justify-between font-mono text-sm text-muted"
          >
            <span i18n="@@process.pipeline">pipeline #tu-proyecto</span>
            <span class="text-accent">● passed</span>
          </div>
          <ol class="m-0 grid list-none gap-0 p-0 md:grid-cols-5">
            @for (
              paso of pasos;
              track paso.titulo;
              let i = $index, last = $last
            ) {
              <li
                class="relative grid grid-cols-[3.25rem_1fr] gap-x-4 pb-7 md:block md:pr-6 md:pb-0"
              >
                @if (!last) {
                  <span
                    aria-hidden="true"
                    class="absolute top-15 bottom-2 left-[calc(1.625rem-1px)] w-0.5 bg-[repeating-linear-gradient(to_bottom,var(--color-muted)_0_6px,transparent_6px_12px)] opacity-50 md:hidden"
                  ></span>
                  <span
                    aria-hidden="true"
                    class="absolute top-[calc(1.625rem-1px)] right-2 left-15 hidden h-0.5 bg-[repeating-linear-gradient(to_right,var(--color-muted)_0_6px,transparent_6px_12px)] opacity-50 md:block"
                  ></span>
                }
                <span
                  class="relative grid size-13 place-items-center rounded-full border-[1.5px] border-accent bg-surface text-accent shadow-[0_0_0_5px_var(--ks-surface)]"
                >
                  <svg
                    aria-hidden="true"
                    class="size-[22px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    @for (d of paso.icono; track $index) {
                      <path [attr.d]="d" />
                    }
                  </svg>
                </span>
                <div class="md:mt-4">
                  <h3
                    class="m-0 mb-1.5 flex items-center gap-2 text-lg leading-snug"
                  >
                    <span class="font-mono text-accent">0{{ i + 1 }}</span>
                    {{ paso.titulo }}
                    <svg
                      aria-hidden="true"
                      class="size-[15px] flex-none text-accent"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </h3>
                  <p class="m-0 text-base text-muted">{{ paso.texto }}</p>
                </div>
              </li>
            }
          </ol>
        </div>
      </div>
    </section>
  `,
})
export class ProcessPipeline {
  protected readonly pasos = PASOS;
}
