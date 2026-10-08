import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

type Theme = 'dark' | 'light';

@Component({
  selector: 'ks-theme-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="grid size-10 cursor-pointer place-items-center rounded-base border border-line bg-transparent text-ink"
      (click)="toggle()"
      i18n-aria-label="@@theme.toggle"
      aria-label="Cambiar tema claro/oscuro"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
      </svg>
    </button>
  `,
})
export class ThemeToggle {
  private readonly root = inject(DOCUMENT).documentElement;

  toggle(): void {
    const next: Theme =
      this.root.dataset['theme'] === 'light' ? 'dark' : 'light';
    this.root.dataset['theme'] = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      // Private mode or blocked storage: the choice just isn't remembered.
    }
  }
}
