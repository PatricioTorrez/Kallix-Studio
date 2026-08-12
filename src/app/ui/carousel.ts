import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  TemplateRef,
  afterNextRender,
  contentChild,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { prefersReducedMotion } from '../core/motion';
import { Icon } from './icon';

/**
 * Carrusel apoyado en el scroll nativo con `scroll-snap`.
 *
 * El navegador ya resuelve arrastre, inercia, rebote en los extremos y
 * accesibilidad de teclado mejor que cualquier reimplementación en JS: aquí
 * solo se añaden los controles, el indicador y el avance automático.
 *
 * Plantillas que acepta por contenido:
 * - `#slide` (obligatoria) — cada diapositiva.
 * - `#thumb` (opcional) — dibuja el indicador. Sin ella, los puntos son barras.
 */
@Component({
  selector: 'kx-carousel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, Icon],
  host: {
    '(pointerenter)': 'paused.set(true)',
    '(pointerleave)': 'paused.set(false)',
    '(focusin)': 'paused.set(true)',
    '(focusout)': 'paused.set(false)',
  },
  template: `
    <div
      class="viewport"
      #viewport
      (scroll)="onScroll()"
      tabindex="0"
      role="group"
      aria-roledescription="carrusel"
      [attr.aria-label]="label()"
    >
      <div class="rail">
        @for (item of items(); track $index) {
          <div class="slide" [class.is-full]="full()">
            <ng-container
              *ngTemplateOutlet="slide(); context: { $implicit: item, index: $index }"
            />
          </div>
        }
      </div>
    </div>

    <div class="controls">
      <div class="dots" role="tablist" [attr.aria-label]="'Ir a ' + label()">
        @for (item of items(); track $index) {
          <button
            type="button"
            role="tab"
            class="dot"
            [class.is-thumb]="!!thumb()"
            [class.is-active]="$index === active()"
            [attr.aria-selected]="$index === active()"
            [attr.aria-label]="itemLabels()[$index] ?? 'Elemento ' + ($index + 1)"
            (click)="goToByUser($index)"
          >
            @if (thumb(); as template) {
              <ng-container
                *ngTemplateOutlet="template; context: { $implicit: item, index: $index }"
              />
            }
          </button>
        }
      </div>

      <div class="arrows">
        <button
          type="button"
          class="arrow"
          aria-label="Anterior"
          (click)="step(-1)"
          [disabled]="active() === 0"
        >
          <kx-icon name="chevronLeft" [size]="18" />
        </button>
        <button
          type="button"
          class="arrow"
          aria-label="Siguiente"
          (click)="step(1)"
          [disabled]="active() === items().length - 1"
        >
          <kx-icon name="chevronRight" [size]="18" />
        </button>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .viewport {
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scrollbar-width: none;
      overscroll-behavior-x: contain;
      /* El arrastre en escritorio no debe seleccionar el texto de la cita. */
      -webkit-overflow-scrolling: touch;
    }

    .viewport::-webkit-scrollbar {
      display: none;
    }

    .rail {
      display: flex;
      gap: 1.25rem;
      padding-block: 0.4rem;
    }

    .slide {
      flex: 0 0 min(560px, 88%);
      scroll-snap-align: start;
    }

    /* Una diapositiva por movimiento: sin asomo de la siguiente. */
    .slide.is-full {
      flex-basis: 100%;
    }

    /* Con miniaturas, indicador y flechas no caben en una línea por debajo de
       360 px: envuelven en vez de desbordar la página. */
    .controls {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-top: 1.75rem;
    }

    .dots {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    /* Al envolver, las flechas siguen a la derecha en lugar de saltar al margen. */
    .arrows {
      margin-left: auto;
    }

    .dot {
      width: 24px;
      height: 6px;
      padding: 0;
      border: 0;
      border-radius: var(--r-pill);
      background: var(--surface-3);
      cursor: pointer;
      transition:
        background-color var(--d-base) ease,
        transform var(--d-base) var(--ease-out);
    }

    .dot:not(.is-thumb).is-active {
      background: var(--accent);
      transform: scaleX(1.5);
      transform-origin: left;
    }

    /* Indicador con miniatura: el punto se convierte en el marco del retrato. */
    .dot.is-thumb {
      width: 40px;
      height: 40px;
      padding: 3px;
      border: 1px solid var(--stroke-strong);
      border-radius: var(--r-pill);
      background: var(--bg-raised);
      overflow: hidden;
      opacity: 0.5;
      transition:
        opacity var(--d-base) ease,
        border-color var(--d-base) ease,
        transform var(--d-base) var(--ease-out);
    }

    .dot.is-thumb.is-active {
      opacity: 1;
      border-color: var(--accent);
      transform: translate3d(0, -2px, 0);
    }

    .arrows {
      display: flex;
      flex: none;
      gap: 0.5rem;
    }

    .arrow {
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      border: 1px solid var(--stroke-strong);
      border-radius: var(--r-pill);
      background: var(--surface);
      color: var(--text-muted);
      cursor: pointer;
      transition:
        transform var(--d-press) var(--ease-out),
        background-color var(--d-base) ease,
        color var(--d-base) ease,
        opacity var(--d-base) ease;
    }

    .arrow:active {
      transform: scale(0.94);
    }

    .arrow[disabled] {
      opacity: 0.35;
      cursor: not-allowed;
    }

    @media (hover: hover) and (pointer: fine) {
      .arrow:not([disabled]):hover {
        background: var(--surface-3);
        color: var(--text);
      }

      .dot.is-thumb:hover {
        opacity: 1;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .dot.is-thumb.is-active {
        transform: none;
      }
    }
  `,
})
export class Carousel {
  readonly items = input.required<readonly unknown[]>();
  readonly label = input('Carrusel');
  /** Cada diapositiva ocupa el ancho completo, sin asomar la siguiente. */
  readonly full = input(false);
  /** Milisegundos entre avances automáticos; 0 lo desactiva. */
  readonly autoplayMs = input(0);
  /** Etiquetas accesibles del indicador, en el orden de `items`. */
  readonly itemLabels = input<readonly string[]>([]);

