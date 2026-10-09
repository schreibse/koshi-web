import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { FieldState } from '@angular/forms/signals';

/** A labelled form control that shows its first error once touched. */
@Component({
  selector: 'ks-campo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -- the control is projected -->
    <label class="block">
      @if (label()) {
        <span class="mb-1.5 block text-sm font-semibold">{{ label() }}</span>
      }
      <ng-content />
    </label>
    @if (error(); as error) {
      <p class="mt-1.5 text-sm text-accent">{{ error }}</p>
    }
  `,
})
export class Campo {
  readonly label = input('');
  readonly state = input.required<FieldState<unknown>>();

  protected readonly error = computed(() => {
    const state = this.state();
    if (!state.touched()) return null;
    switch (state.errors()[0]?.kind) {
      case undefined:
        return null;
      case 'required':
        return $localize`:@@reclamaciones.error.required:Este campo es obligatorio.`;
      case 'email':
        return $localize`:@@reclamaciones.error.email:Escribe un correo válido.`;
      default:
        return $localize`:@@reclamaciones.error.invalid:Revisa este campo.`;
    }
  });
}
