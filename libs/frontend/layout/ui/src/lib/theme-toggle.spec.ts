import { TestBed } from '@angular/core/testing';
import { ThemeToggle } from './theme-toggle';

describe('ThemeToggle', () => {
  const root = document.documentElement;

  beforeEach(() => {
    delete root.dataset['theme'];
    localStorage.clear();
  });

  function click(): void {
    const fixture = TestBed.createComponent(ThemeToggle);
    (fixture.nativeElement as HTMLElement).querySelector('button')?.click();
  }

  it('switches from the dark default to light and remembers it', () => {
    click();
    expect(root.dataset['theme']).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('switches back to dark', () => {
    root.dataset['theme'] = 'light';
    click();
    expect(root.dataset['theme']).toBe('dark');
  });
});