  protected readonly slide = contentChild.required<TemplateRef<unknown>>('slide');
  protected readonly thumb = contentChild<TemplateRef<unknown>>('thumb');
  protected readonly active = signal(0);
  /** El avance automático se detiene mientras el puntero o el foco están dentro. */
  protected readonly paused = signal(false);

  private readonly viewport = viewChild.required<ElementRef<HTMLElement>>('viewport');
  private frame = 0;
  private timer = 0;

  constructor() {
    afterNextRender(() => this.startAutoplay());
    inject(DestroyRef).onDestroy(() => {
      clearInterval(this.timer);
      cancelAnimationFrame(this.frame);
    });
  }

  protected onScroll(): void {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      const element = this.viewport().nativeElement;
      const slideWidth = this.slideWidth(element);
      if (!slideWidth) return;
      this.active.set(Math.round(element.scrollLeft / slideWidth));
    });
  }

  protected step(direction: 1 | -1): void {
    this.goToByUser(this.active() + direction);
  }

  /** Salto pedido por una persona: reinicia la cuenta para no encadenar avances. */
  protected goToByUser(index: number): void {
    this.goTo(index);
    if (this.timer) this.startAutoplay();
  }

  private goTo(index: number): void {
    const element = this.viewport().nativeElement;
    const clamped = Math.max(0, Math.min(index, this.items().length - 1));
    element.scrollTo({
      left: clamped * this.slideWidth(element),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }

  private startAutoplay(): void {
    clearInterval(this.timer);
    const every = this.autoplayMs();
    if (!every || prefersReducedMotion()) return;

    this.timer = setInterval(() => {
      // Ni con el puntero encima, ni con el foco dentro, ni con la pestaña al fondo.
      if (this.paused() || document.hidden) return;
      this.goTo((this.active() + 1) % this.items().length);
    }, every) as unknown as number;
  }

  private slideWidth(element: HTMLElement): number {
    const first = element.querySelector<HTMLElement>('.slide');
    if (!first) return 0;
    const gap = parseFloat(getComputedStyle(first.parentElement!).columnGap || '0');
    return first.offsetWidth + gap;
  }
}
