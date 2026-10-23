import { Lexer, type Token, type Tokens } from 'marked';

/** Inline content a post may contain; anything else in the Markdown ends up as plain text. */
export type Linea =
  | { tipo: 'texto'; texto: string }
  | { tipo: 'negrita' | 'cursiva'; hijos: Linea[] }
  | { tipo: 'codigo'; texto: string }
  | { tipo: 'enlace'; href: string; hijos: Linea[] }
  | { tipo: 'salto' };

/** Block content a post may contain. */
export type Bloque =
  | { tipo: 'titulo'; nivel: 2 | 3; hijos: Linea[] }
  | { tipo: 'parrafo'; hijos: Linea[] }
  | { tipo: 'lista'; ordenada: boolean; items: Linea[][] }
  | { tipo: 'codigo'; lenguaje: string; texto: string }
  | { tipo: 'cita'; hijos: Bloque[] }
  | { tipo: 'imagen'; src: string; alt: string };

// Only absolute https URLs and paths on this site; javascript:, data: and the like stay text.
const URL_PERMITIDA = /^(https:\/\/|\/(?!\/))/;

export function aBloques(markdown: string): Bloque[] {
  return bloques(new Lexer().lex(markdown));
}

function bloques(tokens: Token[]): Bloque[] {
  return tokens.flatMap((token): Bloque[] => {
    switch (token.type) {
      case 'space':
      case 'hr':
        return [];
      case 'heading': {
        const { depth, tokens: hijos = [] } = token as Tokens.Heading;
        return [
          {
            tipo: 'titulo',
            nivel: depth <= 2 ? 2 : 3,
            hijos: lineas(hijos),
          },
        ];
      }
      case 'paragraph': {
        const hijos = (token as Tokens.Paragraph).tokens ?? [];
        const [solo] = hijos;
        if (hijos.length === 1 && solo.type === 'image') {
          const { href, text } = solo as Tokens.Image;
          if (URL_PERMITIDA.test(href)) {
            return [{ tipo: 'imagen', src: href, alt: text }];
          }
        }
        return [{ tipo: 'parrafo', hijos: lineas(hijos) }];
      }
      case 'list': {
        const { ordered, items } = token as Tokens.List;
        return [
          {
            tipo: 'lista',
            ordenada: ordered,
            items: items.map((item) => lineas(aplanar(item.tokens))),
          },
        ];
      }
      case 'code': {
        const { lang = '', text } = token as Tokens.Code;
        return [{ tipo: 'codigo', lenguaje: lang.split(/\s/)[0], texto: text }];
      }
      case 'blockquote':
        return [
          { tipo: 'cita', hijos: bloques((token as Tokens.Blockquote).tokens) },
        ];
      default:
        return [{ tipo: 'parrafo', hijos: [texto(token.raw.trim())] }];
    }
  });
}

/** A list item's paragraphs and nested lists, flattened to its inline content. */
function aplanar(tokens: Token[]): Token[] {
  return tokens.flatMap((token) => {
    if (token.type === 'text' && 'tokens' in token && token.tokens) {
      return token.tokens;
    }
    if (token.type === 'paragraph') return (token as Tokens.Paragraph).tokens;
    return [token];
  });
}

function lineas(tokens: Token[]): Linea[] {
  return tokens.flatMap((token): Linea | Linea[] => {
    switch (token.type) {
      case 'text':
        return 'tokens' in token && token.tokens
          ? lineas(token.tokens)
          : texto(token.text);
      case 'escape':
        return texto((token as Tokens.Escape).text);
      case 'strong':
        return {
          tipo: 'negrita',
          hijos: lineas((token as Tokens.Strong).tokens),
        };
      case 'em':
        return { tipo: 'cursiva', hijos: lineas((token as Tokens.Em).tokens) };
      case 'codespan':
        return { tipo: 'codigo', texto: (token as Tokens.Codespan).text };
      case 'br':
        return { tipo: 'salto' };
      case 'link': {
        const { href, tokens: hijos } = token as Tokens.Link;
        return URL_PERMITIDA.test(href)
          ? { tipo: 'enlace', href, hijos: lineas(hijos) }
          : texto(token.raw);
      }
      default:
        return texto(token.raw);
    }
  });
}

function texto(value: string): Linea {
  return { tipo: 'texto', texto: value };
}
