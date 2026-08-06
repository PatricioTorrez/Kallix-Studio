import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CountUp } from '../core/count-up.directive';
import { Reveal } from '../core/reveal.directive';
import { STATS } from '../data/kallix.data';

@Component({
  selector: 'kx-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CountUp, Reveal],
  template: `
    <div class="band">
      <div class="grid-bg" aria-hidden="true"></div>

      <div class="container">
        <dl class="grid">
          @for (stat of stats; track stat.label) {
            <div class="stat" kxReveal="up" [kxRevealDelay]="$index * 60">
              <dt
                class="value"
                [kxCountUp]="stat.value"
                [kxCountUpDecimals]="stat.decimals"
                [kxCountUpPrefix]="stat.prefix"
                [kxCountUpSuffix]="stat.suffix"
              ></dt>
              <dd class="label">
                {{ stat.label }}
                <span class="detail mono">{{ stat.detail }}</span>
              </dd>
            </div>
          }
        </dl>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .band {
      position: relative;
      overflow: hidden;
      padding-block: clamp(48px, 7vw, 76px);
      border-block: 1px solid var(--stroke);
      background:
        radial-gradient(80% 140% at 50% 0%, rgba(62, 155, 148, 0.14), transparent 60%),
        linear-gradient(180deg, rgba(207, 240, 234, 0.03), transparent);
    }

    .grid {
      position: relative;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: clamp(1.75rem, 4vw, 2.5rem);
      margin: 0;
    }

    .stat {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      padding-left: 1rem;
      border-left: 2px solid rgba(231, 168, 78, 0.35);
    }

    .value {
      font-family: var(--font-display);
      font-size: clamp(2.1rem, 5vw, 3.2rem);
      font-weight: 700;
      line-height: 1;
      letter-spacing: -0.04em;
      color: var(--sand-200);
      font-variant-numeric: tabular-nums;
    }

    .label {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      margin: 0;
      font-size: 0.92rem;
      color: var(--text-muted);
    }

    .detail {
      color: var(--text-dim);
      font-size: 0.72rem;
    }

    @media (min-width: 860px) {
      .grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }
  `,
})
export class Stats {
  protected readonly stats = STATS;
}
