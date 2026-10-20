import {
  ChangeDetectionStrategy,
  Component,
  LOCALE_ID,
  inject,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { slug, toLocale } from '@koshi/shared/locale/util';

// The example client in the hero's browser window; deliberately the same text on both locale builds.
const EJEMPLO = [
  {
    lang: 'es',
    nav: ['Habitaciones', 'Tours', 'Contacto'],
    titulo: 'Tu casa a pasos de la Plaza de Armas',
    texto: 'Habitaciones con calefacción, mate de coca y tours a Machu Picchu.',
    cta: 'Reservar',
  },
  {
    lang: 'en',
    nav: ['Rooms', 'Tours', 'Contact'],
    titulo: 'Your home steps from the Plaza de Armas',
    texto: 'Heated rooms, coca tea and tours to Machu Picchu.',
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
    titulo: $localize`:@@empresas.legal.title:Páginas legales`,
    texto: $localize`:@@empresas.legal.text:Las preparamos e integramos en tu web.`,
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

/** The offer for small businesses: multilingual WordPress sites, kept up to date, with their legal pages. */
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
      /* A swap, not a fade: half-transparent text fails the contrast check. */
      animation: es 7s step-end infinite;
    }
    .idiomas > :last-child {
      animation: en 7s step-end infinite;
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
            mantenidos, seguros y con Libro de Reclamaciones virtual.
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
                  >hostalcusco.pe/{{ sitio.lang }}/</span
                >
              </div>
              <div class="bg-page px-5 pt-4 pb-6">
                <div class="mb-6 flex items-center gap-4 text-xs text-muted">
                  <b class="text-sm text-ink">Hostal Cusco</b>
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
                <!-- Cusco: the cathedral on the Plaza de Armas below the Andes, drawn in the site's tokens. -->
                <svg
                  class="rounded-lg mb-4 block h-34 w-full"
                  viewBox="0 0 400 140"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <rect width="400" height="140" class="fill-tint" />
                  <circle
                    cx="70"
                    cy="40"
                    r="13"
                    class="fill-accent"
                    opacity="0.8"
                  />
                  <path
                    d="M0 84 60 50 100 66 150 36 200 60 250 30 300 58 350 42 400 62V140H0Z"
                    class="fill-muted"
                    fill-opacity="0.32"
                  />
                  <path
                    d="M143 41 150 36 157 41 150 40ZM243 35 250 30 257 35 250 34Z"
                    fill="#f7f2ea"
                    opacity="0.9"
                  />
                  <g class="fill-muted" fill-opacity="0.75">
                    <path
                      d="M160 70h10v-12l5-6 5 6v12h40v-12l5-6 5 6v12h10v50h-80z"
                    />
                    <path d="M186 70 200 58 214 70z" />
                  </g>
                  <path
                    d="M195 120v-14a5 5 0 0 1 10 0v14z"
                    class="fill-ink"
                    opacity="0.55"
                  />
                  <g class="fill-surface">
                    <rect x="20" y="92" width="54" height="28" />
                    <rect x="82" y="88" width="62" height="32" />
                    <rect x="256" y="90" width="58" height="30" />
                    <rect x="322" y="94" width="64" height="26" />
                  </g>
                  <g class="fill-accent" opacity="0.75">
                    <path d="M16 94 47 82 78 94z" />
                    <path d="M78 90 113 78 148 90z" />
                    <path d="M252 92 285 80 318 92z" />
                    <path d="M318 96 354 84 390 96z" />
                  </g>
                  <g class="fill-ink" opacity="0.5">
                    <rect x="30" y="100" width="7" height="9" />
                    <rect x="56" y="100" width="7" height="9" />
                    <rect x="92" y="97" width="8" height="10" />
                    <rect x="124" y="97" width="8" height="10" />
                    <rect x="88" y="94" width="48" height="2" />
                    <rect x="268" y="98" width="7" height="10" />
                    <rect x="296" y="98" width="7" height="10" />
                    <rect x="334" y="102" width="7" height="9" />
                    <rect x="364" y="102" width="7" height="9" />
                  </g>
                  <rect
                    y="120"
                    width="400"
                    height="20"
                    class="fill-code-string"
                    fill-opacity="0.6"
                  />
                  <path
                    class="fill-ink"
                    opacity="0.85"
                    transform="translate(226 104) scale(0.5)"
                    d="M3 15C0 13 1 8 5 8C6 5 10 5 11 7C12 4 17 4 18 7C19 4 23 4 25 7C26 3 25-2 26-6C25-9 27-13 30-15C31-18 35-18 36-16C38-15 40-12 41-10C41.5-8 40-7 38.5-7C37.5-3 38 3 37.5 8C38.5 11 38 15 36 17L35.5 26 35 32H33V26L32.5 19H30.5L30 26 29.5 32H27.5V26L27 19.5H14L13.5 26 13 32H11V26L10.5 19.5H8.5L8 26 7.5 32H5.5V26L5 18C3.5 17.5 3 16.5 3 15ZM3 10C.5 9.5-1 12 1 14L3 13ZM30.5-15.5C29.5-19 30-21.5 31-22 32-20.5 32.2-18 32-16ZM33.2-16.8C33-20.5 33.8-23 34.8-23.2 35.6-21.5 35.4-19 34.8-16.6Z"
                  />
                  <path
                    d="M0 124H400"
                    class="stroke-ink"
                    stroke-opacity="0.15"
                  />
                </svg>
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

    <section class="cta-band py-16 md:py-28">
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
  protected readonly incluye = `${slug('empresas', toLocale(inject(LOCALE_ID)))}/#incluye`;

  constructor() {
    inject(Title).setTitle(
      $localize`:@@empresas.pageTitle:Webs para empresas en Perú · Koshisoftware`,
    );
    inject(Meta).updateTag({
      name: 'description',
      content: $localize`:@@empresas.description:Webs WordPress en español e inglés para empresas en Perú: diseño, mantenimiento, Libro de Reclamaciones y facturación electrónica.`,
    });
  }
}
