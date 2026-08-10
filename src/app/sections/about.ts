import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Parallax } from '../core/parallax.directive';
import { Reveal } from '../core/reveal.directive';
import { TEAM } from '../data/kallix.data';
import { Icon, IconName } from '../ui/icon';
import { PixelAvatar } from '../ui/pixel-avatar';
import { SectionHeader } from '../ui/section-header';

interface Value {
  readonly icon: IconName;
  readonly title: string;
  readonly text: string;
}

@Component({
  selector: 'kx-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeader, Icon, PixelAvatar, Reveal, Parallax],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  protected readonly team = TEAM;

  protected readonly values: readonly Value[] = [
    {
      icon: 'target',
      title: 'Criterio de producto',
      text: 'Operamos lo que construimos. Eso nos obliga a decidir pensando en el mes 18, no en la fecha de entrega.',
    },
    {
      icon: 'sparkle',
      title: 'Detalle medible',
      text: 'Rendimiento, accesibilidad y acabado no son opinión: se miden y se sostienen en cada entrega.',
    },
    {
      icon: 'code',
      title: 'Sin cajas negras',
      text: 'Tu repositorio desde el primer commit y una demo funcionando cada dos semanas. Ves avance, no porcentajes.',
    },
    {
      icon: 'shield',
      title: 'Continuidad',
      text: 'Seguimos después del lanzamiento. El software que nadie mantiene se vuelve un pasivo en seis meses.',
    },
  ];
}
