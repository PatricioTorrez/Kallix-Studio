import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  effect,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';

export interface TabItem {
  readonly id: string;
  readonly label: string;
}

/**
 * Tabs con indicador recortado.
 *
 * En vez de interpolar el color del texto y el del fondo por separado —que
 * nunca acaba de cuadrar—, se dibuja una copia de la lista ya en estado activo
 * y se recorta para dejar ver solo la pestaña seleccionada. Fondo y texto
 * cambian a la vez porque son un único elemento revelándose.
 */
@Component({
  selector: 'kx-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tabs" #container>
      <div class="stack">
        <div class="layer" role="tablist" [attr.aria-label]="label()">
          @for (item of items(); track item.id) {
            <button
              type="button"
              role="tab"
              class="tab"
              [attr.data-id]="item.id"
              [attr.aria-selected]="item.id === selected()"
              [attr.tabindex]="item.id === selected() ? 0 : -1"
              (click)="select(item.id)"
              (keydown)="onKeydown($event)"
            >
              {{ item.label }}
            </button>
          }
        </div>

        <div class="layer layer--active" aria-hidden="true" [style.clip-path]="clip()">
          @for (item of items(); track item.id) {
            <span class="tab">{{ item.label }}</span>
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .tabs {
      display: flex;
      max-width: 100%;
      padding: 5px;
      border: 1px solid var(--stroke);
      border-radius: var(--r-pill);
      background: var(--surface);
      overflow-x: auto;
      scrollbar-width: none;
    }

    .tabs::-webkit-scrollbar {
      display: none;
    }

    /* La capa activa se posiciona contra el ancho real de la lista, no del
       contenedor: si las pestañas desbordan y se hace scroll, el recorte sigue
       cuadrando con la pestaña. */
    .stack {
      position: relative;
      width: max-content;
    }

    .layer {
      display: flex;
      gap: 4px;
    }

    .layer--active {
      position: absolute;
      inset: 0;
      pointer-events: none;
      transition: clip-path 260ms var(--ease-in-out);
    }

    .tab {
      padding: 0.55rem 1.05rem;
      border: 0;
      border-radius: var(--r-pill);
      background: transparent;
      color: var(--text-muted);
      font-family: var(--font-display);
      font-size: 0.9rem;
      font-weight: 600;
      letter-spacing: -0.01em;
      white-space: nowrap;
      cursor: pointer;
      transition:
        color var(--d-base) ease,
        transform var(--d-press) var(--ease-out);
    }

    .tab:active {
      transform: scale(0.97);
    }

    .layer--active .tab {
      background: var(--amber-500);
      color: var(--accent-ink);
      cursor: default;
    }

    @media (hover: hover) and (pointer: fine) {
      .layer:not(.layer--active) .tab:hover {
        color: var(--text);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .layer--active {
        transition-duration: 1ms;
      }
    }
  `,
})
export class Tabs implements OnDestroy {
  readonly items = input.required<readonly TabItem[]>();
  readonly selected = model.required<string>();
  readonly label = input('Secciones');

  protected readonly clip = signal('inset(0 100% 0 0)');
  private readonly container = viewChild.required<ElementRef<HTMLElement>>('container');
  private observer?: ResizeObserver;
  private frame = 0;

  constructor() {
    effect(() => {
      // Se vuelve a medir cuando cambia la selección o la lista.
      this.selected();
      this.items();
      this.scheduleMeasure();
    });

    effect((onCleanup) => {
      const host = this.container().nativeElement;
      if (typeof ResizeObserver === 'undefined') return;
      this.observer = new ResizeObserver(() => this.scheduleMeasure());
      this.observer.observe(host);
      onCleanup(() => this.observer?.disconnect());
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frame);
    this.observer?.disconnect();
  }

  protected select(id: string): void {
    this.selected.set(id);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const ids = this.items().map((item) => item.id);
    const index = ids.indexOf(this.selected());
    let next = index;

    switch (event.key) {
      case 'ArrowRight':
        next = (index + 1) % ids.length;
        break;
      case 'ArrowLeft':
        next = (index - 1 + ids.length) % ids.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = ids.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.selected.set(ids[next]);
    this.focusTab(ids[next]);
  }

  private focusTab(id: string): void {
    requestAnimationFrame(() => {
      this.container()
        .nativeElement.querySelector<HTMLButtonElement>(`button[data-id="${id}"]`)
        ?.focus();
    });
  }

  private scheduleMeasure(): void {
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => this.measure());
  }

  private measure(): void {
    const host = this.container().nativeElement;
    const active = host.querySelector<HTMLElement>(`button[data-id="${this.selected()}"]`);
    if (!active) return;

    const layer = active.parentElement!;
    const width = layer.offsetWidth;
    if (!width) return;

    const left = (active.offsetLeft / width) * 100;
    const right = 100 - ((active.offsetLeft + active.offsetWidth) / width) * 100;
    this.clip.set(`inset(0 ${right.toFixed(3)}% 0 ${left.toFixed(3)}%)`);
  }
}
