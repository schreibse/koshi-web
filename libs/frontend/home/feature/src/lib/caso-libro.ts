import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { LIGHTHOUSE } from './caso-koshisoftware';
import { ProjectShot } from './project-shot';

/** What the home's teaser and the case page both show. */
export const LIBRO = {
  path: 'libro-de-reclamaciones',
  titulo: $localize`:@@caso.libro.title:Libro de Reclamaciones virtual`,
  host: 'koshisoftware.pe/es/libro-de-reclamaciones',
  image: 'img/libro',
  alt: $localize`:@@caso.libro.alt:Formulario de la hoja de reclamación en koshisoftware.pe`,
  categoria: $localize`:@@caso.libro.category:Formulario legal · Cloudflare`,
  lead: $localize`:@@caso.libro.lead:Nuestro propio Libro de Reclamaciones en la web: cada hoja con su número, copia inmediata al correo de quien reclama y un respaldo cada semana. Sin costo mensual adicional.`,
  tags: ['Angular', 'Cloudflare D1', 'Turnstile', 'Sweego', 'Ley 29733'],
};

// The texts quoted on the page, numbered in order of first citation; titles stay in Spanish, as published.
const FUENTES = [
  {
    cita: 'Presidencia del Consejo de Ministros. Decreto Supremo N.° 006-2014-PCM, «Decreto Supremo que modifica el Reglamento del Libro de Reclamaciones del Código de Protección y Defensa del Consumidor aprobado por Decreto Supremo Nº 011-2011-PCM». Diario Oficial El Peruano, 23 de enero de 2014.',
    url: 'https://busquedas.elperuano.pe/dispositivo/NL/1041477-1',
  },
  {
    cita: 'Presidencia del Consejo de Ministros. Decreto Supremo N.° 101-2022-PCM, «Decreto Supremo que modifica el Reglamento del Libro de Reclamaciones del Código de Protección y Defensa del Consumidor, aprobado por Decreto Supremo N° 011-2011-PCM». Diario Oficial El Peruano, 16 de agosto de 2022.',
    url: 'https://busquedas.elperuano.pe/dispositivo/NL/2095978-1',
  },
  {
    cita: 'Autoridad Nacional de Protección de Datos Personales (MINJUSDH). Ley N.° 29733, «Ley de Protección de Datos Personales», texto con las modificaciones del Decreto Legislativo N.° 1353 (Diario Oficial El Peruano, 7 de enero de 2017).',
    url: 'https://cdn.www.gob.pe/uploads/document/file/2011398/Ley%20N%C2%BA%2029733%20-%20Ley%20de%20protecci%C3%B3n%20de%20datos%20personales.pdf.pdf?v=1683928275',
  },
  {
    cita: 'Ministerio de Justicia y Derechos Humanos. Decreto Supremo N.° 016-2024-JUS, «Decreto Supremo que aprueba el Reglamento de la Ley N° 29733, Ley de Protección de Datos Personales». Diario Oficial El Peruano (separata), 30 de noviembre de 2024.',
    url: 'https://busquedas.elperuano.pe/dispositivo/SE/2349653-1',
  },
  {
    cita: 'Presidencia del Consejo de Ministros. Decreto Supremo N.° 101-2022-PCM, Anexo I «Formato de Hoja de Reclamaciones del Libro de Reclamaciones». Diario Oficial El Peruano, 16 de agosto de 2022.',
    url: 'https://cdn.www.gob.pe/uploads/document/file/3510113/Anexo%20I%20DS%20N%20101-2022-PCM_.pdf.pdf?v=1660688658',
  },
  {
    cita: 'Autoridad Nacional de Protección de Datos Personales. «Inscribir banco de datos en el Registro Nacional de Protección de Datos Personales». gob.pe.',
    url: 'https://www.gob.pe/8060-inscribir-banco-de-datos-en-el-registro-nacional-de-proteccion-de-datos-personales',
  },
  {
    cita: 'Autoridad Nacional de Protección de Datos Personales. «Inscribir flujo transfronterizo de datos personales». gob.pe.',
    url: 'https://www.gob.pe/9253-inscribir-flujo-transfronterizo-de-datos-personales',
  },
  {
    cita: 'Presidencia del Consejo de Ministros. Resolución Ministerial N.° 244-2026-PCM, «Disponen la publicación de proyecto de Decreto Supremo que modifica el Reglamento del Libro de Reclamaciones del Código de Protección y Defensa del Consumidor, aprobado por D.S. N° 011-2011-PCM, y su Exposición de Motivos». Diario Oficial El Peruano, 18 de julio de 2026.',
    url: 'https://busquedas.elperuano.pe/dispositivo/NL/2536260-1',
  },
];

