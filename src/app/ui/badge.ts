import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type BadgeTone = 'teal' | 'amber' | 'neutral' | 'rust';

/** Etiqueta compacta para estados, categorías y metadatos. */
@Component({
  selector: 'kx-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (dot()) {
      <span class="dot" aria-hidden="true"></span>
    }
    <ng-content />
  `,
  host: {
    '[class]': '"tone-" + tone()',
  },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.28rem 0.7rem;
      border: 1px solid var(--badge-border);
      border-radius: var(--r-pill);
      background: var(--badge-bg);
      color: var(--badge-fg);
      font-family: var(--font-mono);
      font-size: 0.72rem;
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      white-space: nowrap;
    }

    :host(.tone-teal) {
      --badge-bg: rgba(62, 155, 148, 0.14);
      --badge-border: rgba(136, 201, 196, 0.32);
      --badge-fg: #a8ddd7;
    }

    :host(.tone-amber) {
      --badge-bg: rgba(231, 168, 78, 0.14);
      --badge-border: rgba(231, 168, 78, 0.34);
      --badge-fg: #f0c075;
    }

    :host(.tone-rust) {
      --badge-bg: rgba(217, 108, 44, 0.16);
      --badge-border: rgba(217, 108, 44, 0.38);
      --badge-fg: #eda274;
    }

    :host(.tone-neutral) {
      --badge-bg: var(--surface-2);
      --badge-border: var(--stroke);
      --badge-fg: var(--text-muted);
    }

    .dot {
      width: 6px;
      height: 6px;
      background: currentColor;
      box-shadow: 0 0 10px 1px currentColor;
    }
  `,
})
export class Badge {
  readonly tone = input<BadgeTone>('neutral');
  readonly dot = input(false);
}
