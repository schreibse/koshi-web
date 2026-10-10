import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  LOCALE_ID,
  afterNextRender,
  inject,
  model,
} from '@angular/core';

interface Turnstile {
  render(
    element: HTMLElement,
    options: {
      sitekey: string;
      language: string;
      theme: string;
      callback: (token: string) => void;
      'expired-callback': () => void;
      'error-callback': () => void;
    },
  ): string;
  reset(widget: string): void;
}

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

const SCRIPT =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const SITE_KEY = '0x4AAAAAAFTUjiQYFeIJSGcF';
// Cloudflare's test key, which always passes: the real one rejects localhost.
const SITE_KEY_LOCAL = '1x00000000000000000000AA';

/** Cloudflare Turnstile; `token` holds the current single-use token. */
@Component({
  selector: 'ks-verificacion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block min-h-[65px]' },
  template: '',
})
export class Verificacion {
  readonly token = model<string | null>(null);

  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly locale = inject(LOCALE_ID);
  private widget?: string;

  constructor() {
    // Blocked script: the token stays null and submitting says so.
    afterNextRender(() =>
      this.cargar().then(
        (turnstile) => this.pintar(turnstile),
        () => undefined,
      ),
    );
  }

  reset(): void {
    this.token.set(null);
    if (this.widget !== undefined)
      this.document.defaultView?.turnstile?.reset(this.widget);
  }

  private cargar(): Promise<Turnstile> {
    const window = this.document.defaultView!;
    if (window.turnstile) return Promise.resolve(window.turnstile);
    return new Promise((resolve, reject) => {
      const script = this.document.createElement('script');
      script.src = SCRIPT;
      script.async = true;
      script.onload = () => resolve(window.turnstile!);
      script.onerror = reject;
      this.document.head.append(script);
    });
  }

  private pintar(turnstile: Turnstile): void {
    const local = this.document.location.hostname === 'localhost';
    this.widget = turnstile.render(this.host.nativeElement, {
      sitekey: local ? SITE_KEY_LOCAL : SITE_KEY,
      language: this.locale,
      theme: this.document.documentElement.dataset['theme'] ?? 'auto',
      callback: (token) => this.token.set(token),
      'expired-callback': () => this.token.set(null),
      'error-callback': () => this.token.set(null),
    });
  }
}
