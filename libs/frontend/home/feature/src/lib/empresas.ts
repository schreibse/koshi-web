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
      $localize`:@@empresas.web.design:Diseño adaptado a tu marca, pensado para el celular`,
      $localize`:@@empresas.web.languages:Español e inglés, cada uno con su URL`,
      $localize`:@@empresas.web.seo:Hecha para que Google la encuentre`,
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

const PREGUNTAS = [
  {
    pregunta: $localize`:@@empresas.faq.time.q:¿Cuánto demora hacer mi web?`,
    respuesta: $localize`:@@empresas.faq.time.a:Depende de lo que necesite tu web. Una web basada en un diseño ya hecho, que adapto a tu marca, está lista en menos tiempo; un diseño desde cero, o extras como reservas en línea, toman más. También influye la cantidad de páginas e idiomas. Tu cotización incluye una fecha de entrega estimada, contada desde el día en que recibo tus textos y fotos.`,
  },
  {
    pregunta: $localize`:@@empresas.faq.content.q:¿Qué necesito enviarte?`,
    respuesta: $localize`:@@empresas.faq.content.a:Tu logo, tus fotos y los textos de cada página. No te preocupes si no sabes qué escribir: te doy una lista de lo que necesita cada página. Si solo tienes los textos en español, también puedo escribir la versión en inglés; en ese caso la incluyo en tu cotización como un ítem separado.`,
  },
  {
    pregunta: $localize`:@@empresas.faq.edit.q:¿Puedo hacer cambios en mi web por mi cuenta?`,
    respuesta: $localize`:@@empresas.faq.edit.a:Sí. La web es tuya, así que tienes acceso completo. Cambiar textos y fotos o publicar noticias, en ambos idiomas, es sencillo una vez que lo ves, y te enseño cómo hacerlo cuando te entrego la web. Para cambios más grandes, como agregar una sección nueva o una función nueva, lo mejor es que me consultes primero, para que nada deje de funcionar por accidente. Con gusto me encargo de esos cambios como un trabajo aparte, o dentro del soporte mensual si cuentas con él.`,
  },
  {
    pregunta: $localize`:@@empresas.faq.owner.q:¿De quién es mi web?`,
    respuesta: $localize`:@@empresas.faq.owner.a:Tuya. Toda web necesita un dominio, que es tu dirección en internet (como tuempresa.pe), y un hosting, el servicio que la mantiene en línea. Algunas también necesitan un diseño o funciones adicionales que tienen costo. Todo eso lo compras tú, a tu nombre: esos pagos van directo a cada proveedor, no a KOSHISOFTWARE, y no forman parte de mi cotización. El dominio y el hosting los pagas de nuevo cada año. Yo te ayudo a elegirlos y configuro todo. Como todo está a tu nombre, nunca dependes de mí: si algún día quieres trabajar con otra persona, tu web se va contigo.`,
  },
  {
    pregunta: $localize`:@@empresas.faq.google.q:¿Mi web va a aparecer en Google?`,
    respuesta: $localize`:@@empresas.faq.google.a:La construyo para que Google pueda encontrarla y entenderla: está hecha para cargar rápido, está bien organizada y las páginas en español y en inglés tienen cada una su propia dirección. Además, la conecto a tu propia cuenta en la herramienta gratuita de Google para dueños de sitios web, para que veas cómo te encuentra la gente. Nadie puede prometerte con honestidad los primeros lugares en Google. Conseguir más visitas con el tiempo requiere un trabajo constante, y con gusto te acompaño en eso como un servicio aparte.`,
  },
  {
    pregunta: $localize`:@@empresas.faq.fixes.q:¿Y si algo falla después de publicar mi web?`,
    respuesta: $localize`:@@empresas.faq.fixes.a:Si algo que hice no funciona como lo acordamos, lo arreglo sin costo durante los primeros 30 días desde que se publica la web. Los problemas del servicio de hosting, o los que vengan de cambios hechos después de la publicación, no están incluidos, pero con gusto también te ayudo con ellos. Pasados esos 30 días, los arreglos están incluidos si tienes soporte mensual; si no, me encargo de ellos como un trabajo aparte.`,
  },
  {
    pregunta: $localize`:@@empresas.faq.existing.q:Ya tengo una web. ¿La puedes mejorar?`,
    respuesta: $localize`:@@empresas.faq.existing.a:Sí. Primero la reviso: qué tan rápido carga, cómo se ve en el celular, si se mantiene al día con sus actualizaciones y cómo maneja los idiomas. Luego te digo con honestidad si vale la pena mejorarla o si conviene empezar de nuevo.`,
  },
  {
    pregunta: $localize`:@@empresas.faq.payment.q:¿Cómo es el pago?`,
    respuesta: $localize`:@@empresas.faq.payment.a:Lo acordamos juntos y queda por escrito en tu cotización antes de empezar a trabajar, para que no haya sorpresas. La cotización cubre solo mi trabajo; el dominio, el hosting y cualquier otra cosa que compres se los pagas directamente a cada proveedor.`,
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
            Sitios WordPress rápidos en el celular para empresas en Perú: con tu
            Libro de Reclamaciones virtual y, si quieres, al día con sus
            actualizaciones.
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
              Conversamos, te envío una cotización con lo que incluye y el
              precio, y construyo tu web.
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

    <section id="preguntas" class="border-t border-line py-16 md:py-28">
      <div
        class="mx-auto grid max-w-6xl items-start gap-10 px-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] md:gap-16 md:px-10"
      >
        <div class="md:sticky md:top-24">
          <span class="eyebrow" i18n="@@empresas.faq.eyebrow"
            >Preguntas frecuentes</span
          >
          <h2 class="text-3xl md:text-5xl" i18n="@@empresas.faq.title">
            Antes de empezar
          </h2>
          <p class="mt-6 text-muted">
            <span i18n="@@empresas.faq.other">¿Tienes otra pregunta?</span>
            <br />
            <a
              [href]="mail"
              class="font-semibold text-accent underline"
              i18n="@@empresas.faq.write"
              >Escríbeme a hola&#64;koshisoftware.pe</a
            >
          </p>
        </div>
        <div class="border-b border-line">
          @for (item of preguntas; track item.pregunta; let primera = $first) {
            <details
              class="group border-t border-line"
              [attr.open]="primera ? '' : null"
            >
              <summary
                class="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-lg font-semibold [&::-webkit-details-marker]:hidden"
              >
                {{ item.pregunta }}
                <svg
                  aria-hidden="true"
                  class="size-5 flex-none stroke-muted group-open:rotate-180"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <p class="pb-6 text-muted md:pr-10">{{ item.respuesta }}</p>
            </details>
          }
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
  protected readonly preguntas = PREGUNTAS;
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
