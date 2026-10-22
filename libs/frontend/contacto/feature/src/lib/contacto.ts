import {
  ChangeDetectionStrategy,
  Component,
  LOCALE_ID,
  inject,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Campo } from '@koshi/frontend/layout/ui';
import { slug, toLocale } from '@koshi/shared/locale/util';

/** The contact page's markup, prerendered and never hydrated; `formulario.ts` makes it work in the browser. */
@Component({
  selector: 'ks-contacto',
  imports: [Campo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div data-formulario class="mx-auto max-w-3xl px-4 py-12 md:px-10 md:py-16">
      <span class="eyebrow" i18n="@@contacto.eyebrow">Contacto</span>
      <h1 class="text-4xl md:text-5xl" i18n="@@contacto.title">Escríbeme</h1>
      <p class="mt-4 text-muted" i18n="@@contacto.lead">
        Cuéntame qué necesitas. Te respondo por correo a la dirección que me
        indiques.
      </p>

      <!-- POST, so a submit before the script has loaded never puts the message in a URL. -->
      <form
        method="post"
        action="/api/contacto"
        novalidate
        class="mt-10 grid gap-4"
        [attr.data-error-required]="mensajes.required"
        [attr.data-error-email]="mensajes.email"
        [attr.data-error-invalid]="mensajes.invalid"
        [attr.data-fallo-verificacion]="mensajes.verificacion"
        [attr.data-fallo-envio]="mensajes.envio"
      >
        <div class="grid gap-4 sm:grid-cols-2">
          <ks-campo label="Nombre" i18n-label="@@contacto.name">
            <input class="input" autocomplete="name" name="nombre" />
          </ks-campo>
          <ks-campo label="Correo electrónico" i18n-label="@@contacto.email">
            <input
              class="input"
              type="email"
              autocomplete="email"
              name="email"
            />
          </ks-campo>
        </div>
        <ks-campo label="Tema" i18n-label="@@contacto.topic">
          <select class="input sm:max-w-80" name="tema">
            <option value="proyecto" i18n="@@contacto.topic.proyecto">
              Proyecto web
            </option>
            <option value="cv" i18n="@@contacto.topic.cv">CV</option>
            <option value="correccion" i18n="@@contacto.topic.correccion">
              Corrección
            </option>
            <option value="datos" i18n="@@contacto.topic.datos">
              Datos personales
            </option>
            <option value="otro" i18n="@@contacto.topic.otro">Otro</option>
          </select>
        </ks-campo>
        <p
          data-aviso-datos
          hidden
          class="border-l-2 border-line pl-5 text-sm text-muted"
          i18n="@@contacto.datosNote"
        >
          Para atender una solicitud sobre tus datos personales, primero te
          pediré por correo que confirmes tu identidad.
        </p>
        <ks-campo label="Mensaje" i18n-label="@@contacto.message">
          <textarea class="input" rows="7" name="mensaje"></textarea>
        </ks-campo>

        <div class="mt-4 grid gap-5 border-t border-line pt-8">
          <p class="text-sm text-muted" i18n="@@contacto.privacy">
            Uso tu nombre, tu correo y tu mensaje solo para responderte. Más en
            la <a [href]="privacidad">política de privacidad</a>.
          </p>
          <div data-verificacion class="min-h-[65px]"></div>
          <div>
            <button
              type="submit"
              class="btn btn-primary cursor-pointer"
              i18n="@@contacto.submit"
            >
              Enviar mensaje
            </button>
          </div>
          <p data-fallo class="text-accent" role="alert"></p>
        </div>
      </form>
    </div>

    <div
      data-enviado
      hidden
      class="mx-auto max-w-3xl px-4 py-12 md:px-10 md:py-16"
    >
      <h1
        tabindex="-1"
        class="text-4xl outline-none md:text-5xl"
        i18n="@@contacto.sent.title"
      >
        Mensaje enviado
      </h1>
      <p class="mt-4 text-muted" i18n="@@contacto.sent.lead">
        Te responderé a <span data-campo="email"></span>.
      </p>
      <a href="./" class="btn mt-8" i18n="@@contacto.sent.home"
        >Volver al inicio</a
      >
    </div>
  `,
})
export class Contacto {
  protected readonly privacidad = `${slug('privacidad', toLocale(inject(LOCALE_ID)))}/`;
  protected readonly mensajes = {
    required: $localize`:@@reclamaciones.error.required:Este campo es obligatorio.`,
    email: $localize`:@@reclamaciones.error.email:Escribe un correo válido.`,
    invalid: $localize`:@@reclamaciones.error.invalid:Revisa este campo.`,
    verificacion: $localize`:@@reclamaciones.failed.verification:Completa la verificación de seguridad y vuelve a enviar.`,
    envio: $localize`:@@contacto.failed:No se pudo enviar tu mensaje. Inténtalo de nuevo en unos minutos.`,
  };

  constructor() {
    inject(Title).setTitle(
      $localize`:@@contacto.pageTitle:Contacto · Koshisoftware`,
    );
    inject(Meta).updateTag({
      name: 'description',
      content: $localize`:@@contacto.description:Escríbele a Koshisoftware: proyectos web, CV, correcciones o tus datos personales.`,
    });
  }
}
