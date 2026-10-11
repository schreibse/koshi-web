import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  FormField,
  FormRoot,
  applyWhen,
  email,
  form,
  hidden,
  maxLength,
  min,
  required,
  validate,
} from '@angular/forms/signals';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  Contacto,
  DOCUMENTOS,
  Documento,
  HojaDeReclamacion,
  MAX_TEXTO,
  Tipo,
  numeroDocumentoValido,
} from '@koshi/shared/reclamacion/util';
import { Campo } from './campo';
import { Proveedor } from './proveedor';
import { HojaRegistrada } from './recibo';
import { Verificacion } from './verificacion';

interface Borrador extends Contacto {
  documento: Documento;
  numeroDocumento: string;
  menor: boolean;
  apoderado: Contacto;
  servicio: string;
  monto: number;
  tipo: Tipo;
  detalle: string;
  pedido: string;
  conforme: boolean;
}

const contactoVacio = (): Contacto => ({
  nombre: '',
  domicilio: '',
  telefono: '',
  email: '',
});

@Component({
  selector: 'ks-libro-de-reclamaciones',
  imports: [Campo, FormField, FormRoot, Proveedor, RouterLink, Verificacion],
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
  `,
  template: `
    <div
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

      <form [formRoot]="hoja" class="grid gap-12">
        <fieldset class="m-0 grid min-w-0 gap-4 border-0 p-0">
          <legend class="mb-4 p-0">
            <h2 class="text-xl" i18n="@@reclamaciones.consumer.title">
              Tus datos
            </h2>
          </legend>
          <ks-campo
            label="Nombre completo"
            i18n-label="@@reclamaciones.name"
            [state]="hoja.nombre()"
          >
            <input
              class="input"
              autocomplete="name"
              [formField]="hoja.nombre"
            />
          </ks-campo>
          <div class="grupo pares">
            <ks-campo
              label="Documento"
              i18n-label="@@reclamaciones.idType"
              [state]="hoja.documento()"
            >
              <select class="input" [formField]="hoja.documento">
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
              [state]="hoja.numeroDocumento()"
            >
              <input class="input" [formField]="hoja.numeroDocumento" />
            </ks-campo>
          </div>
          <ks-campo
            label="Domicilio"
            i18n-label="@@reclamaciones.address"
            [state]="hoja.domicilio()"
          >
            <input
              class="input"
              autocomplete="street-address"
              [formField]="hoja.domicilio"
            />
          </ks-campo>
          <div class="grupo pares">
            <ks-campo
              label="Teléfono"
              i18n-label="@@reclamaciones.phone"
              [state]="hoja.telefono()"
            >
              <input
                class="input"
                type="tel"
                autocomplete="tel"
                [formField]="hoja.telefono"
              />
            </ks-campo>
            <ks-campo
              label="Correo electrónico"
              i18n-label="@@reclamaciones.email"
              [state]="hoja.email()"
            >
              <input
                class="input"
                type="email"
                autocomplete="email"
                [formField]="hoja.email"
              />
            </ks-campo>
          </div>
          <label class="flex items-center gap-3">
            <input type="checkbox" class="check" [formField]="hoja.menor" />
            <span i18n="@@reclamaciones.minor">Soy menor de edad</span>
          </label>
          @if (!hoja.apoderado().hidden()) {
            <div class="grid gap-4 border-l-2 border-line pl-5">
              <p class="text-sm text-muted" i18n="@@reclamaciones.guardian">
                Datos de tu madre, padre o apoderado
              </p>
              <ks-campo
                label="Nombre completo"
                i18n-label="@@reclamaciones.name"
                [state]="hoja.apoderado.nombre()"
              >
                <input class="input" [formField]="hoja.apoderado.nombre" />
              </ks-campo>
              <ks-campo
                label="Domicilio"
                i18n-label="@@reclamaciones.address"
                [state]="hoja.apoderado.domicilio()"
              >
                <input class="input" [formField]="hoja.apoderado.domicilio" />
              </ks-campo>
              <div class="grupo pares">
                <ks-campo
                  label="Teléfono"
                  i18n-label="@@reclamaciones.phone"
                  [state]="hoja.apoderado.telefono()"
                >
                  <input
                    class="input"
                    type="tel"
                    [formField]="hoja.apoderado.telefono"
                  />
                </ks-campo>
                <ks-campo
                  label="Correo electrónico"
                  i18n-label="@@reclamaciones.email"
                  [state]="hoja.apoderado.email()"
                >
                  <input
                    class="input"
                    type="email"
                    [formField]="hoja.apoderado.email"
                  />
                </ks-campo>
              </div>
            </div>
          }
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
            [state]="hoja.servicio()"
          >
            <input class="input" [formField]="hoja.servicio" />
          </ks-campo>
          <ks-campo
            label="Monto reclamado (S/)"
            i18n-label="@@reclamaciones.amount"
            [state]="hoja.monto()"
          >
            <input
              class="input sm:max-w-60"
              type="number"
              step="0.01"
              inputmode="decimal"
              [formField]="hoja.monto"
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
                value="reclamo"
                class="sr-only"
                [formField]="hoja.tipo"
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
              <input
                type="radio"
                value="queja"
                class="sr-only"
                [formField]="hoja.tipo"
              />
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
          <ks-campo
            label="Detalle"
            i18n-label="@@reclamaciones.detail"
            [state]="hoja.detalle()"
          >
            <textarea
              class="input"
              rows="6"
              [formField]="hoja.detalle"
            ></textarea>
          </ks-campo>
          <ks-campo
            label="Pedido"
            i18n-label="@@reclamaciones.request"
            [state]="hoja.pedido()"
          >
            <textarea
              class="input"
              rows="3"
              [formField]="hoja.pedido"
            ></textarea>
          </ks-campo>
        </fieldset>

        <div class="grid gap-5 border-t border-line pt-8">
          <p class="text-sm text-muted" i18n="@@reclamaciones.privacy">
            Usamos tus datos solo para atender esta reclamación y los guardamos
            dos años en servidores de Cloudflare, fuera del Perú. Más en la
            <a routerLink="privacidad">política de privacidad</a>.
          </p>
          <ks-campo [state]="hoja.conforme()">
            <span class="flex items-start gap-3">
              <input
                type="checkbox"
                class="check mt-1"
                [formField]="hoja.conforme"
              />
              <span i18n="@@reclamaciones.confirm"
                >Confirmo que los datos son verdaderos y presento esta hoja de
                reclamación.</span
              >
            </span>
          </ks-campo>
          <ks-verificacion [(token)]="token" />
          <div class="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              class="btn btn-primary cursor-pointer"
              [disabled]="hoja().submitting()"
              i18n="@@reclamaciones.submit"
            >
              Enviar reclamación
            </button>
            <p class="text-sm text-muted" i18n="@@reclamaciones.copyNote">
              Recibirás una copia en tu correo.
            </p>
          </div>
          @switch (fallo()) {
            @case ('verificacion') {
              <p
                class="text-accent"
                role="alert"
                i18n="@@reclamaciones.failed.verification"
              >
                Completa la verificación de seguridad y vuelve a enviar.
              </p>
            }
            @case ('envio') {
              <p class="text-accent" role="alert" i18n="@@reclamaciones.failed">
                No pudimos registrar tu hoja. Inténtalo de nuevo en unos
                minutos.
              </p>
            }
          }
        </div>
      </form>
    </div>
  `,
})
export class LibroDeReclamaciones {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly documentos = DOCUMENTOS;
  protected readonly fallo = signal<'verificacion' | 'envio' | null>(null);
  protected readonly token = signal<string | null>(null);
  private readonly verificacion = viewChild.required(Verificacion);

  private readonly borrador = signal<Borrador>({
    ...contactoVacio(),
    documento: 'DNI',
    numeroDocumento: '',
    menor: false,
    apoderado: contactoVacio(),
    servicio: '',
    monto: NaN,
    tipo: 'reclamo',
    detalle: '',
    pedido: '',
    conforme: false,
  });

  protected readonly hoja = form(
    this.borrador,
    (path) => {
      for (const campo of [
        path.nombre,
        path.numeroDocumento,
        path.domicilio,
        path.telefono,
        path.email,
        path.servicio,
        path.detalle,
        path.pedido,
      ]) {
        required(campo);
      }
      required(path.monto);
      required(path.conforme);
      email(path.email);
      validate(path.numeroDocumento, ({ value, valueOf }) =>
        !value() || numeroDocumentoValido(valueOf(path.documento), value())
          ? undefined
          : { kind: 'documento' },
      );
      min(path.monto, 0);
      maxLength(path.detalle, MAX_TEXTO);
      maxLength(path.pedido, MAX_TEXTO);
      hidden(path.apoderado, { when: ({ valueOf }) => !valueOf(path.menor) });
      applyWhen(
        path.apoderado,
        ({ valueOf }) => valueOf(path.menor),
        (apoderado) => {
          required(apoderado.nombre);
          required(apoderado.domicilio);
          required(apoderado.telefono);
          required(apoderado.email);
          email(apoderado.email);
        },
      );
    },
    {
      submission: {
        action: async () => {
          this.fallo.set(null);
          const token = this.token();
          if (!token) {
            this.fallo.set('verificacion');
            return;
          }
          const hoja = aHoja(this.borrador());
          const respuesta = await fetch('/api/reclamaciones', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Turnstile-Token': token,
            },
            body: JSON.stringify(hoja),
          }).catch(() => null);
          if (!respuesta?.ok) {
            this.verificacion().reset();
            this.fallo.set(
              respuesta?.status === 403 ? 'verificacion' : 'envio',
            );
            return;
          }
          const { numero, registrada } = await respuesta.json();
          const recibo: HojaRegistrada = { hoja, numero, registrada };
          await this.router.navigate(['hoja'], {
            relativeTo: this.route,
            state: { recibo },
          });
        },
      },
    },
  );

  constructor() {
    inject(Meta).updateTag({
      name: 'description',
      content: $localize`:@@reclamaciones.description:Libro de Reclamaciones virtual de Koshisoftware E.I.R.L.`,
    });
  }
}

function aHoja(b: Borrador): HojaDeReclamacion {
  return {
    consumidor: {
      nombre: b.nombre,
      documento: b.documento,
      numeroDocumento: b.numeroDocumento,
      domicilio: b.domicilio,
      telefono: b.telefono,
      email: b.email,
    },
    apoderado: b.menor ? b.apoderado : null,
    servicio: b.servicio,
    monto: b.monto,
    tipo: b.tipo,
    detalle: b.detalle,
    pedido: b.pedido,
  };
}
