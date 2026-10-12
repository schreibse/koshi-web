import {
  ChangeDetectionStrategy,
  Component,
  LOCALE_ID,
  inject,
} from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { slug, toLocale } from '@koshi/shared/locale/util';

// The example client in the hero's browser window; deliberately the same text on both locale builds.
const EJEMPLO = [
  {
    lang: 'es',
    nav: ['Habitaciones', 'Barranco', 'Contacto'],
    titulo: 'Tu casa frente al mar en Lima',
    texto:
      'Habitaciones con vista, desayuno peruano y el malecón a dos cuadras.',
    cta: 'Reservar',
  },
  {
    lang: 'en',
    nav: ['Rooms', 'Barranco', 'Contact'],
    titulo: 'Your home by the sea in Lima',
    texto:
      'Rooms with a view, Peruvian breakfast and the boardwalk two blocks away.',
    cta: 'Book now',
  },
];

const OFERTAS = [
  {
    titulo: $localize`:@@empresas.web.title:Web multilingüe`,
    texto: $localize`:@@empresas.web.text:Tu sitio WordPress en español e inglés, rápido en el celular y fácil de encontrar.`,
    puntos: [
      $localize`:@@empresas.web.design:Diseño a medida y responsivo`,
      $localize`:@@empresas.web.languages:Español e inglés, cada uno con su URL`,
      $localize`:@@empresas.web.seo:Optimizada para Google y Lighthouse`,
    ],
  },
  {
    titulo: $localize`:@@empresas.care.title:Mantenimiento`,
    texto: $localize`:@@empresas.care.text:Tu web siempre al día, sin que tengas que pensar en ella.`,
    puntos: [
      $localize`:@@empresas.care.updates:Actualizaciones de WordPress y plugins`,
      $localize`:@@empresas.care.backups:Copias de seguridad`,
      $localize`:@@empresas.care.hosting:Hosting, dominio y correo`,
    ],
  },
  {
    titulo: $localize`:@@empresas.legal.title:En regla`,
    texto: $localize`:@@empresas.legal.text:Lo que la ley peruana pide a tu web.`,
    puntos: [
      $localize`:@@empresas.legal.libro:Libro de Reclamaciones virtual`,
      $localize`:@@empresas.legal.privacy:Política de privacidad (Ley 29733)`,
      $localize`:@@empresas.legal.cookies:Aviso de cookies`,
    ],
  },
  {
    titulo: $localize`:@@empresas.sunat.title:Facturación electrónica`,
    texto: $localize`:@@empresas.sunat.text:Tu web o tienda conectada a la facturación electrónica de SUNAT.`,
    puntos: [
      $localize`:@@empresas.sunat.receipts:Boletas y facturas desde tu web`,
      $localize`:@@empresas.sunat.provider:Integración con tu proveedor (OSE o PSE)`,
    ],
  },
];

const MAIL = `mailto:hola@koshisoftware.pe?subject=${encodeURIComponent($localize`:@@empresas.mailSubject:Web para mi empresa`)}`;

