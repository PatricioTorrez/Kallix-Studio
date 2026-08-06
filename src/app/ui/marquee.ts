import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Cinta en movimiento continuo. La lista se duplica para que el bucle no tenga
 * salto; la copia queda fuera del árbol de accesibilidad.
 */
@Component({
  selector: 'kx-marquee',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="viewport">
      <ul class="track" [style.animation-duration.s]="duration()">
        @for (item of items(); track item) {
          <li>{{ item }}</li>
        }
      </ul>
      <ul class="track" [style.animation-duration.s]="duration()" aria-hidden="true">
        @for (item of items(); track item) {
          <li>{{ item }}</li>
        }
      </ul>
    </div>
  `,
  styles: `
    :host {
      display: block;
      overflow: hidden;
      mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
      -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
    }

    .viewport {
      display: flex;
      width: max-content;
    }

    .track {
      display: flex;
      align-items: center;
      gap: clamp(2rem, 5vw, 4rem);
      padding-inline: clamp(1rem, 2.5vw, 2rem);
      margin: 0;
      /* Movimiento constante: lineal es la curva correcta. */
      animation: marquee linear infinite;
      will-change: transform;
    }

    li {
      font-family: var(--font-display);
      font-size: clamp(1.05rem, 2vw, 1.4rem);
      font-weight: 600;
      letter-spacing: -0.02em;
      color: var(--text-dim);
      white-space: nowrap;
      transition: color var(--d-base) ease;
    }

    @media (hover: hover) and (pointer: fine) {
      :host(:hover) .track {
        animation-play-state: paused;
      }

      li:hover {
        color: var(--accent-cool);
      }
    }

    @keyframes marquee {
      to {
        transform: translate3d(-100%, 0, 0);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .track {
        animation: none;
      }

      .viewport {
        width: 100%;
        overflow-x: auto;
      }

      .track[aria-hidden='true'] {
        display: none;
      }
    }
  `,
})
export class Marquee {
  readonly items = input.required<readonly string[]>();
  readonly duration = input(34);
}
