import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MouseParallax } from '../core/mouse-parallax.directive';
import { Parallax } from '../core/parallax.directive';
import { HERO_PANEL, HERO_TAGS } from '../data/kallix.data';
import { Icon } from '../ui/icon';
import { PixelSprite } from '../ui/pixel-sprite';

@Component({
  selector: 'kx-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, PixelSprite, Parallax, MouseParallax],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  protected readonly tags = HERO_TAGS;
  protected readonly panel = HERO_PANEL;
  /** Alturas del gráfico de la maqueta: decorativas, el bloque es aria-hidden. */
  protected readonly bars = [42, 68, 54, 82, 61, 94];
}
