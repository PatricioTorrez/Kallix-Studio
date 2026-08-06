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
      /* El color va antes del degradado: los estilos de componente llegan
         después que los globales, así que este background gana al de .on-dark
         y sin la base la franja quedaría transparente sobre el body. */
      background: var(--bg) linear-gradient(180deg, rgba(var(--veil), 0.02), transparent);
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
