import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Proveedor } from '@koshi/frontend/layout/ui';

/** The site-wide privacy policy (Ley 29733); the Libro de Reclamaciones keeps its own notice. */
@Component({
  selector: 'ks-politica-de-privacidad',
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
      <h1 class="text-4xl md:text-5xl" i18n="@@politica.title">
        Política de privacidad
      </h1>
      <p class="mt-4 text-muted" i18n="@@politica.lead">
        Cómo tratamos tus datos personales cuando visitas este sitio o nos
        escribes, conforme a la Ley N.º 29733, Ley de Protección de Datos
        Personales, y su Reglamento. Última actualización: octubre de 2026.
      </p>

      <h2 i18n="@@privacidad.owner.title">Responsable</h2>
      <ks-proveedor />
      <p class="mt-3" i18n="@@politica.owner.email">
        Correo: hola&#64;koshisoftware.pe
      </p>

      <h2 i18n="@@politica.visit.title">Cuando visitas el sitio</h2>
      <p i18n="@@politica.visit">
        Este sitio no usa cookies, no mide visitas con herramientas de analítica
        y no carga contenido de terceros. Nosotros no llevamos registros de
        visitas. Cloudflare, Inc. (Estados Unidos) aloja el sitio y, como
        encargado, procesa tu dirección IP y datos técnicos de tu navegador para
        entregarte las páginas y protegerlas de ataques.
      </p>

      <h2 i18n="@@politica.email.title">Cuando nos escribes</h2>
      <p i18n="@@politica.email">
        Si nos escribes a hola&#64;koshisoftware.pe o a otra de nuestras
        direcciones, usamos tu nombre, tu correo y lo que nos cuentes para
        responderte y, si nos contratas, para la cotización, el contrato y la
        facturación. No los usamos para publicidad ni los compartimos, salvo que
        la ley nos obligue (por ejemplo, ante la SUNAT). Nuestro correo funciona
        con Proton AG (Suiza), que trata los mensajes como encargado.
      </p>

      <h2 i18n="@@politica.libro.title">Libro de Reclamaciones</h2>
      <p i18n="@@politica.libro">
        Los datos de una hoja de reclamación tienen su propia política, con su
        banco de datos inscrito, sus plazos y sus encargados:
        <a href="libro-de-reclamaciones/privacidad/"
          >Política de privacidad del Libro de Reclamaciones</a
        >.
      </p>

      <h2 i18n="@@privacidad.transfer.title">Transferencia internacional</h2>
      <p i18n="@@politica.transfer">
        Como Cloudflare y Proton están fuera del Perú, tus datos se tratan en
        Estados Unidos y en Suiza, por nuestra cuenta y bajo contrato.
      </p>

      <h2 i18n="@@privacidad.retention.title">Cuánto tiempo los guardamos</h2>
      <p i18n="@@politica.retention">
        Guardamos tus correos mientras sean útiles para atender tu consulta o
        nuestra relación comercial, y durante los plazos que exija la ley, por
        ejemplo los tributarios. Si nos pides borrarlos, lo hacemos.
      </p>

      <h2 i18n="@@privacidad.rights.title">Tus derechos</h2>
      <p i18n="@@politica.rights">
        Puedes pedir información sobre tus datos, acceder a ellos,
        rectificarlos, cancelarlos u oponerte a su tratamiento escribiendo a
        hola&#64;koshisoftware.pe o a la dirección de arriba. Respondemos en los
        plazos del Reglamento de la Ley N.º 29733. Si no estás conforme con la
        respuesta, puedes acudir a la Autoridad Nacional de Protección de Datos
        Personales.
      </p>
    </article>
  `,
})
export class PoliticaDePrivacidad {
  constructor() {
    inject(Title).setTitle(
      $localize`:@@politica.pageTitle:Política de privacidad · Koshisoftware`,
    );
    inject(Meta).updateTag({
      name: 'description',
      content: $localize`:@@politica.description:Cómo Koshisoftware E.I.R.L. trata los datos personales de quienes visitan este sitio o le escriben.`,
    });
  }
}
