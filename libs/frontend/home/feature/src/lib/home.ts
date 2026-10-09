import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { HeroEditor } from './hero-editor';

@Component({
  selector: 'ks-home',
  imports: [HeroEditor],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="overflow-x-clip">
      <div
        class="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-14 px-4 py-20 md:px-10 md:py-28 lg:grid-cols-2"
      >
        <div>
          <span class="eyebrow">Angular · NestJS · TypeScript</span>
          <h1
            class="max-w-[14ch] text-5xl md:text-7xl lg:text-6xl"
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

    <section id="servicios" class="border-t border-line py-16 md:py-28">
      <div class="mx-auto max-w-6xl px-4 md:px-10">
        <span class="eyebrow" i18n="@@services.eyebrow">Servicios</span>
        <h2 class="mb-10 text-3xl md:text-5xl" i18n="@@services.title">
          Lo que construyo
        </h2>
        <ul class="m-0 grid list-none gap-6 p-0 md:grid-cols-3">
          <li class="rounded-base bg-surface p-8">
            <h3 class="mb-2 text-[1.35rem]" i18n="@@services.frontend.title">
              Frontend con Angular
            </h3>
            <p class="text-muted" i18n="@@services.frontend.text">
              Aplicaciones web rápidas, accesibles y fáciles de mantener.
            </p>
          </li>
          <li class="rounded-base bg-surface p-8">
            <h3 class="mb-2 text-[1.35rem]" i18n="@@services.backend.title">
              Backend con NestJS
            </h3>
            <p class="text-muted" i18n="@@services.backend.text">
              APIs y servicios en TypeScript, probados y documentados.
            </p>
          </li>
          <li class="rounded-base bg-surface p-8">
            <h3 class="mb-2 text-[1.35rem]" i18n="@@services.team.title">
              Refuerzo para tu equipo
            </h3>
            <p class="text-muted" i18n="@@services.team.text">
              Un desarrollador senior que se integra a tu equipo y proceso.
            </p>
          </li>
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

    <section class="border-t border-line py-16 md:py-28">
      <div class="mx-auto max-w-6xl px-4 md:px-10">
        <span class="eyebrow" i18n="@@process.eyebrow">Cómo trabajo</span>
        <h2 class="mb-10 text-3xl md:text-5xl" i18n="@@process.title">
          Tres pasos, sin sorpresas
        </h2>
        <ol class="m-0 grid list-none gap-6 p-0 md:grid-cols-3">
          <li class="rounded-base bg-surface p-8">
            <span class="mb-4 block font-extrabold text-accent">01</span>
            <h3 class="mb-2 text-[1.35rem]" i18n="@@process.talk.title">
              Conversamos
            </h3>
            <p class="text-muted" i18n="@@process.talk.text">
              Entiendo tu objetivo, tu equipo y tu plazo.
            </p>
          </li>
          <li class="rounded-base bg-surface p-8">
            <span class="mb-4 block font-extrabold text-accent">02</span>
            <h3 class="mb-2 text-[1.35rem]" i18n="@@process.plan.title">
              Planificamos
            </h3>
            <p class="text-muted" i18n="@@process.plan.text">
              Alcance claro, entregas cortas y un precio acordado.
            </p>
          </li>
          <li class="rounded-base bg-surface p-8">
            <span class="mb-4 block font-extrabold text-accent">03</span>
            <h3 class="mb-2 text-[1.35rem]" i18n="@@process.build.title">
              Construyo
            </h3>
            <p class="text-muted" i18n="@@process.build.text">
              Avances visibles cada semana, código que tu equipo puede mantener.
            </p>
          </li>
        </ol>
      </div>
    </section>

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
            href="mailto:hola@koshisoftware.com"
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
  constructor() {
    inject(Meta).updateTag({
      name: 'description',
      content: $localize`:@@home.description:Koshisoftware desarrolla aplicaciones web con Angular y NestJS para empresas en Perú y el extranjero.`,
    });
  }
}