/** The offer for small businesses: multilingual WordPress sites, kept up to date and compliant. */
@Component({
  selector: 'ks-empresas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .idiomas {
      display: grid;
    }
    .idiomas > * {
      grid-area: 1 / 1;
    }
    .idiomas > :first-child {
      animation: es 7s infinite;
    }
    .idiomas > :last-child {
      animation: en 7s infinite;
    }
    @keyframes es {
      0%,
      42%,
      100% {
        opacity: 1;
      }
      50%,
      92% {
        opacity: 0;
      }
    }
    @keyframes en {
      0%,
      42%,
      100% {
        opacity: 0;
      }
      50%,
      92% {
        opacity: 1;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .idiomas > :first-child,
      .idiomas > :last-child {
        animation: none;
      }
      .idiomas > :last-child {
        opacity: 0;
      }
    }
  `,
  template: `
    <section class="overflow-x-clip">
      <div
        class="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-14 px-4 py-20 md:px-10 md:py-28 lg:grid-cols-2"
      >
        <div>
          <span class="eyebrow" i18n="@@empresas.eyebrow">Para empresas</span>
          <h1
            class="max-w-[11em] text-5xl md:text-6xl"
            i18n="@@empresas.hero.title"
          >
            Tu web en español e inglés, lista para vender
          </h1>
          <p
            class="mt-6 max-w-xl text-xl text-muted"
            i18n="@@empresas.hero.lead"
          >
            Sitios WordPress rápidos y responsivos para empresas en Perú:
            mantenidos, seguros y en regla.
          </p>
          <div class="mt-10 flex flex-wrap gap-3">
            <a [href]="mail" class="btn btn-primary" i18n="@@empresas.hero.cta"
              >Cotiza tu web →</a
            >
            <a [href]="incluye" class="btn" i18n="@@empresas.hero.more"
              >Qué incluye</a
            >
          </div>
        </div>
        <div
          class="idiomas"
          role="img"
          i18n-aria-label="@@empresas.hero.example"
          aria-label="Ejemplo: la misma web en español y en inglés"
        >
          @for (sitio of ejemplo; track sitio.lang) {
            <div
              aria-hidden="true"
              class="rounded-xl overflow-hidden bg-surface shadow-[var(--ks-window-shadow)]"
            >
              <div
                class="flex items-center gap-1.5 border-b border-line px-3 py-2.5"
              >
                <span class="size-2 rounded-full bg-line"></span>
                <span class="size-2 rounded-full bg-line"></span>
                <span class="size-2 rounded-full bg-line"></span>
                <span
                  class="rounded-md ml-2 flex-1 truncate bg-page px-2.5 py-1 font-mono text-xs text-muted"
                  >hostalbarranco.pe/{{ sitio.lang }}/</span
                >
              </div>
              <div class="bg-page px-5 pt-4 pb-6">
                <div class="mb-6 flex items-center gap-4 text-xs text-muted">
                  <b class="text-sm text-ink">Hostal Barranco</b>
                  <span class="flex-1"></span>
                  @for (item of sitio.nav; track item) {
                    <span class="hidden sm:inline">{{ item }}</span>
                  }
                  <span
                    class="inline-flex overflow-hidden rounded-full border border-line text-[0.7rem] font-bold"
                  >
                    @for (l of ['es', 'en']; track l) {
                      <span
                        class="px-2 py-0.5"
                        [class]="
                          l === sitio.lang
                            ? 'bg-accent text-on-accent'
                            : 'text-muted'
                        "
                        >{{ l.toUpperCase() }}</span
                      >
                    }
                  </span>
                </div>
                <div
                  class="rounded-lg mb-4 h-30 bg-[linear-gradient(135deg,var(--ks-tint-strong),var(--ks-window-backdrop)_60%,var(--ks-accent))]"
                ></div>
                <div class="mb-1.5 text-[1.35rem] leading-tight font-extrabold">
                  {{ sitio.titulo }}
                </div>
                <div class="mb-4 text-sm text-muted">{{ sitio.texto }}</div>
                <span
                  class="rounded-md inline-block bg-accent px-3 py-1.5 text-xs font-bold text-on-accent"
                  >{{ sitio.cta }}</span
                >
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <section id="incluye" class="border-t border-line py-16 md:py-28">
      <div class="mx-auto max-w-6xl px-4 md:px-10">
        <span class="eyebrow" i18n="@@empresas.offer.eyebrow">Qué incluye</span>
        <h2 class="mb-10 text-3xl md:text-5xl" i18n="@@empresas.offer.title">
          Todo lo que tu web necesita
        </h2>
        <ul class="m-0 grid list-none gap-6 p-0 md:grid-cols-2 lg:grid-cols-4">
          @for (oferta of ofertas; track oferta.titulo) {
            <li class="rounded-base bg-surface p-8">
              <h3 class="mb-2 text-[1.35rem]">{{ oferta.titulo }}</h3>
              <p class="mb-5 text-muted">{{ oferta.texto }}</p>
              <ul class="m-0 grid list-none gap-2 p-0 text-base">
                @for (punto of oferta.puntos; track punto) {
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

    <section class="border-t border-line bg-tint py-16 md:py-28">
      <div class="mx-auto max-w-6xl px-4 md:px-10">
        <span class="eyebrow" i18n="@@empresas.modes.eyebrow"
          >Cómo trabajamos</span
        >
        <h2 class="mb-10 text-3xl md:text-5xl" i18n="@@empresas.modes.title">
          Un proyecto o una cuota mensual
        </h2>
        <div class="grid gap-6 md:grid-cols-2">
          <div class="rounded-base bg-tint-strong p-8">
            <h3
              class="mb-2 text-[1.35rem]"
              i18n="@@empresas.modes.project.title"
            >
              Proyecto
            </h3>
            <p class="text-muted" i18n="@@empresas.modes.project.text">
              Conversamos, te envío una propuesta con precio cerrado y construyo
              tu web.
            </p>
          </div>
          <div class="rounded-base bg-tint-strong p-8">
            <h3
              class="mb-2 text-[1.35rem]"
              i18n="@@empresas.modes.monthly.title"
            >
              Soporte mensual
            </h3>
            <p class="text-muted" i18n="@@empresas.modes.monthly.text">
              Una cuota fija para mantenimiento, cambios pequeños y
              tranquilidad.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="border-t border-line py-16 md:py-28">
      <div class="mx-auto max-w-6xl px-4 md:px-10">
        <span class="eyebrow" i18n="@@empresas.contact.eyebrow">Contacto</span>
        <h2 class="mb-10 text-3xl md:text-5xl" i18n="@@empresas.contact.title">
          ¿Hablamos de tu web?
        </h2>
        <a [href]="mail" class="btn btn-primary" i18n="@@empresas.contact.cta"
          >Cotiza tu web →</a
        >
      </div>
    </section>
  `,
})
export class Empresas {
  protected readonly ejemplo = EJEMPLO;
  protected readonly ofertas = OFERTAS;
  protected readonly mail = MAIL;
  // <base href> would send a bare #incluye to the home page.
  protected readonly incluye = `${slug('empresas', toLocale(inject(LOCALE_ID)))}#incluye`;

  constructor() {
    inject(Meta).updateTag({
      name: 'description',
      content: $localize`:@@empresas.description:Webs WordPress en español e inglés para empresas en Perú: diseño, mantenimiento, Libro de Reclamaciones y facturación electrónica.`,
    });
  }
}
