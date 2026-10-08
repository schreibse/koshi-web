import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';

type Theme = 'dark' | 'light';

@Component({
  selector: 'ks-theme-toggle',
  template: `
    <button
      type="button"
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
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
      </svg>
    </button>
  `,
  styles: `
    button {
      display: grid;
      place-items: center;
      width: 2.5rem;
      height: 2.5rem;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: none;
      color: var(--text);
      cursor: pointer;
    }
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
