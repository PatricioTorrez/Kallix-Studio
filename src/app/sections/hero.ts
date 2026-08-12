import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MouseParallax } from '../core/mouse-parallax.directive';
import { Parallax } from '../core/parallax.directive';
import { HERO_MOCKS, HERO_TAGS } from '../data/kallix.data';
import { Icon } from '../ui/icon';
import { PixelSprite } from '../ui/pixel-sprite';
import { ProjectPreview } from '../ui/project-preview';

@Component({
  selector: 'kx-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, PixelSprite, ProjectPreview, Parallax, MouseParallax],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  protected readonly tags = HERO_TAGS;
  protected readonly mocks = HERO_MOCKS;
}
