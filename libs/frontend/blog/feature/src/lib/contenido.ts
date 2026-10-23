import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Bloque } from '@koshi/shared/blog/util';

/** A post body, built from its blocks element by element; nothing goes through innerHTML. */
@Component({
  selector: 'ks-contenido',
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
      font-size: 1.125rem;
      line-height: 1.75;
    }
    h2 {
      margin: 2.5rem 0 1rem;
      font-size: 1.875rem;
    }
    h3 {
      margin: 2rem 0 0.75rem;
      font-size: 1.375rem;
    }
    pre {
      overflow-x: auto;
      padding: 1rem 1.25rem;
      border-radius: 0.5rem;
      background: var(--color-surface);
      font-size: 0.9375rem;
      line-height: 1.6;
    }
    blockquote {
      margin: 1.5rem 0;
      padding-left: 1.25rem;
      border-left: 2px solid var(--color-line);
      color: var(--color-muted);
    }
    img {
      max-width: 100%;
      height: auto;
      border-radius: 0.5rem;
    }
  `,
  template: `
    <ng-template #bloquesTpl let-lista>
      @for (bloque of $any(lista); track $index) {
        @switch (bloque.tipo) {
          @case ('titulo') {
            @if (bloque.nivel === 2) {
              <h2>
                <ng-container
                  *ngTemplateOutlet="
                    lineasTpl;
                    context: { $implicit: bloque.hijos }
                  "
                />
              </h2>
            } @else {
              <h3>
                <ng-container
                  *ngTemplateOutlet="
                    lineasTpl;
                    context: { $implicit: bloque.hijos }
                  "
                />
              </h3>
            }
          }
          @case ('parrafo') {
            <p>
              <ng-container
                *ngTemplateOutlet="
                  lineasTpl;
                  context: { $implicit: bloque.hijos }
                "
              />
            </p>
          }
          @case ('lista') {
            @if (bloque.ordenada) {
              <ol>
                @for (item of bloque.items; track $index) {
                  <li>
                    <ng-container
                      *ngTemplateOutlet="
                        lineasTpl;
                        context: { $implicit: item }
                      "
                    />
                  </li>
                }
              </ol>
            } @else {
              <ul>
                @for (item of bloque.items; track $index) {
                  <li>
                    <ng-container
                      *ngTemplateOutlet="
                        lineasTpl;
                        context: { $implicit: item }
                      "
                    />
                  </li>
                }
              </ul>
            }
          }
          @case ('codigo') {
            <pre><code [attr.data-lenguaje]="bloque.lenguaje || null">{{ bloque.texto }}</code></pre>
          }
          @case ('cita') {
            <blockquote>
              <ng-container
                *ngTemplateOutlet="
                  bloquesTpl;
                  context: { $implicit: bloque.hijos }
                "
              />
            </blockquote>
          }
          @case ('imagen') {
            <img
              [src]="bloque.src"
              [alt]="bloque.alt"
              [attr.width]="bloque.ancho ?? null"
              [attr.height]="bloque.alto ?? null"
              loading="lazy"
            />
          }
        }
      }
    </ng-template>

    <ng-template #lineasTpl let-lista>
      @for (linea of $any(lista); track $index) {
        @switch (linea.tipo) {
          <!-- Bare text here would carry the template's indentation as spaces. -->
          @case ('texto') {
            <ng-container>{{ linea.texto }}</ng-container>
          }
          @case ('negrita') {
            <strong
              ><ng-container
                *ngTemplateOutlet="
                  lineasTpl;
                  context: { $implicit: linea.hijos }
                "
            /></strong>
          }
          @case ('cursiva') {
            <em
              ><ng-container
                *ngTemplateOutlet="
                  lineasTpl;
                  context: { $implicit: linea.hijos }
                "
            /></em>
          }
          @case ('codigo') {
            <code>{{ linea.texto }}</code>
          }
          @case ('enlace') {
            <a [href]="linea.href"
              ><ng-container
                *ngTemplateOutlet="
                  lineasTpl;
                  context: { $implicit: linea.hijos }
                "
            /></a>
          }
          @case ('salto') {
            <br />
          }
        }
      }
    </ng-template>

    <ng-container
      *ngTemplateOutlet="bloquesTpl; context: { $implicit: bloques() }"
    />
  `,
})
export class Contenido {
  readonly bloques = input.required<Bloque[]>();
}
