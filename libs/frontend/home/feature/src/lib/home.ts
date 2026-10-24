import {
  ChangeDetectionStrategy,
  Component,
  LOCALE_ID,
  inject,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { slug, toLocale } from '@koshi/shared/locale/util';
import { KOSHISOFTWARE } from './caso-koshisoftware';
import { LIBRO } from './caso-libro';
import { ContactoTerminal } from './contacto-terminal';
import { HeroEditor } from './hero-editor';
import { ProcessPipeline } from './process-pipeline';
import { ProjectGraph } from './project-graph';
import { ProjectShot } from './project-shot';
import { TechStack } from './tech-stack';

@Component({
  selector: 'ks-home',
  imports: [
    ContactoTerminal,
    HeroEditor,
    ProcessPipeline,
    ProjectGraph,
    ProjectShot,
    TechStack,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="overflow-x-clip">
      <div
        class="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-14 px-4 py-20 md:px-10 md:py-28 lg:grid-cols-2"
      >
        <div>
          <span class="eyebrow" i18n="@@hero.eyebrow"
            >Desarrollo web senior · Perú y remoto</span
          >
          <h1
            class="max-w-[8.5em] text-5xl md:text-7xl lg:text-6xl"
            i18n="@@hero.title"
          >
            Software
            <em
              class="font-mono font-semibold tracking-[-0.04em] text-accent not-italic"
              >koshi</em
            >, hecho en Perú.
          </h1>
          <p class="mt-6 max-w-xl text-xl text-muted" i18n="@@hero.lead">
            Desarrollo frontend con Angular y backend con NestJS para empresas
            en Perú y el extranjero.
          </p>
          <div class="mt-10 flex flex-wrap gap-3">
            <a href="#contacto" class="btn btn-primary" i18n="@@hero.cta"
              >Hablemos →</a
            >
            <a href="#proyectos" class="btn" i18n="@@hero.work"
              >Ver proyectos</a
            >
          </div>
        </div>
        <ks-hero-editor />
      </div>
    </section>

    @defer (hydrate on viewport) {
      <ks-tech-stack />
    }

    <section id="servicios" class="border-t border-line bg-band py-16 md:py-28">
      <div class="mx-auto max-w-6xl px-4 md:px-10">
        <div
          class="mb-12 grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[5fr_6fr]"
        >
          <div>
            <span class="eyebrow" i18n="@@services.eyebrow">Servicios</span>
            <h2 class="mb-6 text-3xl md:text-5xl" i18n="@@services.title">
              Lo que hago
            </h2>
            <p class="max-w-xl text-xl text-muted" i18n="@@services.lead">
              La web y la API están en un mismo repositorio y comparten sus
              tipos, así que un cambio que rompa una de las dos se detecta antes
              de salir a producción.
            </p>
          </div>
          <ks-project-graph />
        </div>
        <ul class="m-0 grid list-none gap-6 p-0 md:grid-cols-2 lg:grid-cols-4">
          @for (servicio of servicios; track servicio.titulo) {
            <li class="rounded-base bg-surface p-8">
              <h3 class="mb-2 text-[1.35rem]">
                <span
                  class="font-mono text-[0.9em] font-medium text-accent"
                  aria-hidden="true"
                  >({{ $index + 1 }})</span
                >
                {{ servicio.titulo }}
              </h3>
              <p class="mb-5 text-muted">{{ servicio.texto }}</p>
              <ul class="m-0 grid list-none gap-2 p-0 text-base">
                @for (punto of servicio.puntos; track punto) {
                  <li class="flex gap-2">
                    <svg
                      aria-hidden="true"
                      class="mt-1 size-4 flex-none stroke-accent"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {{ punto }}
                  </li>
                }
              </ul>
            </li>
          }
        </ul>
        <p class="mt-10 text-lg">
          <a [href]="empresas" i18n="@@services.business"
            >¿Tienes un negocio y necesitas una web? Webs para empresas →</a
          >
        </p>
      </div>
    </section>

    <section id="proyectos" class="border-t border-line py-16 md:py-28">
      <div class="mx-auto max-w-6xl px-4 md:px-10">
        <span class="eyebrow" i18n="@@work.eyebrow">Proyectos</span>
        <h2 class="mb-10 text-3xl md:text-5xl" i18n="@@work.title">
          Trabajo reciente
        </h2>
        <div class="grid gap-8">
          @for (caso of casos; track caso.path) {
            <article
              class="grid grid-cols-[minmax(0,1fr)] items-center gap-10 rounded-base bg-surface p-6 md:p-10 lg:grid-cols-[5fr_6fr]"
            >
              <div class="grid content-start gap-4">
                <span class="text-sm font-semibold text-accent">{{
                  caso.categoria
                }}</span>
                <h3 class="text-3xl">{{ caso.titulo }}</h3>
                <p class="m-0 text-lg text-muted">{{ caso.lead }}</p>
                <ul class="m-0 flex list-none flex-wrap gap-2 p-0">
                  @for (tag of caso.tags; track tag) {
                    <li
                      class="rounded-full bg-tint px-2.5 py-0.5 text-sm font-semibold"
                    >
                      {{ tag }}
                    </li>
                  }
                </ul>
                <a [href]="caso.url" class="btn mt-2 justify-self-start"
                  ><ng-container i18n="@@work.read"
                    >Leer el caso de estudio</ng-container
                  ><span class="sr-only">: {{ caso.titulo }}</span></a
                >
              </div>
              <ks-project-shot
                [host]="caso.host"
                [image]="caso.image"
                [alt]="caso.alt"
              />
            </article>
          }
        </div>
      </div>
    </section>

    @defer (hydrate on viewport) {
      <ks-process-pipeline />
    }

    <section id="nosotros" class="border-t border-line py-16 md:py-28">
      <div class="mx-auto max-w-6xl px-4 md:px-10">
        <span class="eyebrow" i18n="@@about.eyebrow">Nosotros</span>
        <h2 class="mb-10 text-3xl md:text-5xl" i18n="@@about.title">
          Una persona, un compromiso
        </h2>
        <div
          class="max-w-3xl rounded-base border border-line bg-surface p-8 shadow-[var(--ks-window-shadow)]"
        >
          <p
            class="mb-4 font-mono text-[0.9rem] font-medium text-muted"
            aria-hidden="true"
          >
            <span class="text-accent">$</span> whoami
          </p>
          <p class="text-xl font-bold">Stephan Schreiber</p>
          <p class="mb-4 text-muted" i18n="@@about.role">
            Desarrollador y titular de Koshisoftware
          </p>
          <p class="max-w-2xl text-xl text-muted" i18n="@@about.text">
            Koshisoftware es una empresa individual en Perú. Trabajas
            directamente con quien escribe el código, en tu zona horaria y en tu
            idioma.
          </p>
          <p class="mt-5 text-lg">
            <a [href]="sobreMi" i18n="@@about.more">Más sobre mí →</a>
          </p>
        </div>
      </div>
    </section>

    <section id="contacto" class="border-t border-line py-16 md:py-28">
      <div
        class="mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2 md:px-10"
      >
        <div>
          <span class="eyebrow" i18n="@@contact.eyebrow">Contacto</span>
          <h2 class="mb-10 text-3xl md:text-5xl" i18n="@@contact.title">
            ¿Tienes un proyecto en mente?
          </h2>
          <div class="flex flex-wrap gap-3">
            <a [href]="contacto" class="btn btn-primary" i18n="@@contact.email"
              >Escríbeme</a
            >
          </div>
        </div>
        <ks-contacto-terminal />
      </div>
    </section>
  `,
})
export class Home {
  protected readonly servicios = SERVICIOS;
  private readonly locale = toLocale(inject(LOCALE_ID));
  protected readonly empresas = `${slug('empresas', this.locale)}/`;
  protected readonly sobreMi = `${slug('sobre-mi', this.locale)}/`;
  protected readonly contacto = `${slug('contacto', this.locale)}/?tema=proyecto`;
  protected readonly casos = [KOSHISOFTWARE, LIBRO].map((caso) => ({
    ...caso,
    url: `${slug('proyectos', this.locale)}/${caso.path}/`,
  }));

  constructor() {
    inject(Title).setTitle(
      $localize`:@@home.pageTitle:Koshisoftware · Desarrollo Angular y NestJS en Perú`,
    );
    inject(Meta).updateTag({
      name: 'description',
      content: $localize`:@@home.description:Koshisoftware desarrolla aplicaciones web con Angular y NestJS para empresas en Perú y el extranjero.`,
    });
  }
}

const SERVICIOS = [
  {
    titulo: $localize`:@@services.build.title:Construir`,
    texto: $localize`:@@services.build.text:Aplicaciones y APIs en TypeScript, rápidas y fáciles de mantener.`,
    puntos: [
      $localize`:@@services.build.angular:Aplicaciones Angular multilenguaje`,
      $localize`:@@services.build.nest:APIs y servicios con NestJS`,
      $localize`:@@services.build.team:Un desarrollador senior en tu equipo`,
    ],
  },
  {
    titulo: $localize`:@@services.improve.title:Mejorar`,
    texto: $localize`:@@services.improve.text:Tu código actual, más rápido, accesible y al día.`,
    puntos: [
      $localize`:@@services.improve.review:Code reviews`,
      $localize`:@@services.improve.upgrade:Upgrades de Angular`,
      $localize`:@@services.improve.rescue:Migración de AngularJS y proyectos abandonados`,
      $localize`:@@services.improve.lighthouse:Lighthouse y SEO con SSR`,
      $localize`:@@services.improve.a11y:Accesibilidad y UX`,
    ],
  },
  {
    titulo: $localize`:@@services.ship.title:Entregar`,
    texto: $localize`:@@services.ship.text:Herramientas y procesos que escalan con tu equipo.`,
    puntos: [
      $localize`:@@services.ship.nx:Monorepos con Nx`,
      $localize`:@@services.ship.ci:Pipelines de CI/CD`,
      $localize`:@@services.ship.tests:Tests con Vitest y Playwright`,
    ],
  },
  {
    titulo: $localize`:@@services.teach.title:Enseñar`,
    texto: $localize`:@@services.teach.text:Tu equipo aprende haciendo, en línea.`,
    puntos: [
      $localize`:@@services.teach.workshops:Talleres de Angular, NestJS y Nx`,
      $localize`:@@services.teach.mentoring:Mentoría y pair programming`,
    ],
  },
];
