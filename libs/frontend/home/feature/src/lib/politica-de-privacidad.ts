import {
  ChangeDetectionStrategy,
  Component,
  LOCALE_ID,
  inject,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Proveedor } from '@koshi/frontend/layout/ui';
import { slug, toLocale } from '@koshi/shared/locale/util';

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

      <h2 i18n="@@politica.visit.title">Cuando visitas el sitio</h2>
      <p i18n="@@politica.visit">
        Este sitio no usa cookies. Nosotros no llevamos registros de visitas.
        Cloudflare, Inc. (Estados Unidos) aloja el sitio y, como encargado,
        procesa tu dirección IP y datos técnicos de tu navegador para entregarte
        las páginas y protegerlas de ataques.
      </p>
      <p i18n="@@politica.visit.analytics">
        En cada página, un script de Cloudflare (Web Analytics) mide cuánto
        tarda en cargar y reporta qué página visitaste, el sitio desde el que
        llegaste, tu país, tipo de dispositivo, navegador y sistema operativo.
        Nosotros solo vemos totales, no visitas individuales.
      </p>
      <p i18n="@@politica.visit.turnstile">
        El formulario de contacto y el Libro de Reclamaciones además cargan
        Cloudflare Turnstile, que comprueba que quien los envía es una persona y
        no un programa.
      </p>

      <h2 i18n="@@politica.email.title">Cuando nos escribes</h2>
      <p i18n="@@politica.email">
        Si nos escribes desde el formulario de contacto o por correo, usamos tu
        nombre, tu correo y lo que nos cuentes para responderte y, si nos
        contratas, para la cotización, el contrato y la facturación. No los
        usamos para publicidad ni los compartimos, salvo que la ley nos obligue
        (por ejemplo, ante la SUNAT). El formulario nos envía tu mensaje con
        Sweego (Mindbaz SAS, Francia), y Cloudflare Turnstile lo protege de
        envíos automatizados analizando tu dirección IP y datos técnicos de tu
        navegador. Nuestro correo funciona con Proton AG (Suiza). Todos ellos
        tratan los datos como encargados.
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
        Como Cloudflare, Sweego y Proton están fuera del Perú, tus datos se
        tratan en Estados Unidos, Francia y Suiza, por nuestra cuenta y bajo
        contrato.
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
        rectificarlos, cancelarlos u oponerte a su tratamiento desde el
        <a [href]="contacto">formulario de contacto</a> (tema «Datos
        personales») o escribiendo a la dirección de arriba. Antes de atender
        una solicitud, confirmamos tu identidad. Respondemos en los plazos del
        Reglamento de la Ley N.º 29733. Si no estás conforme con la respuesta,
        puedes acudir a la Autoridad Nacional de Protección de Datos Personales.
      </p>
    </article>
  `,
})
export class PoliticaDePrivacidad {
  protected readonly contacto = `${slug('contacto', toLocale(inject(LOCALE_ID)))}/?tema=datos`;

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
