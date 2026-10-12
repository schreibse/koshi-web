import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { HeroEditor } from './hero-editor';
import { ProcessPipeline } from './process-pipeline';
import { TechStack } from './tech-stack';

@Component({
  selector: 'ks-home',
  imports: [HeroEditor, ProcessPipeline, TechStack],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="overflow-x-clip">
      <div
        class="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-14 px-4 py-20 md:px-10 md:py-28 lg:grid-cols-2"
      >
        <div>
          <span class="eyebrow">Angular · NestJS · TypeScript</span>
          <h1
            class="max-w-[8.5em] text-5xl md:text-7xl lg:text-6xl"
            i18n="@@hero.title"
          >
            Software <em class="text-accent not-italic">fuerte</em>, hecho en
            Perú.
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

    <section id="servicios" class="border-t border-line py-16 md:py-28">
      <div class="mx-auto max-w-6xl px-4 md:px-10">
        <span class="eyebrow" i18n="@@services.eyebrow">Servicios</span>
        <h2 class="mb-10 text-3xl md:text-5xl" i18n="@@services.title">
          Lo que hago
        </h2>
        <ul class="m-0 grid list-none gap-6 p-0 md:grid-cols-2 lg:grid-cols-4">
          @for (servicio of servicios; track servicio.titulo) {
            <li class="rounded-base bg-surface p-8">
              <h3 class="mb-2 text-[1.35rem]">{{ servicio.titulo }}</h3>
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
      </div>
    </section>

    <section id="proyectos" class="border-t border-line py-16 md:py-28">
      <div class="mx-auto max-w-6xl px-4 md:px-10">
        <span class="eyebrow" i18n="@@work.eyebrow">Proyectos</span>
        <h2 class="mb-10 text-3xl md:text-5xl" i18n="@@work.title">
          Trabajo reciente
        </h2>
        <ul class="m-0 grid list-none gap-6 p-0 md:grid-cols-2">
          <li
            class="grid min-h-56 place-items-center rounded-base bg-surface p-8 text-muted"
            i18n="@@work.placeholder"
          >
            Caso de estudio próximamente.
          </li>
          <li
            class="grid min-h-56 place-items-center rounded-base bg-surface p-8 text-muted"
            i18n="@@work.placeholder"
          >
            Caso de estudio próximamente.
          </li>
        </ul>
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
        <p class="max-w-2xl text-xl text-muted" i18n="@@about.text">
          Koshisoftware es una empresa individual en Perú. Trabajas directamente
          con quien escribe el código, en tu zona horaria y en tu idioma.
        </p>
      </div>
    </section>

    <section id="contacto" class="border-t border-line py-16 md:py-28">
      <div class="mx-auto max-w-6xl px-4 md:px-10">
        <span class="eyebrow" i18n="@@contact.eyebrow">Contacto</span>
        <h2 class="mb-10 text-3xl md:text-5xl" i18n="@@contact.title">
          ¿Tienes un proyecto en mente?
        </h2>
        <div class="flex flex-wrap gap-3">
          <a
            href="mailto:hola@koshisoftware.pe"
            class="btn btn-primary"
            i18n="@@contact.email"
            >Escríbeme</a
          >
          <a href="https://wa.me/51000000000" class="btn">WhatsApp</a>
        </div>
      </div>
    </section>
  `,
})
export class Home {
  protected readonly servicios = SERVICIOS;

  constructor() {
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