/** Case study: the site's own Libro de Reclamaciones, with its legal sources. */
@Component({
  selector: 'ks-caso-libro',
  imports: [ProjectShot],
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
          <h1 class="text-4xl md:text-6xl">{{ caso.titulo }}</h1>
          <p class="mt-5 max-w-2xl text-xl text-muted">{{ caso.lead }}</p>
          <p
            class="mt-4 max-w-2xl text-sm text-muted"
            i18n="@@caso.libro.reviewed"
          >
            Información revisada al 19 de octubre de 2026. Es un caso de
            estudio, no asesoría legal (ver el <a href="#aviso">aviso</a>).
          </p>
          <ks-project-shot
            class="mt-10"
            [host]="caso.host"
            [image]="caso.image"
            [alt]="caso.alt"
            sizes="(min-width: 1024px) 820px, (min-width: 768px) calc(100vw - 5rem), calc(100vw - 2rem)"
            [priority]="true"
          />
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
          <p class="mt-3 text-sm text-muted" i18n="@@caso.libro.measured">
            Mediana de tres mediciones en producción del formulario, en celular
            y computadora, al 19/10/2026.
          </p>
          <div class="caso-texto max-w-2xl">
            <h2 i18n="@@caso.ks.challenge.title">El reto</h2>
            <p i18n="@@caso.libro.challenge">
              Nuestra web es el canal donde iniciamos la relación con nuestros
              clientes, así que quisimos un Libro de Reclamaciones virtual
              propio, en lugar de un PDF o un formulario genérico. Nos pusimos
              tres condiciones: seguir el formato y los pasos del Reglamento del
              Libro de Reclamaciones <a href="#fuente-1">[1]</a
              ><a href="#fuente-2">[2]</a>, tratar los datos conforme a la Ley
              N.º 29733 y su Reglamento <a href="#fuente-3">[3]</a
              ><a href="#fuente-4">[4]</a>, y no sumar costos mensuales.
            </p>
            <h2 i18n="@@caso.ks.approach.title">El enfoque</h2>
            <ul>
              <li i18n="@@caso.libro.approach.form">
                <strong>La hoja del Anexo I.</strong> El formulario pide los
                datos del formato oficial de hoja de reclamación
                <a href="#fuente-5">[5]</a>, en español e inglés, y explica cada
                error junto al campo.
              </li>
              <li i18n="@@caso.libro.approach.number">
                <strong>Numeración correlativa.</strong> Cada hoja recibe su
                número al guardarse, por ejemplo Nº 000000001-2026. El Anexo I
                pide una «numeración correlativa impresa o que deberá aparecer
                por defecto» <a href="#fuente-5">[5]</a>.
              </li>
              <li i18n="@@caso.libro.approach.copy">
                <strong>Copia inmediata.</strong> Apenas se envía la hoja, se
                puede imprimir o guardar como PDF, y una copia llega al correo
                de quien reclama con la fecha y hora de presentación. El art.
                4-B del Reglamento dice: «se debe permitir la impresión de la
                Hoja de Reclamación y enviarse automáticamente al correo
                electrónico indicado por el consumidor, dejándose constancia de
                la fecha y hora de presentación» <a href="#fuente-1">[1]</a>.
              </li>
              <li i18n="@@caso.libro.approach.notice">
                <strong>El aviso, en todas las páginas.</strong> El ícono de
                libro con el texto «Libro de Reclamaciones» está en el pie de
                todas las páginas, incluida la de inicio, según el formato del
                Anexo III (art. 9) <a href="#fuente-1">[1]</a>.
              </li>
              <li i18n="@@caso.libro.approach.data">
                <strong>Datos personales.</strong> Antes de enviar, el
                formulario enlaza a su propia política de privacidad (Ley N.º
                29733, art. 18) <a href="#fuente-3">[3]</a>. Inscribimos el
                banco de datos «Quejas y reclamos» en el Registro Nacional de
                Protección de Datos Personales, con el código PJ-2026-5408 y los
                flujos transfronterizos declarados <a href="#fuente-6">[6]</a
                ><a href="#fuente-7">[7]</a>, y aprobamos un documento de
                seguridad con fecha cierta notarial (Reglamento de la Ley N.º
                29733, art. 47) <a href="#fuente-4">[4]</a>.
              </li>
              <li i18n="@@caso.libro.approach.bots">
                <strong>Sin acertijos.</strong> Cloudflare Turnstile filtra los
                envíos automatizados sin pedir que resuelvas imágenes, y un
                límite de envíos por dirección IP frena los abusos.
              </li>
              <li i18n="@@caso.libro.approach.backup">
                <strong>Respaldo y conservación.</strong> Cada semana se guarda
                una copia completa de la base en un almacenamiento aparte, con
                su suma de verificación SHA-256. Conservamos cada hoja dos años,
                el mínimo que fija el art. 12 del Reglamento («como mínimo por
                el lapso de dos (02) años desde la fecha de presentación»)
                <a href="#fuente-1">[1]</a>, y después la eliminamos.
              </li>
            </ul>
            <h2 i18n="@@caso.ks.result.title">El resultado</h2>
            <ul>
              <li i18n="@@caso.libro.result.lighthouse">
                100 en rendimiento, accesibilidad, prácticas recomendadas y SEO
                en el formulario, en celular y computadora.
              </li>
              <li i18n="@@caso.libro.result.cost">
                El Libro no suma costo mensual: funciona dentro de los planes
                gratuitos de Cloudflare y Sweego.
              </li>
              <li i18n="@@caso.libro.result.registry">
                El banco de datos «Quejas y reclamos» está inscrito desde el 14
                de octubre de 2026; según el Reglamento de la Ley N.º 29733, esa
                inscripción «es de aprobación automática» (art. 45.2)
                <a href="#fuente-4">[4]</a>.
              </li>
            </ul>
            <h2 i18n="@@caso.libro.setbacks.title">
              Tres tropiezos en el camino
            </h2>
            <ul>
              <li i18n="@@caso.libro.setbacks.header">
                <strong>Un encabezado que apuntaba mal.</strong> Cloudflare
                Pages convierte las precargas de JavaScript del HTML en un
                encabezado <code>Link</code>. El navegador resuelve ese
                encabezado contra la URL de la página y no contra la base del
                sitio, así que en las páginas internas pedía un archivo que no
                existe. La solución fue una línea: con integridad de
                subrecursos, la precarga lleva un atributo más y Cloudflare ya
                no la convierte.
              </li>
              <li i18n="@@caso.libro.setbacks.cron">
                <strong>El respaldo que salió un domingo.</strong> Programamos
                el respaldo para los lunes con <code>0 6 * * 1</code>, pero en
                Cloudflare el 1 es domingo. Como nuestro documento de seguridad
                dice «cada lunes», cambiamos el código, no el documento.
              </li>
              <li i18n="@@caso.libro.setbacks.print">
                <strong>La impresión con el menú del sitio.</strong> La primera
                constancia impresa salía con el encabezado y el pie de la web, y
                el bloque del proveedor se partía en dos páginas. Ahora se
                imprime solo la hoja, en una página.
              </li>
            </ul>
            <p class="mt-10">
              <ng-container i18n="@@caso.libro.cta"
                >¿Te interesa algo así para tu negocio?</ng-container
              >
              <a
                href="./#contacto"
                class="btn ml-2"
                i18n="@@caso.libro.cta.link"
                >Escríbenos</a
              >
            </p>

            <h2 i18n="@@caso.libro.sources.title">Fuentes</h2>
            <p i18n="@@caso.libro.sources.lead">
              Normas citadas, en el texto vigente consultado el 19 de octubre de
              2026. Hay un proyecto de modificación del Reglamento del Libro de
              Reclamaciones, publicado con la RM N.° 244-2026-PCM el 18 de julio
              de 2026, que aún no estaba vigente a esa fecha
              <a href="#fuente-8">[8]</a>.
            </p>
            <ol class="fuentes">
              @for (fuente of fuentes; track fuente.url; let n = $index) {
                <li [id]="'fuente-' + (n + 1)">
                  {{ fuente.cita }}
                  <a [href]="fuente.url" target="_blank" rel="noopener">{{
                    fuente.url
                  }}</a
                  >.
                  <ng-container i18n="@@caso.libro.sources.accessed"
                    >Consultado el 19 de octubre de 2026.</ng-container
                  >
                </li>
              }
            </ol>

            <aside
              id="aviso"
              class="mt-12 rounded-base border border-line p-6"
              i18n-aria-label="@@caso.libro.disclaimer.title"
              aria-label="Aviso"
            >
              <h2 class="mt-0" i18n="@@caso.libro.disclaimer.title">Aviso</h2>
              <p i18n="@@caso.libro.disclaimer">
                Este caso de estudio describe cómo KOSHISOFTWARE E.I.R.L.
                implementó su propio Libro de Reclamaciones virtual. Es
                información general, basada en nuestra lectura de las normas
                vigentes al 19 de octubre de 2026, y no constituye asesoría
                legal: no somos abogados. Las normas cambian y cada caso es
                distinto. Antes de tomar decisiones, revisa los textos oficiales
                enlazados arriba o consulta con un abogado. Si encuentras un
                error o una norma más reciente, escríbenos a
                <a href="mailto:hola@koshisoftware.pe"
                  >hola&#64;koshisoftware.pe</a
                >
                y lo corregimos.
              </p>
            </aside>
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
            href="https://github.com/schreibse/koshi-web/tree/main/libs/frontend/reclamaciones"
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
    .caso-texto strong {
      color: var(--ks-ink);
    }
    .caso-texto .fuentes {
      display: grid;
      gap: 0.75rem;
      padding-left: 1.5rem;
    }
    .caso-texto .fuentes li {
      font-size: 0.9rem;
      overflow-wrap: anywhere;
    }
  `,
})
export class CasoLibro {
  protected readonly caso = LIBRO;
  protected readonly lighthouse = LIGHTHOUSE;
  protected readonly fuentes = FUENTES;

  constructor() {
    inject(Title).setTitle(
      $localize`:@@caso.libro.pageTitle:Caso de estudio: Libro de Reclamaciones virtual · Koshisoftware`,
    );
    inject(Meta).updateTag({
      name: 'description',
      content: $localize`:@@caso.libro.description:Caso de estudio: cómo Koshisoftware implementó su Libro de Reclamaciones virtual, con numeración correlativa, copia al correo y respaldo semanal, y las normas peruanas que cita.`,
    });
  }
}
