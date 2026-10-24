import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

type Theme = 'dark' | 'light';

@Component({
  selector: 'ks-theme-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // The icon shows the theme a click switches to; the theme lives on <html>, outside Angular.
  styles: `
    .luna,
    :host-context([data-theme='light']) .sol {
      display: none;
    }
    :host-context([data-theme='light']) .luna {
      display: block;
    }
  `,
  template: `
    <button
      type="button"
      class="grid size-10 cursor-pointer place-items-center rounded-base border border-line bg-transparent text-ink"
      (click)="toggle()"
      i18n-aria-label="@@theme.toggle"
      aria-label="Cambiar tema claro/oscuro"
    >
      <svg
        class="sol"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path
          d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
        />
      </svg>
      <svg
        class="luna"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
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
