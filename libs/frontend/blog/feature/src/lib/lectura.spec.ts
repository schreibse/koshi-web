import { aBloques } from '@koshi/shared/blog/util';
import { minutosDeLectura } from './lectura';

describe('minutosDeLectura', () => {
  it('counts words in headings, paragraphs, lists, quotes and code', () => {
    const palabras = (n: number) => Array(n).fill('palabra').join(' ');
    const markdown = [
      `## ${palabras(50)}`,
      `${palabras(100)} **${palabras(50)}**`,
      `- ${palabras(100)}`,
      `> ${palabras(50)}`,
      '```\n' + palabras(50) + '\n```',
    ].join('\n\n');

    expect(minutosDeLectura(aBloques(markdown))).toBe(2);
  });

  it('never says zero minutes', () => {
    expect(minutosDeLectura(aBloques('Hola.'))).toBe(1);
  });
});
