import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MouseParallax } from '../core/mouse-parallax.directive';
import { Reveal } from '../core/reveal.directive';
import { Icon } from '../ui/icon';
import { PixelSprite } from '../ui/pixel-sprite';

@Component({
  selector: 'kx-cta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, PixelSprite, Reveal, MouseParallax],
  template: `
    <div class="container">
      <div class="band card card--glass card--lit" kxReveal="scale" kxMouseParallax>
        <div class="glow" aria-hidden="true"></div>

        <span class="sprite sprite--a" data-depth="22" aria-hidden="true">
          <span class="float"><kx-pixel-sprite name="terminal" tone="teal" /></span>
        </span>
        <span class="sprite sprite--b" data-depth="34" aria-hidden="true">
          <span class="float"><kx-pixel-sprite name="star" tone="amber" /></span>
        </span>

        <p class="eyebrow">Siguiente paso</p>
        <h2 class="h2">¿Tienes un proyecto <span class="gradient-text">en mente</span>?</h2>
        <p class="lede">
          Una llamada de treinta minutos basta para saber si somos el equipo correcto. Si no lo
          somos, te lo decimos y te orientamos hacia quien sí lo sea.
        </p>

        <div class="actions">
          <a class="btn btn--primary btn--lg" href="#contacto">
            Agendar una llamada
            <kx-icon class="btn__arrow" name="arrowRight" [size]="18" />
          </a>
          <a class="btn btn--secondary btn--lg" href="#modelos">Ver modelos de trabajo</a>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      padding-block: clamp(20px, 4vw, 40px);
    }

    .band {
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.1rem;
      padding: clamp(2.5rem, 7vw, 4.5rem) clamp(1.5rem, 5vw, 3rem);
      border-radius: var(--r-xl);
      text-align: center;
      background:
        radial-gradient(70% 120% at 50% 0%, rgba(231, 168, 78, 0.16), transparent 62%),
        linear-gradient(180deg, rgba(207, 240, 234, 0.07), rgba(207, 240, 234, 0.02));
    }

    .glow {
      position: absolute;
      inset: auto -10% -60% -10%;
      height: 320px;
      background: radial-gradient(ellipse at center, rgba(62, 155, 148, 0.28), transparent 68%);
      pointer-events: none;
    }

    .h2 {
      max-width: 18ch;
    }

    .lede {
      text-align: center;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.75rem;
      margin-top: 0.75rem;
    }

    .sprite {
      position: absolute;
      width: 38px;
      opacity: 0.9;
      filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.5));
    }

    .sprite--a {
      top: 12%;
      left: 7%;
    }

    .sprite--b {
      right: 9%;
      bottom: 16%;
      width: 28px;
    }

    .float {
      display: block;
      animation: float 8s var(--ease-in-out) infinite;
    }

    .sprite--b .float {
      animation-duration: 6.5s;
      animation-delay: -2s;
    }

    @keyframes float {
      50% {
        transform: translate3d(0, -10px, 0);
      }
    }

    @media (max-width: 620px) {
      .sprite {
        display: none;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .float {
        animation: none;
      }
    }
  `,
})
export class Cta {}
