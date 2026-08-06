import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MouseParallax } from '../core/mouse-parallax.directive';
import { Parallax } from '../core/parallax.directive';
import { HERO_STATS } from '../data/kallix.data';
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
  protected readonly stats = HERO_STATS;
  protected readonly bars = [42, 68, 54, 82, 61, 94];
  protected readonly chips = ['Angular', 'Laravel', 'Flutter', 'IA'];
}
