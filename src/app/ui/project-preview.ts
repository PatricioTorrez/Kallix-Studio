import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type PreviewName =
  | 'dashboard'
  | 'mobile'
  | 'chat'
  | 'store'
  | 'calendar'
  | 'map'
  | 'pos'
  | 'flow';

/**
 * Maquetas abstractas del producto, dibujadas en SVG. Comunican la forma de
 * cada proyecto sin cargar una sola imagen: pesan bytes, escalan sin perder
 * nitidez y se adaptan al tema.
 */
@Component({
  selector: 'kx-project-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 320 190" role="img" [attr.aria-label]="label()" preserveAspectRatio="xMidYMid slice">
      <rect class="pane" x="0" y="0" width="320" height="190" rx="12" />

      @switch (name()) {
        @case ('dashboard') {
          <rect class="panel" x="12" y="12" width="60" height="166" rx="8" />
          <rect class="dot" x="22" y="24" width="26" height="4" rx="2" />
          <rect class="dim" x="22" y="40" width="40" height="4" rx="2" />
          <rect class="dim" x="22" y="52" width="34" height="4" rx="2" />
          <rect class="dim" x="22" y="64" width="38" height="4" rx="2" />
          <rect class="panel" x="82" y="12" width="70" height="46" rx="8" />
          <rect class="panel" x="160" y="12" width="70" height="46" rx="8" />
          <rect class="panel" x="238" y="12" width="70" height="46" rx="8" />
          <rect class="accent" x="92" y="38" width="30" height="8" rx="2" />
          <rect class="teal" x="170" y="38" width="22" height="8" rx="2" />
          <rect class="dim" x="248" y="38" width="26" height="8" rx="2" />
          <rect class="panel" x="82" y="66" width="226" height="112" rx="8" />
          <path class="stroke-teal" d="M96 150 L128 128 L160 136 L192 108 L224 116 L256 88 L292 96" />
          <rect class="accent" x="96" y="158" width="10" height="12" rx="2" />
          <rect class="accent-soft" x="112" y="150" width="10" height="20" rx="2" />
          <rect class="accent-soft" x="128" y="156" width="10" height="14" rx="2" />
          <rect class="accent-soft" x="144" y="144" width="10" height="26" rx="2" />
        }

        @case ('mobile') {
          <rect class="panel" x="118" y="10" width="84" height="170" rx="14" />
          <rect class="dim" x="146" y="18" width="28" height="4" rx="2" />
          <rect class="accent" x="128" y="32" width="64" height="26" rx="6" />
          <rect class="row" x="128" y="66" width="64" height="18" rx="4" />
          <rect class="row" x="128" y="90" width="64" height="18" rx="4" />
          <rect class="row" x="128" y="114" width="64" height="18" rx="4" />
          <circle class="teal" cx="182" cy="158" r="11" />
          <rect class="dim" x="30" y="46" width="60" height="4" rx="2" />
          <rect class="dim" x="30" y="58" width="42" height="4" rx="2" />
          <rect class="dim" x="232" y="106" width="58" height="4" rx="2" />
          <rect class="dim" x="232" y="118" width="40" height="4" rx="2" />
        }

        @case ('chat') {
          <rect class="bubble" x="24" y="24" width="150" height="30" rx="10" />
          <rect class="bubble-accent" x="122" y="66" width="174" height="34" rx="10" />
          <rect class="bubble" x="24" y="112" width="128" height="26" rx="10" />
          <rect class="dim" x="38" y="34" width="86" height="4" rx="2" />
          <rect class="dim" x="38" y="42" width="60" height="4" rx="2" />
          <rect class="on-accent" x="136" y="76" width="110" height="4" rx="2" />
          <rect class="on-accent" x="136" y="86" width="82" height="4" rx="2" />
          <rect class="dim" x="38" y="122" width="70" height="4" rx="2" />
          <rect class="panel" x="24" y="150" width="272" height="26" rx="13" />
          <circle class="teal" cx="278" cy="163" r="7" />
        }

        @case ('store') {
          <rect class="panel" x="16" y="12" width="288" height="24" rx="8" />
          <rect class="dim" x="28" y="22" width="48" height="4" rx="2" />
          <circle class="accent" cx="288" cy="24" r="6" />
          <rect class="panel" x="16" y="46" width="88" height="62" rx="8" />
          <rect class="panel" x="116" y="46" width="88" height="62" rx="8" />
          <rect class="panel" x="216" y="46" width="88" height="62" rx="8" />
          <rect class="panel" x="16" y="118" width="88" height="60" rx="8" />
          <rect class="panel" x="116" y="118" width="88" height="60" rx="8" />
          <rect class="panel" x="216" y="118" width="88" height="60" rx="8" />
          <rect class="teal" x="28" y="58" width="64" height="24" rx="4" />
          <rect class="accent" x="128" y="58" width="64" height="24" rx="4" />
          <rect class="teal-soft" x="228" y="58" width="64" height="24" rx="4" />
          <rect class="dim" x="28" y="92" width="40" height="4" rx="2" />
          <rect class="dim" x="128" y="92" width="52" height="4" rx="2" />
          <rect class="dim" x="228" y="92" width="34" height="4" rx="2" />
        }

        @case ('calendar') {
          <rect class="dim" x="24" y="18" width="54" height="5" rx="2" />
          @for (col of columns; track col) {
            <rect class="dim" [attr.x]="24 + col * 40" y="36" width="16" height="4" rx="2" />
          }
          @for (cell of cells; track cell.i) {
            <rect
              class="cell"
              [class.is-busy]="cell.busy"
              [class.is-now]="cell.now"
              [attr.x]="24 + cell.c * 40"
              [attr.y]="52 + cell.r * 32"
              width="32"
              height="24"
              rx="5"
            />
          }
        }

        @case ('map') {
          <path class="grid-line" d="M0 48h320M0 96h320M0 144h320M64 0v190M128 0v190M192 0v190M256 0v190" />
          <path class="stroke-accent" d="M40 154 C 96 150, 92 96, 148 92 S 220 60, 274 40" />
          <circle class="teal" cx="40" cy="154" r="7" />
          <circle class="accent" cx="274" cy="40" r="7" />
          <circle class="dot-live" cx="148" cy="92" r="5" />
          <rect class="panel" x="196" y="118" width="104" height="56" rx="8" />
          <rect class="dim" x="208" y="132" width="56" height="4" rx="2" />
          <rect class="dim" x="208" y="144" width="72" height="4" rx="2" />
          <rect class="teal" x="208" y="156" width="34" height="6" rx="3" />
        }

        @case ('pos') {
          <rect class="panel" x="16" y="16" width="140" height="158" rx="8" />
          <rect class="dim" x="30" y="34" width="72" height="4" rx="2" />
          <rect class="dim" x="30" y="48" width="94" height="4" rx="2" />
          <rect class="dim" x="30" y="62" width="60" height="4" rx="2" />
          <path class="grid-line" d="M30 80h112" />
          <rect class="accent" x="30" y="94" width="54" height="10" rx="3" />
          <rect class="dim" x="30" y="122" width="80" height="4" rx="2" />
          <rect class="dim" x="30" y="134" width="66" height="4" rx="2" />
          @for (key of keypadCells; track key.i) {
            <rect class="key" [attr.x]="172 + key.c * 46" [attr.y]="20 + key.r * 40" width="38" height="32" rx="6" />
          }
          <rect class="teal" x="172" y="140" width="130" height="34" rx="8" />
        }

        @case ('flow') {
          <path class="stroke-teal" d="M76 46 H132 M132 46 V96 M132 96 H188 M188 96 V146 M188 146 H244" />
          <rect class="node" x="20" y="30" width="58" height="32" rx="8" />
          <rect class="node is-accent" x="128" y="80" width="62" height="32" rx="8" />
          <rect class="node" x="240" y="130" width="60" height="32" rx="8" />
          <rect class="node" x="20" y="130" width="58" height="32" rx="8" />
          <rect class="dim" x="32" y="44" width="30" height="4" rx="2" />
          <rect class="on-accent" x="140" y="94" width="34" height="4" rx="2" />
          <rect class="dim" x="252" y="144" width="32" height="4" rx="2" />
          <rect class="dim" x="32" y="144" width="26" height="4" rx="2" />
          <circle class="accent" cx="76" cy="46" r="4" />
          <circle class="teal" cx="244" cy="146" r="4" />
        }
      }
    </svg>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }

    svg {
      display: block;
      width: 100%;
      height: 100%;
    }

    .pane {
      fill: var(--preview-pane);
    }

    .panel,
    .node,
    .key,
    .row,
    .bubble {
      fill: rgba(var(--veil), 0.06);
      stroke: rgba(var(--veil), 0.12);
      stroke-width: 1;
    }

    .dim {
      fill: rgba(var(--veil), 0.28);
    }

    .dot {
      fill: rgba(var(--veil), 0.55);
    }

    .accent {
      fill: #e7a84e;
    }

    .accent-soft {
      fill: rgba(231, 168, 78, 0.4);
    }

    .teal {
      fill: #3e9b94;
    }

    .teal-soft {
      fill: rgba(62, 155, 148, 0.45);
    }

    .on-accent {
      fill: rgba(9, 30, 36, 0.6);
    }

    .bubble-accent,
    .node.is-accent {
      fill: #e7a84e;
      stroke: none;
    }

    .stroke-teal,
    .stroke-accent {
      fill: none;
      stroke: #3e9b94;
      stroke-width: 2;
      stroke-linecap: square;
    }

    .stroke-accent {
      stroke: #e7a84e;
      stroke-dasharray: 5 4;
    }

    .grid-line {
      fill: none;
      stroke: rgba(var(--veil), 0.1);
      stroke-width: 1;
    }

    .cell {
      fill: rgba(var(--veil), 0.07);
    }

    .cell.is-busy {
      fill: rgba(62, 155, 148, 0.55);
    }

    .cell.is-now {
      fill: #e7a84e;
    }

    .dot-live {
      fill: var(--figure);
    }
  `,
})
export class ProjectPreview {
  readonly name = input.required<PreviewName>();
  readonly label = input('Vista previa del proyecto');

  protected readonly columns = [0, 1, 2, 3, 4, 5, 6];

  protected readonly keypadCells = Array.from({ length: 9 }, (_, i) => ({
    i,
    r: Math.floor(i / 3),
    c: i % 3,
  }));

  protected readonly cells = Array.from({ length: 28 }, (_, i) => ({
    i,
    r: Math.floor(i / 7),
    c: i % 7,
    busy: [3, 5, 9, 12, 16, 17, 22, 25].includes(i),
    now: i === 11,
  }));
}
