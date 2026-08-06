import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  TemplateRef,
  contentChild,
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
 * solo se añaden los controles y el indicador.
 */
@Component({
  selector: 'kx-carousel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, Icon],
  template: `
    <div
      class="viewport"
      #viewport
      (scroll)="onScroll()"
      tabindex="0"
      role="group"
      [attr.aria-label]="label()"
    >
      <div class="rail">
        @for (item of items(); track $index) {
          <div class="slide">
            <ng-container *ngTemplateOutlet="slide(); context: { $implicit: item, index: $index }" />
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
            [class.is-active]="$index === active()"
            [attr.aria-selected]="$index === active()"
            [attr.aria-label]="'Elemento ' + ($index + 1)"
            (click)="goTo($index)"
          ></button>
        }
      </div>

      <div class="arrows">
        <button type="button" class="arrow" aria-label="Anterior" (click)="step(-1)" [disabled]="active() === 0">
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

    .controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-top: 1.75rem;
    }

    .dots {
      display: flex;
      gap: 0.5rem;
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

    .dot.is-active {
      background: var(--accent);
      transform: scaleX(1.5);
      transform-origin: left;
    }

    .arrows {
      display: flex;
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
    }
  `,
})
export class Carousel {
  readonly items = input.required<readonly unknown[]>();
  readonly label = input('Carrusel');

  protected readonly slide = contentChild.required<TemplateRef<unknown>>('slide');
  protected readonly active = signal(0);

  private readonly viewport = viewChild.required<ElementRef<HTMLElement>>('viewport');
  private frame = 0;

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
    this.goTo(this.active() + direction);
  }

  protected goTo(index: number): void {
    const element = this.viewport().nativeElement;
    const clamped = Math.max(0, Math.min(index, this.items().length - 1));
    element.scrollTo({
      left: clamped * this.slideWidth(element),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }

  private slideWidth(element: HTMLElement): number {
    const first = element.querySelector<HTMLElement>('.slide');
    if (!first) return 0;
    const gap = parseFloat(getComputedStyle(first.parentElement!).columnGap || '0');
    return first.offsetWidth + gap;
  }
}
