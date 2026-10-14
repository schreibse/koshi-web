import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Proveedor } from './proveedor';

/** The privacy notice Ley 29733 art. 18 requires before the sheet's data is collected. */
@Component({
  selector: 'ks-privacidad',
  imports: [Proveedor],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    h2 {
      margin: 2.25rem 0 0.6rem;
      font-size: 1.25rem;
    }
    p + p {
      margin-top: 0.75rem;
    }
  `,
  template: `
    <article class="mx-auto max-w-3xl px-4 py-12 md:px-10 md:py-16">
      <span class="eyebrow" i18n="@@reclamaciones.eyebrow"
        >Libro de Reclamaciones</span
      >
      <h1 class="text-4xl md:text-5xl" i18n="@@privacidad.title">
        Política de privacidad
      </h1>
      <p class="mt-4 text-muted" i18n="@@privacidad.lead">
        Cómo tratamos los datos que nos das al presentar una hoja de
        reclamación, conforme a la Ley N.º 29733, Ley de Protección de Datos
        Personales, y su Reglamento.
      </p>

      <h2 i18n="@@privacidad.owner.title">Responsable</h2>
      <ks-proveedor />

      <h2 i18n="@@privacidad.purpose.title">Para qué usamos tus datos</h2>
      <p i18n="@@privacidad.purpose">
        Para registrar tu reclamo o queja, responderte, conservar la hoja como
        exige el Reglamento del Libro de Reclamaciones y entregarla al INDECOPI
        si la solicita. No los usamos para publicidad ni para ningún otro fin, y
        no tomamos decisiones automatizadas ni elaboramos perfiles con ellos.
      </p>

      <h2 i18n="@@privacidad.basis.title">Datos obligatorios</h2>
      <p i18n="@@privacidad.basis">
        Todos los campos del formulario son obligatorios: son los que el
        Reglamento exige en la hoja de reclamación. Sin ellos no podemos
        registrar ni responder tu reclamación. No incluyas en el detalle datos
        sensibles, como de salud, que no sean necesarios para tu reclamo.
      </p>

      <h2 i18n="@@privacidad.bank.title">Banco de datos y destinatarios</h2>
      <p i18n="@@privacidad.bank">
        Tus datos se guardan en el banco de datos «Libro de Reclamaciones» de
        Koshisoftware E.I.R.L. Solo los ven Koshisoftware y, si lo solicitan, el
        INDECOPI u otras autoridades competentes.
      </p>

      <h2 i18n="@@privacidad.transfer.title">Transferencia internacional</h2>
      <p i18n="@@privacidad.transfer">
        Este sitio y su base de datos funcionan en la infraestructura de
        Cloudflare, Inc. (Estados Unidos), que trata los datos como encargado,
        por nuestra cuenta y bajo contrato. Por eso tus datos se almacenan fuera
        del Perú. Para proteger el formulario de envíos automatizados,
        Cloudflare Turnstile analiza tu dirección IP y datos técnicos de tu
        navegador.
      </p>

      <h2 i18n="@@privacidad.retention.title">Cuánto tiempo los guardamos</h2>
      <p i18n="@@privacidad.retention">
        Dos años desde que presentas la hoja, el plazo que exige el Reglamento
        del Libro de Reclamaciones. Después los eliminamos.
      </p>

      <h2 i18n="@@privacidad.rights.title">Tus derechos</h2>
      <p i18n="@@privacidad.rights">
        Puedes pedir información sobre tus datos, acceder a ellos,
        rectificarlos, cancelarlos u oponerte a su tratamiento escribiendo a la
        dirección de arriba. Respondemos en los plazos del Reglamento de la Ley
        N.º 29733. Si no estás conforme con la respuesta, puedes acudir a la
        Autoridad Nacional de Protección de Datos Personales.
      </p>

      <a
        href="libro-de-reclamaciones/"
        class="btn mt-10"
        i18n="@@recibo.none.back"
        >Ir al Libro de Reclamaciones</a
      >
    </article>
  `,
})
export class Privacidad {
  constructor() {
    inject(Title).setTitle(
      $localize`:@@privacidad.pageTitle:Política de privacidad · Koshisoftware`,
    );
    inject(Meta).updateTag({
      name: 'description',
      content: $localize`:@@privacidad.description:Cómo Koshisoftware E.I.R.L. trata los datos personales registrados en el Libro de Reclamaciones.`,
    });
  }
}
