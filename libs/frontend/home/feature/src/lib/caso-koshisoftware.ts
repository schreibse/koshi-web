import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ProjectShot } from './project-shot';
import { SignalTraces } from './signal-traces';

/** What the home's teaser and the case page both show. */
export const KOSHISOFTWARE = {
  path: 'koshisoftware',
  titulo: 'koshisoftware.pe',
  host: 'koshisoftware.pe',
  image: 'img/koshisoftware',
  alt: $localize`:@@caso.ks.alt:Página de inicio de koshisoftware.pe`,
  categoria: $localize`:@@caso.ks.category:Web de empresa · Angular`,
  lead: $localize`:@@caso.ks.lead:Esta web: bilingüe, hecha en Angular y tan rápida como una página estática. 100 en las cuatro categorías de Lighthouse, en celular y computadora.`,
  tags: [
    'Angular 22',
    $localize`:@@caso.ks.tag.prerender:SSR + prerender`,
    $localize`:@@caso.ks.tag.hydration:Hidratación incremental`,
    'Cloudflare Pages',
    $localize`:@@caso.ks.tag.languages:Español + inglés`,
  ],
};

export const LIGHTHOUSE = [
  $localize`:@@caso.lighthouse.performance:Rendimiento`,
  $localize`:@@caso.lighthouse.a11y:Accesibilidad`,
  $localize`:@@caso.lighthouse.practices:Prácticas recomendadas`,
  'SEO',
];

