import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** A labelled form control with a slot for its error message. */
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
    <p data-error hidden class="mt-1.5 text-sm text-accent"></p>
  `,
})
export class Campo {
  readonly label = input('');
}
