import { ChangeDetectionStrategy, Component } from '@angular/core';

/** The provider block every Hoja de Reclamación has to show. */
@Component({
  selector: 'ks-proveedor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[0.9rem]">
      <dt class="text-muted" i18n="@@reclamaciones.provider.name">
        Razón social
      </dt>
      <dd>KOSHISOFTWARE E.I.R.L.</dd>
      <dt class="text-muted">RUC</dt>
      <dd>20612884201</dd>
      <dt class="text-muted" i18n="@@reclamaciones.provider.address">
        Dirección
      </dt>
      <dd>
        MZA. J2 LOTE. 7 DPTO. 301 OTR. MALECÓN SUPERIOR LIMA - LIMA - PUNTA
        HERMOSA
      </dd>
    </dl>
  `,
})
export class Proveedor {}