/** Case study: this site, built for speed in two languages. */
@Component({
  selector: 'ks-caso-koshisoftware',
  imports: [ProjectShot, SignalTraces],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="mx-auto max-w-6xl px-4 py-16 md:px-10 md:py-20">
      <a
        href="./#proyectos"
        class="mb-8 inline-block text-muted"
        i18n="@@caso.back"
        >← Proyectos</a
      >
      <div
        class="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1fr)_18rem]"
      >
        <div>
          <span class="eyebrow" i18n="@@caso.eyebrow">Caso de estudio</span>
          <h1 class="text-4xl md:text-6xl">{{ caso.host }}</h1>
          <p class="mt-5 max-w-2xl text-xl text-muted">{{ caso.lead }}</p>

          <div class="relative isolate mt-10">
            <ks-signal-traces />
            <ks-project-shot
              [host]="caso.host"
              [image]="caso.image"
              [alt]="caso.alt"
              sizes="(min-width: 1024px) 820px, (min-width: 768px) calc(100vw - 5rem), calc(100vw - 2rem)"
              [priority]="true"
            />
          </div>

          <ul
            class="m-0 mt-10 grid list-none grid-cols-2 gap-6 rounded-base bg-surface p-6 sm:grid-cols-4"
            aria-label="Lighthouse"
          >
            @for (categoria of lighthouse; track categoria) {
              <li class="flex flex-col items-center gap-2 text-center">
                <span
                  class="grid size-16 place-items-center rounded-full border-[3px] border-[var(--ks-code-string)] text-lg font-bold text-[var(--ks-code-string)]"
                  >100</span
                >
                <span class="text-sm text-muted">{{ categoria }}</span>
              </li>
            }
          </ul>
          <p class="mt-3 text-sm text-muted" i18n="@@caso.ks.measured">
            Mediana de tres mediciones en producción, en celular y computadora,
            al 12/10/2026.
          </p>

          <div class="caso-texto max-w-2xl">
            <h2 i18n="@@caso.ks.challenge.title">El reto</h2>
            <p i18n="@@caso.ks.challenge.text">
              Una aplicación Angular suele descargar y ejecutar todo su
              JavaScript antes de responder. Para una web de empresa eso cuesta
              visitas: Google mide la velocidad en el celular y la usa para
              ordenar sus resultados. La meta era la experiencia de una página
              estática, en español e inglés, sin renunciar a partes interactivas
              como el editor del inicio.
            </p>

            <h2 i18n="@@caso.ks.approach.title">El enfoque</h2>
            <ul>
              <li i18n="@@caso.ks.approach.prerender">
                Cada página se genera como HTML al compilar, una vez por idioma,
                y Cloudflare Pages la sirve tal cual.
              </li>
              <li i18n="@@caso.ks.approach.hydration">
                Hidratación incremental: cada sección carga su JavaScript recién
                cuando aparece en pantalla, y los clics que hiciste antes se
                atienden apenas carga.
              </li>
              <li i18n="@@caso.ks.approach.languages">
                Cada idioma tiene su propia URL, con canonical y hreflang, para
                que Google muestre la versión correcta.
              </li>
              <li i18n="@@caso.ks.approach.measure">
                Mido con Lighthouse en producción después de cada versión, no
                solo en mi computadora.
              </li>
            </ul>

            <h2 i18n="@@caso.ks.result.title">El resultado</h2>
            <p i18n="@@caso.ks.result.text">
              100 en rendimiento, accesibilidad, prácticas recomendadas y SEO,
              en celular y computadora, en las cuatro páginas públicas. La
              página de inicio descarga solo el JavaScript de lo que se ve; el
              resto llega a medida que bajas.
            </p>

            <h2 i18n="@@caso.ks.setbacks.title">Dos tropiezos en el camino</h2>
            <ul>
              <li i18n="@@caso.ks.setbacks.font">
                Una fuente de respaldo mejor ajustada hizo que el navegador
                midiera el titular dos veces: el rendimiento en celular cayó de
                100 a 86. Regresé a la forma anterior de cargar la fuente y fijé
                el ancho del titular.
              </li>
              <li i18n="@@caso.ks.setbacks.contrast">
                El ejemplo de la página para empresas cambiaba de idioma con una
                transición suave. En los cuadros intermedios el texto quedaba
                semitransparente y Lighthouse marcó contraste insuficiente.
                Ahora cambia de golpe.
              </li>
            </ul>
          </div>
        </div>

        <aside
          class="grid content-start gap-5 self-start rounded-base bg-surface p-6 lg:sticky lg:top-24"
        >
          <dl class="m-0 grid gap-5">
            <div>
              <dt class="eyebrow mb-1 text-muted" i18n="@@caso.client">
                Cliente
              </dt>
              <dd class="m-0 font-semibold" i18n="@@caso.ks.client">
                Koshisoftware (esta web)
              </dd>
            </div>
            <div>
              <dt class="eyebrow mb-1 text-muted" i18n="@@caso.year">Año</dt>
              <dd class="m-0 font-semibold">2026</dd>
            </div>
            <div>
              <dt class="eyebrow mb-1 text-muted" i18n="@@caso.role">Rol</dt>
              <dd class="m-0 font-semibold" i18n="@@caso.ks.role">
                Diseño, desarrollo y despliegue
              </dd>
            </div>
          </dl>
          <ul class="m-0 flex list-none flex-wrap gap-2 p-0">
            @for (tag of caso.tags; track tag) {
              <li
                class="rounded-full bg-tint px-2.5 py-0.5 text-sm font-semibold"
              >
                {{ tag }}
              </li>
            }
          </ul>
          <a
            href="https://github.com/schreibse/koshi-web"
            target="_blank"
            rel="noopener"
            class="btn text-center"
            ><ng-container i18n="@@caso.code">Ver el código</ng-container>
            <span class="sr-only" i18n="@@stack.newTab"
              >(se abre en una pestaña nueva)</span
            ></a
          >
        </aside>
      </div>
    </article>
  `,
  styles: `
    .caso-texto h2 {
      margin: 3rem 0 1rem;
      font-size: 1.875rem;
    }
    .caso-texto p,
    .caso-texto li {
      color: var(--ks-muted);
      font-size: 1.125rem;
    }
    .caso-texto ul {
      display: grid;
      gap: 0.75rem;
      padding-left: 1.25rem;
    }
  `,
})
export class CasoKoshisoftware {
  protected readonly caso = KOSHISOFTWARE;
  protected readonly lighthouse = LIGHTHOUSE;

  constructor() {
    inject(Title).setTitle(
      $localize`:@@caso.ks.pageTitle:Caso de estudio: koshisoftware.pe · Koshisoftware`,
    );
    const meta = inject(Meta);
    meta.updateTag({
      property: 'og:image',
      content: 'img/og-koshisoftware.jpg',
    });
    meta.updateTag({
      name: 'description',
      content: $localize`:@@caso.ks.description:Caso de estudio: cómo koshisoftware.pe llegó a 100 en Lighthouse con Angular, HTML pregenerado e hidratación incremental, en español e inglés.`,
    });
  }
}
