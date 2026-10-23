import { Injectable } from '@angular/core';
import type {
  Articulo,
  Ficha,
  Imagen,
  Problema,
  Textos,
} from '@koshi/shared/blog/util';

/** What a failed call returns: the save problems the Worker found, or one message. */
export class ErrorApi extends Error {
  constructor(
    readonly status: number,
    readonly problemas: Problema[],
  ) {
    super(problemas.map((p) => p.mensaje).join(' '));
  }
}

/** The Worker's /api/admin; Access has already logged the user in for this origin. */
@Injectable({ providedIn: 'root' })
export class Api {
  fichas(): Promise<Ficha[]> {
    return pedir('articulos');
  }

  crear(): Promise<Articulo> {
    return pedir('articulos', { method: 'POST' });
  }

  leer(id: number): Promise<Articulo> {
    return pedir(`articulos/${id}`);
  }

  guardar(id: number, textos: Textos): Promise<Articulo> {
    return pedir(`articulos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ textos }),
    });
  }

  publicar(id: number, publicar: boolean): Promise<Articulo> {
    return pedir(`articulos/${id}/${publicar ? 'publicar' : 'despublicar'}`, {
      method: 'POST',
    });
  }

  subir(archivo: Blob, ancho: number, alto: number): Promise<Imagen> {
    return pedir(`imagenes?ancho=${ancho}&alto=${alto}`, {
      method: 'POST',
      headers: { 'Content-Type': archivo.type },
      body: archivo,
    });
  }
}

async function pedir<T>(ruta: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/admin/${ruta}`, init);
  const cuerpo = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ErrorApi(
      res.status,
      cuerpo?.problemas ?? [
        { mensaje: cuerpo?.mensaje ?? `Request failed (${res.status}).` },
      ],
    );
  }
  return cuerpo as T;
}
