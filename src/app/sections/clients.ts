import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Reveal } from '../core/reveal.directive';
import { CLIENT_LOGOS } from '../data/kallix.data';
import { Marquee } from '../ui/marquee';

@Component({
  selector: 'kx-clients',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Marquee, Reveal],
  template: `
    <div class="strip" kxReveal="up">
      <p class="label mono">Producto entregado para</p>
      <kx-marquee [items]="logos" />
    </div>
  `,
  styles: `
    :host {
      display: block;
      padding-block: clamp(28px, 4vw, 44px);
      border-block: 1px solid var(--stroke);
      background: linear-gradient(180deg, rgba(207, 240, 234, 0.02), transparent);
    }

    .strip {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .label {
      text-align: center;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--text-dim);
    }
  `,
})
export class Clients {
  protected readonly logos = CLIENT_LOGOS;
}
