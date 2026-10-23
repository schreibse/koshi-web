import { Lexer, type Token, type Tokens } from 'marked';
import { RUTA_IMAGEN, URL_PERMITIDA } from './bloques';

/**
 * What in a post's Markdown falls outside the blocks a post may contain, one message per node.
 * Saving rejects these; rendering would show them as plain text.
 */
export function validar(markdown: string): string[] {
  return bloques(new Lexer().lex(markdown));
}

function bloques(tokens: Token[]): string[] {
  return tokens.flatMap((token): string[] => {
    switch (token.type) {
      case 'space':
      case 'code':
        return [];
      case 'heading': {
        const { depth, tokens: hijos = [] } = token as Tokens.Heading;
        return depth === 2 || depth === 3
          ? lineas(hijos)
          : [`Only ## and ### headings are allowed: ${cita(token)}`];
      }
      case 'paragraph': {
        const hijos = (token as Tokens.Paragraph).tokens ?? [];
        const [solo] = hijos;
        if (hijos.length === 1 && solo.type === 'image') {
          const { href, text } = solo as Tokens.Image;
          if (!RUTA_IMAGEN.test(href)) {
            return [`Images must be uploaded ones (/media/…): ${cita(solo)}`];
          }
          return text.trim() ? [] : [`Images need alt text: ${cita(solo)}`];
        }
        return lineas(hijos);
      }
      case 'list':
        return (token as Tokens.List).items.flatMap(item);
      case 'blockquote':
        return bloques((token as Tokens.Blockquote).tokens);
      default:
        return [`Not allowed (${token.type}): ${cita(token)}`];
    }
  });
}

function item(token: Tokens.ListItem): string[] {
  if (token.task) return [`Task lists are not allowed: ${cita(token)}`];
  return token.tokens.flatMap((hijo): string[] => {
    if (hijo.type === 'space') return [];
    if (hijo.type === 'text' || hijo.type === 'paragraph') {
      return lineas((hijo as Tokens.Text).tokens ?? []);
    }
    return [`Only text is allowed in a list item: ${cita(hijo)}`];
  });
}

function lineas(tokens: Token[]): string[] {
  return tokens.flatMap((token): string[] => {
    switch (token.type) {
      case 'text':
        return 'tokens' in token && token.tokens ? lineas(token.tokens) : [];
      case 'escape':
      case 'codespan':
      case 'br':
        return [];
      case 'strong':
      case 'em':
        return lineas((token as Tokens.Strong | Tokens.Em).tokens);
      case 'link': {
        const { href, tokens: hijos } = token as Tokens.Link;
        return URL_PERMITIDA.test(href)
          ? lineas(hijos)
          : [`Links must be https:// or a path on this site: ${cita(token)}`];
      }
      case 'image':
        return [`An image needs a paragraph of its own: ${cita(token)}`];
      default:
        return [`Not allowed (${token.type}): ${cita(token)}`];
    }
  });
}

function cita(token: Token): string {
  const raw = token.raw.trim().replace(/\s+/g, ' ');
  return raw.length > 60 ? `${raw.slice(0, 57)}…` : raw;
}
