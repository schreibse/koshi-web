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
    nav: ['Carta', 'Reservas', 'Contacto'],
    titulo: 'Ceviche fresco a pasos del mar',
    texto: 'Pescado del día, leche de tigre y vista a las olas.',
    cta: 'Reservar mesa',
  },
  {
    lang: 'en',
    nav: ['Menu', 'Reservations', 'Contact'],
    titulo: 'Fresh ceviche steps from the sea',
    texto: 'Catch of the day, leche de tigre and a view of the waves.',
    cta: 'Book a table',
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

/** The offer for small businesses: multilingual WordPress sites, kept up to date, with their legal pages. */
@Component({
  selector: 'ks-empresas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .escena {
      --sc-sun: #dcc28c;
      --sc-hill: #3a3128;
      --sc-hill2: #4a3e31;
      --sc-sea: #1d4f4a;
      --sc-sea2: #2b7069;
      --sc-foam: #e6efe9;
      --sc-sand: #8c7652;
      --sc-rock: #2c2620;
      --sc-wood: #6b4f36;
      --sc-thatch: #b89a62;
      --sc-wall: #efe6d6;
      --sc-red: #d0644a;
    }
    :host-context([data-theme='light']) .escena {
      --sc-sun: #e7c873;
      --sc-hill: #cdb995;
      --sc-hill2: #bba47d;
      --sc-sea: #3f8a82;
      --sc-sea2: #5ea79e;
      --sc-foam: #ffffff;
      --sc-sand: #ead8ad;
      --sc-rock: #7d6a55;
      --sc-wood: #7a5a3c;
      --sc-thatch: #c9a96a;
      --sc-wall: #fbf7ef;
      --sc-red: #c4553c;
    }
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
              class="rounded-xl flex flex-col overflow-hidden bg-surface shadow-[var(--ks-window-shadow)]"
            >
              <div
                class="flex items-center gap-1.5 border-b border-line px-3 py-2.5"
              >
                <span class="size-2 rounded-full bg-line"></span>
                <span class="size-2 rounded-full bg-line"></span>
                <span class="size-2 rounded-full bg-line"></span>
                <span
                  class="rounded-md ml-2 flex-1 truncate bg-page px-2.5 py-1 font-mono text-xs text-muted"
                  >cevicherialaola.pe/{{ sitio.lang }}/</span
                >
              </div>
              <div class="flex-1 bg-page px-5 pt-4 pb-6">
                <div class="mb-6 flex items-center gap-4 text-xs text-muted">
                  <b class="text-sm text-ink">Cevichería La Ola</b>
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
                <!-- A beach cevichería on the coast south of Lima, in its own colors per theme (see .escena). -->
                <svg
                  class="escena rounded-lg mb-4 block h-34 w-full"
                  viewBox="0 0 400 140"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <rect class="fill-tint" width="400" height="140" />
                  <circle
                    class="fill-(--sc-sun)"
                    cx="292"
                    cy="40"
                    r="12"
                    opacity=".9"
                  />
                  <path
                    class="fill-(--sc-hill)"
                    d="M0 64 50 50 96 58 150 44 204 56 250 48 300 60 350 52 400 60V88H0Z"
                  />
                  <path
                    class="fill-(--sc-hill2)"
                    d="M0 76 70 66 130 74 210 64 290 72 400 68V88H0Z"
                  />
                  <path class="fill-(--sc-sea)" d="M0 84H400V140H0Z" />
                  <path
                    class="stroke-(--sc-sea2)"
                    d="M18 92h50M120 89h70M206 96h60M40 100h80M290 103h40"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                  <path
                    class="fill-(--sc-rock)"
                    d="M342 84 354 70 370 64 388 66 400 62V112H330Z"
                  />
                  <path
                    class="stroke-(--sc-foam)"
                    d="M334 104q8-4 14 0t14 0 14 0 14 0 10 0"
                    fill="none"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-opacity=".8"
                  />
                  <path
                    class="fill-(--sc-sand)"
                    d="M0 108Q120 98 250 106T400 110V140H0Z"
                  />
                  <path
                    class="stroke-(--sc-foam)"
                    d="M0 108Q120 98 250 106T400 110"
                    fill="none"
                    stroke-width="2"
                    stroke-opacity=".85"
                  />
                  <g transform="translate(0 -4)">
                    <rect
                      class="fill-(--sc-wall)"
                      x="66"
                      y="94"
                      width="104"
                      height="28"
                    />
                    <rect
                      class="fill-(--sc-sea)"
                      x="76"
                      y="98"
                      width="84"
                      height="12"
                      opacity=".55"
                    />
                    <rect
                      class="fill-(--sc-wood)"
                      x="72"
                      y="110"
                      width="92"
                      height="12"
                    />
                    <path
                      class="stroke-(--sc-red)"
                      d="M72 113h92"
                      stroke-width="2"
                    />
                    <path
                      class="fill-(--sc-thatch)"
                      d="M56 96 74 78H162L180 96Z"
                    />
                    <path
                      class="fill-(--sc-thatch)"
                      d="M56 96l4 4 4-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4 4-4"
                    />
                    <path
                      class="stroke-(--sc-wood)"
                      d="M76 84h84M70 90h96"
                      stroke-opacity=".35"
                      stroke-width="1.2"
                    />
                    <rect
                      class="fill-(--sc-wall)"
                      x="100"
                      y="68"
                      width="36"
                      height="10"
                      rx="1.5"
                    />
                    <path
                      class="stroke-(--sc-sea)"
                      d="M106 74q3-3 6 0t6 0 6 0 6 0"
                      fill="none"
                      stroke-width="1.6"
                      stroke-linecap="round"
                    />
                    <path
                      class="stroke-(--sc-wood)"
                      d="M66 94v28M170 94v28"
                      stroke-width="3"
                    />
                    <g>
                      <path
                        class="fill-(--sc-red)"
                        d="M188 104a16 7 0 0 1 32 0z"
                      />
                      <path
                        class="fill-(--sc-sun)"
                        d="M236 106a16 7 0 0 1 32 0z"
                      />
                    </g>
                    <g
                      class="stroke-(--sc-wood)"
                      stroke-width="2"
                      stroke-linecap="round"
                    >
                      <path d="M204 104v18M252 106v16" />
                      <path d="M194 116h20M242 117h20" />
                      <path d="M197 116v6M211 116v6M245 117v5M259 117v5" />
                    </g>
                    <path
                      class="stroke-(--sc-wood)"
                      d="M170 97q16 6 34 3t48 3"
                      fill="none"
                      stroke-width=".8"
                    />
                    <g class="fill-(--sc-sun)">
                      <circle cx="176" cy="99.5" r="1.3" />
                      <circle cx="186" cy="101.5" r="1.3" />
                      <circle cx="196" cy="101" r="1.3" />
                      <circle cx="214" cy="99.6" r="1.3" />
                      <circle cx="226" cy="100.4" r="1.3" />
                      <circle cx="240" cy="101.6" r="1.3" />
                    </g>
                    <g class="fill-(--sc-wall)">
                      <ellipse cx="88" cy="110" rx="5" ry="1.6" />
                      <ellipse cx="106" cy="110" rx="5" ry="1.6" />
                      <ellipse cx="124" cy="110" rx="5" ry="1.6" />
                      <ellipse cx="142" cy="110" rx="5" ry="1.6" />
                    </g>
                    <g class="fill-(--sc-sun)">
                      <circle cx="87" cy="109" r="1.1" />
                      <circle cx="105" cy="109" r="1.1" />
                      <circle cx="123" cy="109" r="1.1" />
                      <circle cx="141" cy="109" r="1.1" />
                    </g>
                    <g class="fill-(--sc-red)">
                      <circle cx="89.5" cy="109.2" r=".8" />
                      <circle cx="107.5" cy="109.2" r=".8" />
                      <circle cx="125.5" cy="109.2" r=".8" />
                      <circle cx="143.5" cy="109.2" r=".8" />
                    </g>
                    <g transform="translate(46 108)">
                      <path
                        class="stroke-(--sc-wood)"
                        d="M0 14 3 0h12l3 14"
                        fill="none"
                        stroke-width="1.4"
                      />
                      <rect
                        class="fill-(--sc-rock)"
                        x="2"
                        y="1"
                        width="14"
                        height="10"
                        rx="1"
                      />
                      <path
                        class="stroke-(--sc-wall)"
                        d="M5 4h8M5 6.5h6M5 9h7"
                        stroke-width="1"
                        stroke-linecap="round"
                      />
                    </g>
                    <g class="fill-(--sc-wall)">
                      <ellipse cx="200" cy="115.4" rx="3.2" ry="1" />
                      <ellipse cx="208" cy="115.4" rx="3.2" ry="1" />
                      <ellipse cx="254" cy="116.4" rx="3.2" ry="1" />
                    </g>
                  </g>
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
              >Escríbeme</a
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
  protected readonly mail = `${slug('contacto', toLocale(inject(LOCALE_ID)))}/?tema=proyecto`;
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
