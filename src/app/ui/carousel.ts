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
  output,
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
 * solo se añaden los controles, el indicador y el contador de posición.
 *
 * No avanza solo: se quitó el 2026-11-18. Mover un texto mientras alguien lo
 * lee es hostil, y el asomo de la siguiente ficha ya invita a pasar.
 *
 * Plantillas que acepta por contenido:
 * - `#slide` (obligatoria) — cada diapositiva.
 * - `#thumb` (opcional) — dibuja el indicador. Sin ella, los puntos son barras.
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
      (pointerdown)="stopGlide()"
      (wheel)="stopGlide()"
      tabindex="0"
      role="region"
      aria-roledescription="carrusel"
      [attr.aria-label]="label()"
      [attr.data-dir]="direction()"
    >
      <div class="rail" [class.is-full]="full()">
        @for (item of items(); track $index) {
          <div
            class="slide kx-slide"
            [class.is-active]="$index === active()"
            role="group"
            aria-roledescription="diapositiva"
            [attr.aria-label]="$index + 1 + ' de ' + items().length"
          >
            <ng-container
              *ngTemplateOutlet="slide(); context: { $implicit: item, index: $index }"
            />
          </div>
        }
      </div>
    </div>

    <div class="controls">
      <div class="dots" role="group" [attr.aria-label]="'Ir a ' + label()">
        @for (item of items(); track $index) {
          <button
            type="button"
            class="dot"
            [class.is-thumb]="!!thumb()"
            [class.is-active]="$index === active()"
            [attr.aria-current]="$index === active() ? 'true' : null"
            [attr.aria-label]="itemLabels()[$index] ?? 'Elemento ' + ($index + 1)"
            (click)="goTo($index)"
          >
            @if (thumb(); as template) {
              <ng-container
                *ngTemplateOutlet="template; context: { $implicit: item, index: $index }"
              />
            }
          </button>
        }
      </div>

      <div class="nav">
        <!-- Dónde estás: «02 / 05». Se anuncia con cortesía al cambiar. -->
        <p class="count mono" aria-live="polite" aria-atomic="true">
          <span class="sr-only">{{ itemLabels()[active()] ?? 'Elemento' }},</span>
          <span class="count-now">{{ pad(active() + 1) }}</span>
          <span class="count-sep" aria-hidden="true">/</span>
          <span class="sr-only">de</span>
          {{ pad(items().length) }}
        </p>

        <div class="arrows">
          <button
            type="button"
            class="arrow"
            aria-label="Anterior"
            (click)="goTo(active() - 1)"
            [disabled]="active() === 0"
          >
            <kx-icon name="chevronLeft" [size]="18" />
          </button>
          <button
            type="button"
            class="arrow"
            aria-label="Siguiente"
            (click)="goTo(active() + 1)"
            [disabled]="active() === items().length - 1"
          >
            <kx-icon name="chevronRight" [size]="18" />
          </button>
        </div>
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
    }

    .viewport::-webkit-scrollbar {
      display: none;
    }

    .rail {
      --gap: 1.25rem;

      display: flex;
      gap: var(--gap);
      padding-block: 0.4rem;
    }

    /* Cada ficha deja asomar la siguiente por la derecha. Cuánto, lo decide
       quien usa el carrusel con la propiedad --peek, que cuenta desde el borde
       de una ficha hasta el de la siguiente: el asomo que se ve es --peek menos
       el hueco del riel. */
    .slide {
      flex: 0 0 calc(100% - var(--peek, 4rem));
      scroll-snap-align: start;
      /* Sin esto, una flecha pulsada dos veces rápido puede saltarse una ficha. */
      scroll-snap-stop: always;
      /* Anclada a la izquierda: la ficha que asoma conserva su canto junto al
         hueco y encoge hacia fuera, no hacia la ficha activa. */
      transform-origin: left center;
    }

    /* Antes de que el script mida: la ficha que asoma queda un plano por
       detrás. Después, \`update()\` escribe opacidad y escala en línea según la
       posición real del scroll, así que no hay transición CSS que salte. */
    .slide:not(.is-active) {
      opacity: 0.45;
      transform: scale(0.96);
    }

    /* Separador final: el hueco que le falta al riel para que la última ficha
       pueda pegarse al borde izquierdo. Sin él, el scroll se acaba antes de
       su posición de ajuste y nunca queda alineada. Mide --peek menos el
       hueco, que el riel ya pone delante del separador.

       No vale poner ese hueco como relleno del riel: el flex-basis de la ficha
       es un porcentaje y se mide contra el ancho interior del riel, así que
       el relleno se restaría dos veces y la ficha saldría corta. */
    .rail::after {
      content: '';
      flex: 0 0 max(0px, calc(var(--peek, 4rem) - var(--gap)));
    }

    /* Una diapositiva por movimiento: sin asomo de la siguiente. */
    .rail.is-full .slide {
      flex-basis: 100%;
    }

    .rail.is-full::after {
      content: none;
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

    /* Al envolver, contador y flechas siguen a la derecha. */
    .nav {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-left: auto;
    }

    /* Flex para que el espacio alrededor de la barra no dependa del espacio en
       blanco de la plantilla ni de los textos solo para lectores. */
    .count {
      display: flex;
      gap: 0.4em;
      margin: 0;
      font-size: 0.8rem;
      letter-spacing: 0.08em;
      color: var(--text-dim);
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    .count-now {
      color: var(--text);
    }

    /* El punto se ve de 24×6 pero el área táctil es de 44 px de alto. */
    .dot {
      position: relative;
      width: 24px;
      height: 44px;
      padding: 0;
      border: 0;
      background: none;
      cursor: pointer;
      touch-action: manipulation;
    }

    .dot:not(.is-thumb)::before {
      content: '';
      position: absolute;
      inset: 19px 0;
      border-radius: var(--r-pill);
      background: var(--surface-3);
      transform-origin: left;
      transition:
        background-color var(--d-base) ease,
        transform var(--d-base) var(--ease-out);
    }

    .dot:not(.is-thumb).is-active::before {
      background: var(--accent-fill);
      transform: scaleX(1.5);
    }

    /* Indicador con miniatura: el punto se convierte en el marco del retrato. */
    .dot.is-thumb {
      width: 44px;
      height: 44px;
      padding: 3px;
      border: 1px solid var(--stroke-strong);
      border-radius: var(--r-pill);
      /* Quien usa el carrusel puede dar su propio fondo con --thumb-ground. */
      background: var(--thumb-ground, var(--bg-raised));
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
      width: 44px;
      height: 44px;
      border: 1px solid var(--stroke-strong);
      border-radius: var(--r-pill);
      background: var(--surface);
      color: var(--text-muted);
      cursor: pointer;
      touch-action: manipulation;
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
      .slide:not(.is-active) {
        transform: none;
      }

      .dot.is-thumb.is-active {
        transform: none;
      }
    }
  `,
})
export class Carousel {
  readonly items = input.required<readonly unknown[]>();
  readonly label = input('Carrusel');
  /**
   * Cada diapositiva ocupa el ancho completo, sin asomar la siguiente. Por
   * omisión asoma: el ancho del asomo se ajusta con la propiedad `--peek`
   * desde quien usa el carrusel.
   */
  readonly full = input(false);
  /** Etiquetas accesibles del indicador, en el orden de `items`. */
  readonly itemLabels = input<readonly string[]>([]);
  /** Índice de la diapositiva que pasa a estar activa, por scroll, flecha o indicador. */
  readonly activeChange = output<number>();

  protected readonly slide = contentChild.required<TemplateRef<unknown>>('slide');
  protected readonly thumb = contentChild<TemplateRef<unknown>>('thumb');
  protected readonly active = signal(0);
  /** Hacia dónde se avanzó por última vez: el texto entra desde ese lado. */
  protected readonly direction = signal<'next' | 'prev'>('next');

  private readonly viewport = viewChild.required<ElementRef<HTMLElement>>('viewport');
  private frame = 0;
  private glideFrame = 0;
  private fade?: Animation;

  constructor() {
    afterNextRender(() => this.update());
    inject(DestroyRef).onDestroy(() => {
      cancelAnimationFrame(this.frame);
      cancelAnimationFrame(this.glideFrame);
    });
  }

  protected pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  protected onScroll(): void {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.update();
    });
  }

  protected goTo(index: number): void {
    const element = this.viewport().nativeElement;
    const left = this.clamp(index) * this.slideWidth(element);
    if (!prefersReducedMotion()) {
      this.glide(element, left);
      return;
    }
    // Sin desplazamiento visible, pero tampoco un salto seco: fundido cruzado.
    // Animación web y no CSS, porque la regla global de movimiento reducido
    // acorta toda animación CSS a 0.01 ms.
    this.fade?.cancel();
    const out = element.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 140,
      easing: 'ease-out',
      fill: 'forwards',
    });
    this.fade = out;
    out.onfinish = () => {
      element.scrollTo({ left, behavior: 'auto' });
      out.cancel();
      this.fade = element.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 260,
        easing: 'ease-out',
      });
    };
  }

  /** Una persona tomó el control (dedo, rueda): el deslizamiento cede al instante. */
  protected stopGlide(): void {
    if (!this.glideFrame) return;
    cancelAnimationFrame(this.glideFrame);
    this.glideFrame = 0;
    this.viewport().nativeElement.style.scrollSnapType = '';
  }

  /**
   * Desplazamiento animado propio. `scrollTo({ behavior: 'smooth' })` no sirve:
   * Chrome en Windows lo vuelve un salto seco cuando los efectos de animación
   * del sistema están apagados, aunque la página no pida movimiento reducido.
   * El snap se suspende mientras dura: con `mandatory`, cada `scrollLeft`
   * intermedio se reajustaría a la ficha más cercana.
   */
  private glide(element: HTMLElement, to: number): void {
    this.stopGlide();
    const from = element.scrollLeft;
    if (Math.abs(to - from) < 1) return;
    const duration = 520;
    const start = performance.now();
    element.style.scrollSnapType = 'none';
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out quart: arranca rápido y se posa suave, como --ease-out.
      element.scrollLeft = from + (to - from) * (1 - (1 - t) ** 4);
      if (t < 1) {
        this.glideFrame = requestAnimationFrame(tick);
        return;
      }
      this.glideFrame = 0;
      element.style.scrollSnapType = '';
    };
    this.glideFrame = requestAnimationFrame(tick);
  }

  /** Activa la ficha más cercana y pinta la profundidad de todas según el scroll. */
  private update(): void {
    const element = this.viewport().nativeElement;
    // Lecturas primero, escrituras después: un solo cálculo de estilo por fotograma.
    const slideWidth = this.slideWidth(element);
    if (!slideWidth) return;
    const position = element.scrollLeft / slideWidth;
    const slides = element.querySelectorAll<HTMLElement>('.slide');
    const reduced = prefersReducedMotion();

    slides.forEach((slide, i) => {
      // 0 en su sitio, 1 a una ficha de distancia o más.
      const distance = Math.min(1, Math.abs(i - position));
      slide.style.opacity = String(1 - 0.55 * distance);
      slide.style.transform = reduced ? '' : `scale(${1 - 0.04 * distance})`;
    });

    // Acotado: el rebote elástico de iOS puede dar un scrollLeft fuera de rango.
    const index = this.clamp(Math.round(position));
    if (index === this.active()) return;
    this.direction.set(index > this.active() ? 'next' : 'prev');
    this.active.set(index);
    this.activeChange.emit(index);
  }

  private clamp(index: number): number {
    return Math.max(0, Math.min(index, this.items().length - 1));
  }

  private slideWidth(element: HTMLElement): number {
    const first = element.querySelector<HTMLElement>('.slide');
    if (!first) return 0;
    const gap = parseFloat(getComputedStyle(first.parentElement!).columnGap || '0');
    return first.offsetWidth + gap;
  }
}
