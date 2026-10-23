/** Twice the post column (48rem minus 2 × 2.5rem padding in blog-post.ts), for 2× screens. */
export const ANCHO_MAXIMO = 1376;

/** The picked file as one WebP no wider than the post column needs, with its final size. */
export async function prepararImagen(
  archivo: Blob,
): Promise<{ archivo: Blob; ancho: number; alto: number }> {
  const bitmap = await createImageBitmap(archivo);
  const escala = Math.min(1, ANCHO_MAXIMO / bitmap.width);
  const ancho = Math.round(bitmap.width * escala);
  const alto = Math.round(bitmap.height * escala);
  const lienzo = new OffscreenCanvas(ancho, alto);
  const contexto = lienzo.getContext('2d');
  if (!contexto) throw new Error('No 2D canvas in this browser.');
  contexto.drawImage(bitmap, 0, 0, ancho, alto);
  bitmap.close();
  // A browser that cannot encode WebP falls back to PNG, which the Worker accepts too.
  const webp = await lienzo.convertToBlob({
    type: 'image/webp',
    quality: 0.82,
  });
  return { archivo: webp, ancho, alto };
}
