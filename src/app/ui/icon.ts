import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

interface Glyph {
  readonly paths: readonly string[];
  /** Los logos de marca son siluetas rellenas; el resto son trazos. */
  readonly fill?: boolean;
}

const ICONS = {
  browser: { paths: ['M3 5h18v14H3z', 'M3 9h18', 'M6 7h.01', 'M8.5 7h.01'] },
  mobile: { paths: ['M7 3h10v18H7z', 'M10.5 18h3'] },
  layers: { paths: ['M12 3 21 8l-9 5-9-5 9-5z', 'M3 12l9 5 9-5', 'M3 16l9 5 9-5'] },
  bot: {
    paths: ['M5 9h14v10H5z', 'M12 4v5', 'M9 13h.01', 'M15 13h.01', 'M9.5 16.5h5', 'M3 12v3', 'M21 12v3'],
  },
  bolt: { paths: ['M13 2 4 14h6l-1 8 9-12h-6z'] },
  blocks: { paths: ['M3 3h8v8H3z', 'M13 3h8v8h-8z', 'M3 13h8v8H3z', 'M13 13h8v8h-8z'] },
  compass: {
    paths: ['M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18', 'M15.5 8.5 13 13l-4.5 2.5L11 11z'],
  },
  pen: { paths: ['M4 20h4L20 8l-4-4L4 16z', 'M14 6l4 4'] },
  code: { paths: ['M8 6 3 12l5 6', 'M16 6l5 6-5 6', 'M13.5 4 10.5 20'] },
  shield: { paths: ['M12 3 5 6v6c0 4.4 2.9 7.5 7 9 4.1-1.5 7-4.6 7-9V6z', 'M9 12l2 2 4-4'] },
  chart: { paths: ['M4 20h16', 'M7 16V9', 'M12 16V5', 'M17 16v-4'] },
  sparkle: { paths: ['M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z'] },
  star: {
    paths: ['M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z'],
  },
  check: { paths: ['M4 12.5 9 17.5 20 6.5'] },
  plus: { paths: ['M12 5v14', 'M5 12h14'] },
  minus: { paths: ['M5 12h14'] },
  arrowRight: { paths: ['M4 12h15', 'M13 6l6 6-6 6'] },
  arrowUpRight: { paths: ['M7 17 17 7', 'M8 7h9v9'] },
  chevronLeft: { paths: ['M15 5l-7 7 7 7'] },
  chevronRight: { paths: ['M9 5l7 7-7 7'] },
  chevronDown: { paths: ['M5 9l7 7 7-7'] },
  mail: { paths: ['M3 5h18v14H3z', 'M3 6l9 7 9-7'] },
  phone: { paths: ['M6 3h4l2 5-2.6 1.6a12 12 0 0 0 4.9 4.9L16 12l5 2v4c0 1.1-.9 2-2 2A16 16 0 0 1 3 6c0-1.1.9-3 3-3z'] },
  whatsapp: {
    paths: [
      'M4 20l1.3-3.9A8 8 0 1 1 8.2 18.8z',
      'M9 9.2c0 3 2.8 5.8 5.8 5.8l1.3-1.4-2-.9-.9.7a6 6 0 0 1-2.6-2.6l.7-.9-.9-2z',
    ],
  },
  mapPin: {
    paths: ['M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z', 'M12 12.5a2.5 2.5 0 1 0 0-5a2.5 2.5 0 1 0 0 5'],
  },
  clock: { paths: ['M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18', 'M12 7v5.5l3.5 2'] },
  menu: { paths: ['M4 7h16', 'M4 12h16', 'M4 17h16'] },
  close: { paths: ['M6 6l12 12', 'M18 6L6 18'] },
  target: {
    paths: [
      'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18',
      'M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8',
      'M12 11.2h.01',
    ],
  },
  github: {
    fill: true,
    paths: [
      'M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z',
    ],
  },
  linkedin: {
    fill: true,
    paths: [
      'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.76-1.95 4.02 0 4.76 2.5 4.76 5.75V21h-4v-5.6c0-1.34-.02-3.06-1.9-3.06-1.9 0-2.19 1.45-2.19 2.96V21H9z',
    ],
  },
  x: {
    fill: true,
    paths: ['M18.9 2H22l-7.1 8.1L23 22h-6.6l-5.2-6.8L5.3 22H2l7.6-8.7L1.6 2h6.8l4.7 6.2L18.9 2zm-1.2 18h1.8L7.4 3.9H5.5z'],
  },
} satisfies Record<string, Glyph>;

export type IconName = keyof typeof ICONS;

@Component({
  selector: 'kx-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      [class.is-filled]="glyph().fill"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      @for (d of glyph().paths; track d) {
        <path [attr.d]="d" />
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      flex: none;
    }

    svg {
      fill: none;
      stroke: currentColor;
      stroke-width: 1.6;
      /* Remates cuadrados: coherentes con la identidad pixel del estudio. */
      stroke-linecap: square;
      stroke-linejoin: miter;
    }

    svg.is-filled {
      fill: currentColor;
      stroke: none;
    }
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(20);

  protected readonly glyph = computed<Glyph>(() => ICONS[this.name()]);
}
