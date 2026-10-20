import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

// Roles say "Desarrollador", never "Ingeniero": the title is regulated in Peru.
const TRAYECTORIA = [
  {
    anios: '2009–2017',
    lugar: 'Graz, Austria',
    rol: $localize`:@@sobre.stage1.role:Desarrollador de software`,
    detalle: $localize`:@@sobre.stage1.detail:Primero junto con mis estudios; luego SharePoint con C# y PowerShell, y web con JavaScript, HTML y CSS.`,
  },
  {
    anios: '2017–2021',
    lugar: 'Graz, Austria',
    rol: $localize`:@@sobre.stage2.role:Desarrollador senior, frontend`,
    detalle: $localize`:@@sobre.stage2.detail:Angular y TypeScript; backend en C# y Java (Spring).`,
  },
  {
    anios: $localize`:@@sobre.stage3.years:2021–hoy`,
    lugar: $localize`:@@sobre.stage3.place:Perú`,
    rol: $localize`:@@sobre.stage3.role:Freelance`,
    detalle: $localize`:@@sobre.stage3.detail:En remoto para clientes en Austria; desde 2024 con mi empresa, KOSHISOFTWARE E.I.R.L.`,
  },
];

/** The person behind Koshisoftware: career and education, without employer names. */
@Component({
  selector: 'ks-sobre-mi',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    h2 {
      margin: 3rem 0 1.25rem;
      font-size: 1.875rem;
    }
  `,
  template: `
    <article class="mx-auto max-w-3xl px-4 py-12 md:px-10 md:py-16">
      <span class="eyebrow" i18n="@@sobre.eyebrow">Sobre mí</span>
      <h1 class="text-4xl md:text-6xl">Stephan Schreiber</h1>
      <p class="mt-5 text-xl text-muted" i18n="@@sobre.intro">
        Desarrollo aplicaciones web con Angular, y pruebo y mido lo que
        construyo. Programo desde 2009: me formé en la FH JOANNEUM, trabajé
        varios años en empresas de Graz, Austria, y desde 2021 soy freelance en
        Perú. Hoy lo hago con mi propia empresa, KOSHISOFTWARE E.I.R.L.
      </p>

      <h2 i18n="@@sobre.career.title">Trayectoria</h2>
      <ol class="m-0 grid list-none gap-6 p-0">
        @for (etapa of trayectoria; track etapa.anios) {
          <li class="border-l-2 border-line pl-5">
            <p class="m-0 text-sm text-muted">
              {{ etapa.anios }} · {{ etapa.lugar }}
            </p>
            <p class="m-0 mt-1 text-lg font-semibold">{{ etapa.rol }}</p>
            <p class="m-0 mt-1 text-muted">{{ etapa.detalle }}</p>
          </li>
        }
      </ol>

      <h2 i18n="@@sobre.education.title">Formación</h2>
      <ul class="m-0 grid list-none gap-4 p-0">
        <li>
          <p class="m-0 text-lg font-semibold">
            Dipl.-Ing. — Diplom-Ingenieur für technisch-wissenschaftliche Berufe
          </p>
          <p class="m-0 mt-1 text-muted" i18n="@@sobre.master">
            Information Management, programa de maestría, 2009–2012
          </p>
        </li>
        <li>
          <p class="m-0 text-lg font-semibold">
            Bachelor of Science in Engineering (BSc)
          </p>
          <p class="m-0 mt-1 text-muted" i18n="@@sobre.bachelor">
            Information Management, 2006–2009
          </p>
        </li>
      </ul>
      <p class="mt-4 text-muted" i18n="@@sobre.school">
        Ambos en la
        <a href="https://www.fh-joanneum.at/en/" target="_blank" rel="noopener"
          >FH JOANNEUM – University of Applied Sciences<span class="sr-only">
            (se abre en una pestaña nueva)</span
          ></a
        >, en Graz, Austria. Estudié desarrollo de software, bases de datos,
        seguridad, usabilidad y arquitectura de sistemas, con prácticas
        profesionales en empresa en ambos programas.
      </p>

      <div class="mt-12 flex flex-wrap gap-3">
        <a
          href="https://www.linkedin.com/in/stephan-schreiber-7b9802212/"
          target="_blank"
          rel="me noopener"
          class="btn"
          >LinkedIn<span class="sr-only" i18n="@@stack.newTab"
            >(se abre en una pestaña nueva)</span
          ></a
        >
        <a
          href="mailto:hola@koshisoftware.pe?subject=CV"
          class="btn btn-primary"
          i18n="@@sobre.cv"
          >Pídeme mi CV</a
        >
      </div>
    </article>
  `,
})
export class SobreMi {
  protected readonly trayectoria = TRAYECTORIA;

  constructor() {
    inject(Title).setTitle(
      $localize`:@@sobre.pageTitle:Sobre mí · Koshisoftware`,
    );
    inject(Meta).updateTag({
      name: 'description',
      content: $localize`:@@sobre.description:Stephan Schreiber, fundador de Koshisoftware: desarrollador web con Angular desde Perú, formado en Austria.`,
    });
  }
}
