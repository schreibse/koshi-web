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

export interface Verificacion {
  /** The current single-use token, or null. */
  token(): string | null;
  reset(): void;
}

/** Renders Cloudflare Turnstile into `element`. */
export function verificacion(element: HTMLElement): Verificacion {
  let token: string | null = null;
  let widget: string | undefined;
  // Blocked script: the token stays null and submitting says so.
  cargar().then(
    (turnstile) => {
      widget = turnstile.render(element, {
        sitekey: location.hostname === 'localhost' ? SITE_KEY_LOCAL : SITE_KEY,
        language: document.documentElement.lang,
        theme: document.documentElement.dataset['theme'] ?? 'auto',
        callback: (nuevo) => (token = nuevo),
        'expired-callback': () => (token = null),
        'error-callback': () => (token = null),
      });
    },
    () => undefined,
  );
  return {
    token: () => token,
    reset() {
      token = null;
      if (widget !== undefined) window.turnstile?.reset(widget);
    },
  };
}

function cargar(): Promise<Turnstile> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT;
    script.async = true;
    script.onload = () => resolve(window.turnstile!);
    script.onerror = reject;
    document.head.append(script);
  });
}
