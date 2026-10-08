import { Component } from '@angular/core';
import { LanguageSwitch } from './language-switch';
import { ThemeToggle } from './theme-toggle';
import { Wordmark } from './wordmark';

@Component({
  selector: 'ks-site-header',
  imports: [Wordmark, LanguageSwitch, ThemeToggle],
  template: `
    <div class="container bar">
      <a href="./" class="home" aria-label="Koshisoftware"><ks-wordmark /></a>
      <nav>
        <a href="#servicios" i18n="@@nav.services">Servicios</a>
        <a href="#proyectos" i18n="@@nav.work">Proyectos</a>
        <a href="#nosotros" i18n="@@nav.about">Nosotros</a>
        <a href="#contacto" class="button button--primary" i18n="@@nav.contact"
          >Hablemos</a
        >
      </nav>
      <div class="tools">
        <ks-language-switch />
        <ks-theme-toggle />
      </div>
    </div>
  `,
  styles: `
    :host {
      position: sticky;
      top: 0;
      z-index: 10;
      display: block;
      background: var(--bg);
      border-bottom: 1px solid var(--line);
    }
    .bar {
      display: flex;
      align-items: center;
      gap: 2rem;
      min-height: 4.5rem;
    }
    .home {
      color: var(--text);
      text-decoration: none;
    }
    nav {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-left: auto;
      a:not(.button) {
        color: var(--muted);
        text-decoration: none;
        &:hover {
          color: var(--text);
        }
      }
    }
    .tools {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    @media (max-width: 48rem) {
      nav a:not(.button) {
        display: none;
      }
      .bar {
        gap: 1rem;
      }
    }
    @media (max-width: 30rem) {
      nav {
        display: none;
      }
      .tools {
        margin-left: auto;
      }
    }
  `,
})
export class SiteHeader {}
