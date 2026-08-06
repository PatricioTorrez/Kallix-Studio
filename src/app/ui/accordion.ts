import { ChangeDetectionStrategy, Component, OnInit, input, signal } from '@angular/core';
import { Icon } from './icon';

export interface AccordionItem {
  readonly question: string;
  readonly answer: string;
}

/**
 * Acordeón de una sola sección abierta.
 *
 * La apertura anima `grid-template-rows` de `0fr` a `1fr`: es la única forma
 * de transicionar hasta la altura real del contenido sin medirla en JS.
 */
@Component({
  selector: 'kx-accordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <div class="list">
      @for (item of items(); track item.question; let i = $index) {
        <div class="item" [class.is-open]="open() === i">
          <h3 class="heading">
            <button
              type="button"
              class="trigger"
              [id]="'faq-t-' + i"
              [attr.aria-expanded]="open() === i"
              [attr.aria-controls]="'faq-p-' + i"
              (click)="toggle(i)"
            >
              <span class="question">{{ item.question }}</span>
              <span class="sign" aria-hidden="true">
                <kx-icon name="plus" [size]="18" />
              </span>
            </button>
          </h3>

          <div class="panel" role="region" [id]="'faq-p-' + i" [attr.aria-labelledby]="'faq-t-' + i">
            <div class="panel-clip">
              <p class="answer">{{ item.answer }}</p>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .list {
      display: flex;
      flex-direction: column;
    }

    .item {
      border-bottom: 1px solid var(--stroke);
    }

    .item:first-child {
      border-top: 1px solid var(--stroke);
    }

    .heading {
      margin: 0;
      font-size: inherit;
      font-weight: inherit;
    }

    .trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      width: 100%;
      padding: 1.35rem 0.25rem;
      border: 0;
      background: transparent;
      text-align: left;
      cursor: pointer;
      transition: color var(--d-base) ease;
    }

    .question {
      font-family: var(--font-display);
      font-size: clamp(1rem, 1.5vw, 1.12rem);
      font-weight: 600;
      letter-spacing: -0.015em;
      color: var(--text);
    }

    .sign {
      display: grid;
      place-items: center;
      flex: none;
      width: 34px;
      height: 34px;
      border: 1px solid var(--stroke-strong);
      border-radius: var(--r-pill);
      color: var(--accent-cool);
      transition:
        transform var(--d-slow) var(--ease-out),
        background-color var(--d-base) ease,
        color var(--d-base) ease;
    }

    .is-open .sign {
      transform: rotate(135deg);
      background: var(--amber-500);
      color: var(--accent-ink);
      border-color: transparent;
    }

    .panel {
      display: grid;
      grid-template-rows: 0fr;
      opacity: 0;
      transition:
        grid-template-rows 260ms var(--ease-out),
        opacity 200ms var(--ease-out);
    }

    .is-open .panel {
      grid-template-rows: 1fr;
      opacity: 1;
    }

    .panel-clip {
      overflow: hidden;
    }

    .answer {
      max-width: 62ch;
      margin: 0;
      padding: 0 3rem 1.6rem 0.25rem;
      color: var(--text-muted);
    }

    @media (hover: hover) and (pointer: fine) {
      .trigger:hover .question {
        color: var(--accent-cool);
      }

      .trigger:hover .sign {
        background: var(--surface-2);
      }

      .is-open .trigger:hover .sign {
        background: var(--amber-400);
      }
    }
  `,
})
export class Accordion implements OnInit {
  readonly items = input.required<readonly AccordionItem[]>();
  /** Índice abierto al cargar; `null` deja todo cerrado. */
  readonly initialOpen = input<number | null>(0);

  protected readonly open = signal<number | null>(null);

  ngOnInit(): void {
    this.open.set(this.initialOpen());
  }

  protected toggle(index: number): void {
    this.open.update((current) => (current === index ? null : index));
  }
}
