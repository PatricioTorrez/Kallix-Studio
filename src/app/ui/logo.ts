import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { gridToRuns } from './pixel-art';

const MARK = [
  '11....11',
  '11...11.',
  '11..11..',
  '111111..',
  '11..11..',
  '11...11.',
  '11....11',
];

@Component({
  selector: 'kx-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="mark" aria-hidden="true">
      <svg viewBox="0 0 8 7" shape-rendering="crispEdges">
        <defs>
          <linearGradient id="kx-mark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#f6e2b3" />
            <stop offset="55%" stop-color="#e7a84e" />
            <stop offset="100%" stop-color="#d96c2c" />
          </linearGradient>
        </defs>
        @for (run of runs(); track $index) {
          <rect [attr.x]="run.x" [attr.y]="run.y" [attr.width]="run.w" height="1" fill="url(#kx-mark)" />
        }
      </svg>
    </span>

    @if (withWordmark()) {
      <span class="word">
        <span class="name">Kallix</span>
        <span class="suffix">Studio</span>
      </span>
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 0.65rem;
      color: var(--text);
    }

    .mark {
      display: grid;
      place-items: center;
      width: 34px;
      height: 34px;
      padding: 6px;
      border: 1px solid var(--stroke-strong);
      border-radius: var(--r-sm);
      background: linear-gradient(160deg, rgba(231, 168, 78, 0.18), rgba(62, 155, 148, 0.1));
      transition: transform var(--d-base) var(--ease-out);
    }

    .mark svg {
      width: 100%;
      height: auto;
    }

    .word {
      display: flex;
      align-items: baseline;
      gap: 0.4rem;
    }

    .name {
      font-family: var(--font-display);
      font-size: 1.06rem;
      font-weight: 700;
      letter-spacing: -0.025em;
    }

    .suffix {
      font-family: var(--font-mono);
      font-size: 0.66rem;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--text-dim);
    }

    @media (hover: hover) and (pointer: fine) {
      :host(:hover) .mark {
        transform: scale(1.06) rotate(-3deg);
      }
    }
  `,
})
export class Logo {
  readonly withWordmark = input(true);

  protected readonly runs = computed(() => gridToRuns(MARK, { '1': '#fff' }));
}
