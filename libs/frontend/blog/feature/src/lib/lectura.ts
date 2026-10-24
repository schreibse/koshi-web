import type { Bloque, Linea } from '@koshi/shared/blog/util';

const PALABRAS_POR_MINUTO = 200;

/** Whole minutes to read a post's text, at least one. */
export function minutosDeLectura(bloques: Bloque[]): number {
  const palabras = bloques
    .map(textoDe)
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(palabras / PALABRAS_POR_MINUTO));
}

function textoDe(bloque: Bloque): string {
  switch (bloque.tipo) {
    case 'titulo':
    case 'parrafo':
      return bloque.hijos.map(lineaATexto).join('');
    case 'lista':
      return bloque.items
        .map((item) => item.map(lineaATexto).join(''))
        .join(' ');
    case 'codigo':
      return bloque.texto;
    case 'cita':
      return bloque.hijos.map(textoDe).join(' ');
    case 'imagen':
      return '';
  }
}

function lineaATexto(linea: Linea): string {
  switch (linea.tipo) {
    case 'texto':
    case 'codigo':
      return linea.texto;
    case 'negrita':
    case 'cursiva':
    case 'enlace':
      return linea.hijos.map(lineaATexto).join('');
    case 'salto':
      return ' ';
  }
}
