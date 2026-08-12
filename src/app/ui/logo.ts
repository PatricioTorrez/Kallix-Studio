import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Logotipo oficial, calcado de `public/imagenes/` (esos archivos siguen siendo la
 * fuente canónica: para OG, descargas o cualquier consumo externo). Tres formas:
 *
 * - `navbar`   → `logo_navbar.svg`: isotipo, barra y palabra en horizontal.
 * - `wordmark` → `logo_solo.svg` más la palabra como texto vivo.
 * - `mark`     → `logo_solo.svg` a secas.
 *
 * Va inline y no como `<img>` por dos razones. Una, el peso: son menos de 2 kB y
 * el header está sobre el pliegue, así que ahorra una petición de camino crítico.
 * Dos, y esta es la que manda: los archivos traen la palabra en crema `#eee7dd`,
 * que sobre el tema claro da 1.09:1 —invisible—. Inline, los rellenos pasan por
 * tokens (`--text`, `--logo-*`) que sí respetan el tema y la frontera `.on-dark`.
 */
@Component({
  selector: 'kx-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (variant() === 'navbar') {
      <svg class="lockup" viewBox="0 0 745.07 136" aria-hidden="true">
        <path
          d="M 18.00,18.00 L 18.00,113.74 L 24.38,118.00 L 60.55,118.00 L 33.96,88.21 L 33.96,55.23 L 59.49,28.64 L 59.49,18.00 Z"
          fill="var(--logo-teal)"
        />
        <path
          d="M 90.34,69.06 L 90.34,82.89 L 81.83,92.47 L 105.23,118.00 L 136.09,118.00 Z"
          fill="var(--logo-amber)"
        />
        <path
          d="M 61.62,61.62 L 50.98,72.26 L 50.98,75.45 L 61.62,86.09 L 62.68,86.09 L 72.26,75.45 L 72.26,72.26 Z"
          fill="var(--logo-amber)"
        />
        <path
          d="M 135.02,18.00 L 104.17,18.00 L 74.38,50.98 L 89.28,65.87 Z"
          fill="var(--logo-amber)"
        />

        <rect x="170.09" y="29" width="2.2" height="78" fill="var(--text-dim)" />

        <path
          d="M 670.35,40.50 L 692.69,68.00 L 670.35,95.50 L 680.66,95.50 L 697.85,74.88 L 715.04,95.50 L 727.07,95.50 L 682.38,40.50 Z"
          fill="var(--text)"
        />
        <path
          d="M 605.04,40.50 L 605.04,95.50 L 613.63,95.50 L 613.63,40.50 Z"
          fill="var(--text)"
        />
        <path
          d="M 508.79,40.50 L 508.79,83.47 L 512.22,90.34 L 520.82,95.50 L 548.32,95.50 L 548.32,88.62 L 525.97,88.62 L 517.38,81.75 L 517.38,40.50 Z"
          fill="var(--text)"
        />
        <path
          d="M 414.25,40.50 L 415.97,88.62 L 424.57,95.50 L 453.79,95.50 L 453.79,88.62 L 429.72,88.62 L 422.85,83.47 L 421.13,40.50 Z"
          fill="var(--text)"
        />
        <path
          d="M 326.60,40.50 L 300.82,95.50 L 311.13,95.50 L 331.75,50.81 L 352.38,93.78 L 362.69,95.50 L 338.63,42.22 Z"
          fill="var(--text)"
        />
        <path
          d="M 244.10,40.50 L 218.32,68.00 L 244.10,95.50 L 256.13,95.50 L 230.35,68.00 L 256.13,40.50 Z"
          fill="var(--text)"
        />
        <path
          d="M 206.29,40.50 L 206.29,95.50 L 214.88,95.50 L 214.88,40.50 Z"
          fill="var(--text)"
        />

        <path
          d="M 725.35,40.50 L 715.04,40.50 L 711.60,43.94 L 711.60,45.66 L 706.44,50.81 L 708.16,52.53 L 708.16,54.25 L 711.60,57.69 L 718.47,50.81 L 718.47,49.09 L 725.35,42.22 Z"
          fill="var(--logo-amber)"
        />
      </svg>
    } @else {
      <span class="mark" aria-hidden="true">
        <svg viewBox="0 0 127 110">
          <path
            d="M 8,8 L 8,98 L 14,102 L 48,102 L 23,74 L 23,43 L 47,18 L 47,8 Z"
            fill="var(--logo-teal)"
          />
          <path d="M 76,56 L 76,69 L 68,78 L 90,102 L 119,102 Z" fill="var(--logo-amber)" />
          <path
            d="M 49,49 L 39,59 L 39,62 L 49,72 L 50,72 L 59,62 L 59,59 Z"
            fill="var(--logo-amber)"
          />
          <path d="M 118,8 L 89,8 L 61,39 L 75,53 Z" fill="var(--logo-amber)" />
        </svg>
      </span>

      @if (variant() === 'wordmark') {
        <span class="word">KALLIX</span>
      }
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 0.65rem;
      color: var(--text);
    }

    /* Sin caja ni fondo: el isotipo de dos tonos se sostiene solo, y el degradado
       ámbar/turquesa que enmarcaba el pixel art anterior lo ensuciaba. El propio
       viewBox ya trae 8 unidades de aire por lado (6.3%), así que tampoco lleva
       padding: se lo daría dos veces. */
    .mark {
      display: grid;
      place-items: center;
      width: 32px;
      transition: transform var(--d-base) var(--ease-out);
    }

    .mark svg {
      display: block;
      width: 100%;
      height: auto;
    }

    /* Se mide por alto y no por ancho: el viewBox del lockup reserva 18 unidades
       de aire arriba y abajo, así que 32px de caja dejan el isotipo en ~23.5px,
       el mismo tamaño óptico que la variante suelta a 32px de ancho. */
    .lockup {
      display: block;
      height: 32px;
      width: auto;
    }

    /* El tracking va en positivo: la caja alta necesita aire entre astas, al
       revés que el -0.025em que pedía el «Kallix» en caja mixta. */
    .word {
      font-family: var(--font-display);
      font-size: 1.06rem;
      font-weight: 700;
      letter-spacing: 0.08em;
    }

    @media (hover: hover) and (pointer: fine) {
      :host(:hover) .mark {
        transform: scale(1.06) rotate(-3deg);
      }
    }
  `,
})
export class Logo {
  /** El lockup solo se inclina rotando entero, y una palabra torcida se lee como
      error de maquetación: por eso `navbar` no lleva el hover del isotipo suelto. */
  readonly variant = input<'navbar' | 'wordmark' | 'mark'>('wordmark');
}
