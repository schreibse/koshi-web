import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENTOS } from '@koshi/shared/reclamacion/util';
import { Campo, Proveedor } from '@koshi/frontend/layout/ui';

/** The Libro's markup, prerendered and never hydrated; `formulario.ts` makes it work in the browser. */
@Component({
  selector: 'ks-libro-de-reclamaciones',
  imports: [Campo, Proveedor],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .grupo {
      display: grid;
      gap: 1rem;
    }
    @media (min-width: 600px) {
      .pares {
        grid-template-columns: 1fr 1fr;
      }
    }
    @media print {
      :host {
        color: #000;
      }
      .no-print {
        display: none;
      }
    }
  `,
  template: `
    <div
      data-formulario
      class="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-start gap-10 px-4 py-12 md:px-10 md:py-16 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-16"
    >
      <aside class="grid gap-5 lg:sticky lg:top-24">
        <div>
          <span class="eyebrow" i18n="@@reclamaciones.eyebrow"
            >Libro de Reclamaciones</span
          >
          <h1 class="text-4xl md:text-5xl" i18n="@@reclamaciones.title">
            Hoja de reclamación
          </h1>
        </div>
        <p class="text-muted" i18n="@@reclamaciones.lead">
          Conforme al Código de Protección y Defensa del Consumidor, puedes
          registrar aquí un reclamo o una queja. Te respondemos por correo en un
          plazo máximo de 15 días hábiles, improrrogable.
        </p>
        <div class="border-t border-line pt-5"><ks-proveedor /></div>
        <p class="text-sm text-muted" i18n="@@reclamaciones.otherRoutes">
          La formulación del reclamo no impide acudir a otras vías de solución
          de controversias ni es requisito previo para interponer una denuncia
          ante el INDECOPI.
        </p>
      </aside>

      <!-- POST, so a submit before the script has loaded never puts the sheet in a URL. -->
      <form
        method="post"
        action="/api/reclamaciones"
        novalidate
        class="grid gap-12"
        [attr.data-error-required]="mensajes.required"
        [attr.data-error-email]="mensajes.email"
        [attr.data-error-documento]="mensajes.documento"
        [attr.data-error-invalid]="mensajes.invalid"
        [attr.data-fallo-verificacion]="mensajes.verificacion"
        [attr.data-fallo-envio]="mensajes.envio"
      >
        <fieldset class="m-0 grid min-w-0 gap-4 border-0 p-0">
          <legend class="mb-4 p-0">
            <h2 class="text-xl" i18n="@@reclamaciones.consumer.title">
              Tus datos
            </h2>
          </legend>
          <ks-campo label="Nombre completo" i18n-label="@@reclamaciones.name">
            <input class="input" autocomplete="name" name="consumidor.nombre" />
          </ks-campo>
          <div class="grupo pares">
            <ks-campo label="Documento" i18n-label="@@reclamaciones.idType">
              <select class="input" name="consumidor.documento">
                @for (documento of documentos; track documento) {
                  <option [value]="documento">
                    @if (documento === 'Otro') {
                      <ng-container i18n="@@reclamaciones.idType.other"
                        >Otro</ng-container
                      >
                    } @else {
                      {{ documento }}
                    }
                  </option>
                }
              </select>
            </ks-campo>
            <ks-campo
              label="Número de documento"
              i18n-label="@@reclamaciones.idNumber"
            >
              <input class="input" name="consumidor.numeroDocumento" />
            </ks-campo>
          </div>
          <ks-campo label="Domicilio" i18n-label="@@reclamaciones.address">
            <input
              class="input"
              autocomplete="street-address"
              name="consumidor.domicilio"
            />
          </ks-campo>
          <div class="grupo pares">
            <ks-campo label="Teléfono" i18n-label="@@reclamaciones.phone">
              <input
                class="input"
                type="tel"
                autocomplete="tel"
                name="consumidor.telefono"
              />
            </ks-campo>
            <ks-campo
              label="Correo electrónico"
              i18n-label="@@reclamaciones.email"
            >
              <input
                class="input"
                type="email"
                autocomplete="email"
                name="consumidor.email"
              />
            </ks-campo>
          </div>
          <label class="flex items-center gap-3">
            <input type="checkbox" class="check" name="menor" />
            <span i18n="@@reclamaciones.minor">Soy menor de edad</span>
          </label>
          <div
            data-apoderado
            hidden
            class="grid gap-4 border-l-2 border-line pl-5"
          >
            <p class="text-sm text-muted" i18n="@@reclamaciones.guardian">
              Datos de tu madre, padre o apoderado
            </p>
            <ks-campo label="Nombre completo" i18n-label="@@reclamaciones.name">
              <input class="input" name="apoderado.nombre" />
            </ks-campo>
            <ks-campo label="Domicilio" i18n-label="@@reclamaciones.address">
              <input class="input" name="apoderado.domicilio" />
            </ks-campo>
            <div class="grupo pares">
              <ks-campo label="Teléfono" i18n-label="@@reclamaciones.phone">
                <input class="input" type="tel" name="apoderado.telefono" />
              </ks-campo>
              <ks-campo
                label="Correo electrónico"
                i18n-label="@@reclamaciones.email"
              >
                <input class="input" type="email" name="apoderado.email" />
              </ks-campo>
            </div>
          </div>
        </fieldset>

        <fieldset class="m-0 grid min-w-0 gap-4 border-0 p-0">
          <legend class="mb-4 p-0">
            <h2 class="text-xl" i18n="@@reclamaciones.service.title">
              Servicio contratado
            </h2>
          </legend>
          <ks-campo
            label="Descripción del servicio"
            i18n-label="@@reclamaciones.service"
          >
            <input class="input" name="servicio" />
          </ks-campo>
          <ks-campo
            label="Monto reclamado (S/)"
            i18n-label="@@reclamaciones.amount"
          >
            <input
              class="input sm:max-w-60"
              type="number"
              step="0.01"
              inputmode="decimal"
              name="monto"
            />
          </ks-campo>
        </fieldset>

        <fieldset class="m-0 grid min-w-0 gap-4 border-0 p-0">
          <legend class="mb-4 p-0">
            <h2 class="text-xl" i18n="@@reclamaciones.claim.title">
              Tu reclamación
            </h2>
          </legend>
          <div class="grid max-w-xl gap-3">
            <label class="opcion">
              <input
                type="radio"
                name="tipo"
                value="reclamo"
                class="sr-only"
                checked
              />
              <span class="font-semibold" i18n="@@reclamaciones.reclamo"
                >Reclamo</span
              >
              <span
                class="text-[0.95rem] text-muted"
                i18n="@@reclamaciones.reclamo.definition"
                >Disconformidad relacionada a los productos o servicios.</span
              >
            </label>
            <label class="opcion">
              <input type="radio" name="tipo" value="queja" class="sr-only" />
              <span class="font-semibold" i18n="@@reclamaciones.queja"
                >Queja</span
              >
              <span
                class="text-[0.95rem] text-muted"
                i18n="@@reclamaciones.queja.definition"
                >Disconformidad no relacionada a los productos o servicios; o,
                malestar o descontento respecto a la atención al público.</span
              >
            </label>
          </div>
          <ks-campo label="Detalle" i18n-label="@@reclamaciones.detail">
            <textarea class="input" rows="6" name="detalle"></textarea>
          </ks-campo>
          <ks-campo label="Pedido" i18n-label="@@reclamaciones.request">
            <textarea class="input" rows="3" name="pedido"></textarea>
          </ks-campo>
        </fieldset>

        <div class="grid gap-5 border-t border-line pt-8">
          <p class="text-sm text-muted" i18n="@@reclamaciones.privacy">
            Usamos tus datos solo para atender esta reclamación y los guardamos
            dos años en servidores de Cloudflare, fuera del Perú. Más en la
            <a href="libro-de-reclamaciones/privacidad/"
              >política de privacidad</a
            >.
          </p>
          <ks-campo>
            <span class="flex items-start gap-3">
              <input type="checkbox" class="check mt-1" name="conforme" />
              <span i18n="@@reclamaciones.confirm"
                >Confirmo que los datos son verdaderos y presento esta hoja de
                reclamación.</span
              >
            </span>
          </ks-campo>
          <div data-verificacion class="min-h-[65px]"></div>
          <div class="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              class="btn btn-primary cursor-pointer"
              i18n="@@reclamaciones.submit"
            >
              Enviar reclamación
            </button>
            <p class="text-sm text-muted" i18n="@@reclamaciones.copyNote">
              Recibirás una copia en tu correo.
            </p>
          </div>
          <p data-fallo class="text-accent" role="alert"></p>
        </div>
      </form>
    </div>

    <div
      data-recibo
      hidden
      class="mx-auto max-w-3xl px-4 py-12 md:px-10 md:py-16"
    >
      <span class="eyebrow">
        <ng-container i18n="@@recibo.number">Hoja n.º</ng-container>&ngsp;<span
          data-campo="numero"
        ></span>
      </span>
      <h1
        tabindex="-1"
        class="text-4xl outline-none md:text-5xl"
        i18n="@@recibo.title"
      >
        Recibimos tu reclamación
      </h1>
      <p class="mt-4 text-muted" i18n="@@recibo.lead">
        Enviamos una copia de esta hoja a <span data-campo="email"></span>. Te
        responderemos por correo en un plazo máximo de 15 días hábiles.
      </p>

      <h2 class="mt-10 mb-3 text-lg" i18n="@@recibo.sent">
        Lo que nos enviaste
      </h2>
      <dl
        class="grid grid-cols-1 gap-x-6 gap-y-1 border-y border-line py-5 text-[0.95rem] sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-y-2"
      >
        <dt class="text-muted" i18n="@@recibo.date">Fecha</dt>
        <dd class="mb-2 sm:mb-0" data-campo="fecha"></dd>
        <dt class="text-muted" i18n="@@recibo.type">Tipo</dt>
        <dd class="mb-2 capitalize sm:mb-0" data-campo="tipo"></dd>
        <dt class="text-muted" i18n="@@recibo.consumer">Consumidor</dt>
        <dd class="mb-2 sm:mb-0" data-campo="consumidor"></dd>
        <dt class="text-muted" data-con-apoderado i18n="@@recibo.guardian">
          Apoderado
        </dt>
        <dd class="mb-2 sm:mb-0" data-con-apoderado data-campo="apoderado"></dd>
        <dt class="text-muted" i18n="@@recibo.service">Servicio</dt>
        <dd class="mb-2 sm:mb-0" data-campo="servicio"></dd>
        <dt class="text-muted" i18n="@@recibo.amount">Monto reclamado</dt>
        <dd class="mb-2 sm:mb-0" data-campo="monto"></dd>
        <dt class="text-muted" i18n="@@recibo.detail">Detalle</dt>
        <dd class="mb-2 whitespace-pre-line sm:mb-0" data-campo="detalle"></dd>
        <dt class="text-muted" i18n="@@recibo.request">Pedido</dt>
        <dd class="whitespace-pre-line" data-campo="pedido"></dd>
      </dl>
      <div class="mt-6 sm:[--etiqueta:180px] sm:[--hueco:1.5rem]">
        <ks-proveedor />
      </div>

      <div
        class="no-print mx-auto mt-8 grid w-fit gap-3 text-center sm:mx-0 sm:flex sm:flex-wrap"
      >
        <button
          type="button"
          data-imprimir
          class="btn btn-primary cursor-pointer"
          i18n="@@recibo.print"
        >
          Imprimir o guardar PDF
        </button>
        <a href="./" class="btn" i18n="@@recibo.home">Volver al inicio</a>
      </div>
    </div>
  `,
})
export class LibroDeReclamaciones {
  protected readonly documentos = DOCUMENTOS;
  protected readonly mensajes = {
    required: $localize`:@@reclamaciones.error.required:Este campo es obligatorio.`,
    email: $localize`:@@reclamaciones.error.email:Escribe un correo válido.`,
    documento: $localize`:@@reclamaciones.error.idNumber:DNI: 8 dígitos. RUC: 11 dígitos. Otros: solo letras y números.`,
    invalid: $localize`:@@reclamaciones.error.invalid:Revisa este campo.`,
    verificacion: $localize`:@@reclamaciones.failed.verification:Completa la verificación de seguridad y vuelve a enviar.`,
    envio: $localize`:@@reclamaciones.failed:No pudimos registrar tu hoja. Inténtalo de nuevo en unos minutos.`,
  };

  constructor() {
    inject(Title).setTitle(
      $localize`:@@reclamaciones.pageTitle:Libro de Reclamaciones · Koshisoftware`,
    );
    inject(Meta).updateTag({
      name: 'description',
      content: $localize`:@@reclamaciones.description:Libro de Reclamaciones virtual de Koshisoftware E.I.R.L.`,
    });
  }
}
