import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Reveal } from '../core/reveal.directive';
import { GAMES } from '../data/kallix.data';
import { Badge } from '../ui/badge';
import { Icon } from '../ui/icon';
import { PixelSprite } from '../ui/pixel-sprite';

/**
 * Presentación de la división, no su catálogo: eso vivirá en su propio sitio.
 * Va en `.on-dark` en ambos temas porque lo oscuro es su dirección artística.
 */
@Component({
  selector: 'kx-games',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Badge, Icon, PixelSprite, Reveal],
  host: { class: 'on-dark' },
  template: `
    <section class="section" id="games" aria-labelledby="games-title">
      <div class="vignette" aria-hidden="true"></div>

      <div class="container layout">
        <div class="copy">
          <span class="eyebrow" kxReveal="up">{{ games.name }}</span>
          <h2 class="h2" id="games-title" kxReveal="up" [kxRevealDelay]="60">
            {{ games.title }} <span class="gradient-text">{{ games.titleAccent }}</span
            >.
          </h2>
          <p class="lede" kxReveal="up" [kxRevealDelay]="120">{{ games.lede }}</p>

          <div class="cta" kxReveal="up" [kxRevealDelay]="180">
            @if (games.externalUrl; as url) {
              <a class="btn btn--secondary btn--lg" [href]="url" target="_blank" rel="noopener">
                {{ games.cta }}
                <kx-icon name="arrowUpRight" [size]="18" />
              </a>
            } @else {
              <button
                type="button"
                class="btn btn--secondary btn--lg"
                disabled
                aria-describedby="games-soon"
              >
                {{ games.cta }}
                <kx-icon name="arrowUpRight" [size]="18" />
              </button>
              <p class="soon mono" id="games-soon">{{ games.soon }}</p>
            }
          </div>
        </div>

        <article class="card featured" kxReveal="scale" [kxRevealDelay]="120">
          <span class="sprite" aria-hidden="true">
            <kx-pixel-sprite name="heart" tone="rust" />
          </span>
          <kx-badge tone="amber" [dot]="true">{{ games.featured.status }}</kx-badge>
          <h3 class="title" translate="no">
            {{ games.featured.name }}
            <span class="subtitle">{{ games.featured.subtitle }}</span>
          </h3>
          <p class="meta mono">{{ games.featured.meta }}</p>
        </article>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .section {
      overflow: hidden;
    }

    /* Luz baja y cerrada: la sección se lee como una escena, no como otra tarjeta. */
    .vignette {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(60% 70% at 80% 60%, rgba(217, 108, 44, 0.14), transparent 70%),
        radial-gradient(120% 90% at 50% 120%, rgba(0, 0, 0, 0.55), transparent 60%);
      pointer-events: none;
    }

    .layout {
      position: relative;
      display: grid;
      gap: clamp(2rem, 5vw, 4rem);
      align-items: center;
    }

    @media (min-width: 900px) {
      .layout {
        grid-template-columns: 1.1fr 0.9fr;
      }
    }

    .copy {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 1.1rem;
    }

    .cta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem 1rem;
      margin-top: 0.5rem;
    }

    /* Sin hover ni pulsación: el estilo de .btn haría creer que funciona. */
    .btn:disabled {
      opacity: 0.55;
      pointer-events: none;
    }

    .soon {
      margin: 0;
      color: var(--text-dim);
      font-size: 0.8rem;
    }

    .featured {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-end;
      gap: 0.9rem;
      min-height: clamp(16rem, 30vw, 22rem);
      padding: clamp(20px, 3vw, 36px);
      background:
        linear-gradient(180deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.45)), var(--bg-raised);
    }

    .sprite {
      position: absolute;
      top: clamp(20px, 3vw, 36px);
      right: clamp(20px, 3vw, 36px);
      width: 44px;
      opacity: 0.85;
    }

    .title {
      margin: 0;
      font-family: var(--font-display);
      font-size: clamp(1.75rem, 3.5vw, 2.5rem);
      line-height: 1.05;
      letter-spacing: -0.03em;
    }

    .subtitle {
      display: block;
      color: var(--text-muted);
      font-weight: 500;
    }

    .meta {
      margin: 0;
      color: var(--text-dim);
      font-size: 0.82rem;
    }
  `,
})
export class Games {
  protected readonly games = GAMES;
}
