import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { gridToRuns } from './pixel-art';

/** Retrato pixel art del equipo, dibujado desde una rejilla de texto. */
@Component({
  selector: 'kx-pixel-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.viewBox]="'0 0 ' + cols() + ' ' + pixels().length"
      shape-rendering="crispEdges"
      role="img"
      [attr.aria-label]="'Retrato pixel art de ' + name()"
    >
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
      image-rendering: pixelated;
    }
  `,
})
export class PixelAvatar {
  readonly pixels = input.required<readonly string[]>();
  readonly palette = input.required<Readonly<Record<string, string>>>();
  readonly name = input('');

  protected readonly runs = computed(() => gridToRuns(this.pixels(), this.palette()));
  protected readonly cols = computed(() => this.pixels()[0]?.length ?? 0);
}
