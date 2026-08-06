import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { gridToRuns } from './pixel-art';

const SPRITES = {
  cube: [
    '..1111..',
    '.122221.',
    '11222211',
    '13222231',
    '13322331',
    '13333331',
    '.133331.',
    '..3333..',
  ],
  star: [
    '...11...',
    '...11...',
    '..1111..',
    '11111111',
    '11111111',
    '..1111..',
    '...11...',
    '...11...',
  ],
  bolt: [
    '...111..',
    '..111...',
    '.111....',
    '.111111.',
    '....111.',
    '...111..',
    '..111...',
    '.11.....',
  ],
  chip: [
    '.1.11.1.',
    '11111111',
    '12222221',
    '12233221',
    '12233221',
    '12222221',
    '11111111',
    '.1.11.1.',
  ],
  bot: [
    '..1111..',
    '.111111.',
    '11311311',
    '11311311',
    '11111111',
    '13333331',
    '11111111',
    '1.11.11.',
  ],
  terminal: [
    '11111111',
    '12222221',
    '12122221',
    '12212221',
    '12122221',
    '12222221',
    '12222221',
    '11111111',
  ],
  heart: [
    '.11..11.',
    '11111111',
    '11311311',
    '11111111',
    '.111111.',
    '..1111..',
    '...11...',
    '........',
  ],
} as const;

export type SpriteName = keyof typeof SPRITES;
export type SpriteTone = 'amber' | 'teal' | 'sand' | 'rust';

const PALETTES: Record<SpriteTone, Record<string, string>> = {
  amber: { '1': '#e7a84e', '2': '#f6e2b3', '3': '#d96c2c' },
  teal: { '1': '#3e9b94', '2': '#cff0ea', '3': '#20666b' },
  sand: { '1': '#f6e2b3', '2': '#ffffff', '3': '#e7a84e' },
  rust: { '1': '#d96c2c', '2': '#f6e2b3', '3': '#8f3f18' },
};

/** Sprite decorativo. Es el acento artístico de la marca, no una ilustración de contenido. */
@Component({
  selector: 'kx-pixel-sprite',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 8 8" shape-rendering="crispEdges" aria-hidden="true" focusable="false">
      @for (run of runs(); track $index) {
        <rect [attr.x]="run.x" [attr.y]="run.y" [attr.width]="run.w" height="1" [attr.fill]="run.fill" />
      }
    </svg>
  `,
  styles: `
    :host {
      display: block;
    }

    svg {
      width: 100%;
      height: auto;
    }
  `,
})
export class PixelSprite {
  readonly name = input.required<SpriteName>();
  readonly tone = input<SpriteTone>('amber');

  protected readonly runs = computed(() => gridToRuns(SPRITES[this.name()], PALETTES[this.tone()]));
}
