import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Reveal } from '../core/reveal.directive';

/** Encabezado de sección: antetítulo, título proyectado y entradilla. */
@Component({
  selector: 'kx-section-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal],
  template: `
    <div class="wrap" [class.is-center]="align() === 'center'">
      @if (eyebrow()) {
        <span class="eyebrow" kxReveal="up">{{ eyebrow() }}</span>
      }

      <div kxReveal="up" [kxRevealDelay]="60">
        <ng-content />
      </div>

      @if (lede()) {
        <p class="lede" kxReveal="up" [kxRevealDelay]="120">{{ lede() }}</p>
      }
    </div>
  `,
  styles: `
    .wrap {
      display: flex;
      flex-direction: column;
      gap: 1.1rem;
      max-width: 46rem;
    }

    .wrap.is-center {
      align-items: center;
      text-align: center;
      margin-inline: auto;
    }

    .eyebrow {
      align-self: flex-start;
    }

    .is-center .eyebrow {
      align-self: center;
    }
  `,
})
export class SectionHeader {
  readonly eyebrow = input('');
  readonly lede = input('');
  readonly align = input<'start' | 'center'>('start');
}
