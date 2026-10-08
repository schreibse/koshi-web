import { Component } from '@angular/core';

@Component({
  selector: 'ks-home',
  template: `
    <section class="hero container">
      <span class="eyebrow">Angular · NestJS · TypeScript</span>
      <h1 i18n="@@hero.title">Software <em>fuerte</em>, hecho en Perú.</h1>
      <p class="lead muted" i18n="@@hero.lead">
        Desarrollo frontend con Angular y backend con NestJS para empresas en
        Perú y el extranjero.
      </p>
      <div class="actions">
        <a href="#contacto" class="button button--primary" i18n="@@hero.cta"
          >Hablemos →</a
        >
        <a href="#proyectos" class="button" i18n="@@hero.work">Ver proyectos</a>
      </div>
    </section>

    <section id="servicios" class="section">
      <div class="container">
        <span class="eyebrow" i18n="@@services.eyebrow">Servicios</span>
        <h2 i18n="@@services.title">Lo que construyo</h2>
        <ul class="grid">
          <li>
            <h3 i18n="@@services.frontend.title">Frontend con Angular</h3>
            <p class="muted" i18n="@@services.frontend.text">
              Aplicaciones web rápidas, accesibles y fáciles de mantener.
            </p>
          </li>
          <li>
            <h3 i18n="@@services.backend.title">Backend con NestJS</h3>
            <p class="muted" i18n="@@services.backend.text">
              APIs y servicios en TypeScript, probados y documentados.
            </p>
          </li>
          <li>
            <h3 i18n="@@services.team.title">Refuerzo para tu equipo</h3>
            <p class="muted" i18n="@@services.team.text">
              Un desarrollador senior que se integra a tu equipo y proceso.
            </p>
          </li>
        </ul>
      </div>
    </section>

    <section id="proyectos" class="section">
      <div class="container">
        <span class="eyebrow" i18n="@@work.eyebrow">Proyectos</span>
        <h2 i18n="@@work.title">Trabajo reciente</h2>
        <ul class="grid grid--two">
          <li class="placeholder" i18n="@@work.placeholder">
            Caso de estudio próximamente.
          </li>
          <li class="placeholder" i18n="@@work.placeholder">
            Caso de estudio próximamente.
          </li>
        </ul>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <span class="eyebrow" i18n="@@process.eyebrow">Cómo trabajo</span>
        <h2 i18n="@@process.title">Tres pasos, sin sorpresas</h2>
        <ol class="grid steps">
          <li>
            <h3 i18n="@@process.talk.title">Conversamos</h3>
            <p class="muted" i18n="@@process.talk.text">
              Entiendo tu objetivo, tu equipo y tu plazo.
            </p>
          </li>
          <li>
            <h3 i18n="@@process.plan.title">Planificamos</h3>
            <p class="muted" i18n="@@process.plan.text">
              Alcance claro, entregas cortas y un precio acordado.
            </p>
          </li>
          <li>
            <h3 i18n="@@process.build.title">Construyo</h3>
            <p class="muted" i18n="@@process.build.text">
              Avances visibles cada semana, código que tu equipo puede mantener.
            </p>
          </li>
        </ol>
      </div>
    </section>

    <section id="nosotros" class="section">
      <div class="container about">
        <span class="eyebrow" i18n="@@about.eyebrow">Nosotros</span>
        <h2 i18n="@@about.title">Una persona, un compromiso</h2>
        <p class="muted" i18n="@@about.text">
          Koshisoftware es una empresa individual en Perú. Trabajas directamente
          con quien escribe el código, en tu zona horaria y en tu idioma.
        </p>
      </div>
    </section>

    <section id="contacto" class="section">
      <div class="container">
        <span class="eyebrow" i18n="@@contact.eyebrow">Contacto</span>
        <h2 i18n="@@contact.title">¿Tienes un proyecto en mente?</h2>
        <div class="actions">
          <a
            href="mailto:hola@koshisoftware.com"
            class="button button--primary"
            i18n="@@contact.email"
            >Escríbeme</a
          >
          <a href="https://wa.me/51000000000" class="button">WhatsApp</a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .hero {
      padding-block: clamp(5rem, 14vw, 9rem);
    }
    h1 {
      max-width: 14ch;
      font-size: clamp(2.75rem, 7vw, 5rem);
      em {
        font-style: normal;
        color: var(--accent);
      }
    }
    h2 {
      margin-bottom: 2.5rem;
      font-size: clamp(2rem, 4vw, 3rem);
    }
    h3 {
      margin-bottom: 0.5rem;
      font-size: 1.35rem;
    }
    .lead {
      max-width: 38rem;
      margin-top: 1.5rem;
      font-size: 1.3rem;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-top: 2.5rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
      gap: 1.5rem;
      margin: 0;
      padding: 0;
      list-style: none;
      li {
        padding: 2rem;
        border-radius: var(--radius);
        background: var(--surface);
      }
      &--two {
        grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
      }
    }
    .steps {
      counter-reset: step;
      li::before {
        counter-increment: step;
        content: '0' counter(step);
        display: block;
        margin-bottom: 1rem;
        color: var(--accent);
        font-weight: 800;
      }
    }
    .placeholder {
      display: grid;
      place-items: center;
      min-height: 14rem;
      color: var(--muted);
    }
    .about p {
      max-width: 40rem;
      font-size: 1.25rem;
    }
  `,
})
export class Home {}
