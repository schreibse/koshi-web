import { DatePipe, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { HojaDeReclamacion } from '@koshi/shared/reclamacion/util';
import { Proveedor } from './proveedor';

export interface HojaRegistrada {
  hoja: HojaDeReclamacion;
  numero: string;
  /** ISO timestamp the server stamped the sheet with. */
  registrada: string;
}

/** The filed sheet, shown once after submitting; reached by navigation state only. */
@Component({
  selector: 'ks-recibo',
  imports: [DatePipe, Proveedor, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
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
    <div class="mx-auto max-w-3xl px-4 py-12 md:px-10 md:py-16">
      @if (recibo; as r) {
        <span class="eyebrow">
          <ng-container i18n="@@recibo.number">Hoja n.º</ng-container>
          {{ r.numero }}
        </span>
        <h1 class="text-4xl md:text-5xl" i18n="@@recibo.title">
          Recibimos tu reclamación
        </h1>
        <p class="mt-4 text-muted" i18n="@@recibo.lead">
          Enviamos una copia de esta hoja a {{ r.hoja.consumidor.email }}. Te
          responderemos por correo en un plazo máximo de 15 días hábiles.
        </p>

        <h2 class="mt-10 mb-3 text-lg" i18n="@@recibo.sent">
          Lo que nos enviaste
        </h2>
        <dl
          class="grid grid-cols-1 gap-x-6 gap-y-1 border-y border-line py-5 text-[0.95rem] sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-y-2"
        >
          <dt class="text-muted" i18n="@@recibo.date">Fecha</dt>
          <dd class="mb-2 sm:mb-0">
            {{ r.registrada | date: 'dd/MM/yyyy, HH:mm' : 'America/Lima' }}
          </dd>
          <dt class="text-muted" i18n="@@recibo.type">Tipo</dt>
          <dd class="mb-2 capitalize sm:mb-0">{{ r.hoja.tipo }}</dd>
          <dt class="text-muted" i18n="@@recibo.consumer">Consumidor</dt>
          <dd class="mb-2 sm:mb-0">
            {{ r.hoja.consumidor.nombre }} · {{ r.hoja.consumidor.documento }}
            {{ r.hoja.consumidor.numeroDocumento }}
          </dd>
          @if (r.hoja.apoderado; as a) {
            <dt class="text-muted" i18n="@@recibo.guardian">Apoderado</dt>
            <dd class="mb-2 sm:mb-0">{{ a.nombre }}</dd>
          }
          <dt class="text-muted" i18n="@@recibo.service">Servicio</dt>
          <dd class="mb-2 sm:mb-0">{{ r.hoja.servicio }}</dd>
          <dt class="text-muted" i18n="@@recibo.amount">Monto reclamado</dt>
          <dd class="mb-2 sm:mb-0">S/ {{ r.hoja.monto.toFixed(2) }}</dd>
          <dt class="text-muted" i18n="@@recibo.detail">Detalle</dt>
          <dd class="mb-2 whitespace-pre-line sm:mb-0">{{ r.hoja.detalle }}</dd>
          <dt class="text-muted" i18n="@@recibo.request">Pedido</dt>
          <dd class="whitespace-pre-line">{{ r.hoja.pedido }}</dd>
        </dl>
        <div class="mt-6"><ks-proveedor /></div>

        <div class="no-print mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            class="btn btn-primary cursor-pointer"
            (click)="imprimir()"
            i18n="@@recibo.print"
          >
            Imprimir o guardar PDF
          </button>
          <a routerLink="/" class="btn" i18n="@@recibo.home"
            >Volver al inicio</a
          >
        </div>
      } @else {
        <h1 class="text-4xl" i18n="@@recibo.none.title">
          No hay una hoja que mostrar
        </h1>
        <p class="mt-4 text-muted" i18n="@@recibo.none.lead">
          Si ya enviaste una, la copia está en tu correo.
        </p>
        <a routerLink=".." class="btn mt-8" i18n="@@recibo.none.back"
          >Ir al Libro de Reclamaciones</a
        >
      }
    </div>
  `,
})
export class Recibo {
  protected readonly recibo: HojaRegistrada | null = isPlatformBrowser(
    inject(PLATFORM_ID),
  )
    ? (history.state?.recibo ?? null)
    : null;

  constructor() {
    inject(Meta).updateTag({
      name: 'description',
      content: $localize`:@@recibo.description:Constancia de la hoja de reclamación registrada en el Libro de Reclamaciones de Koshisoftware E.I.R.L.`,
    });
  }

  protected imprimir(): void {
    print();
  }
}
