import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Reveal } from '../core/reveal.directive';
import { Tilt } from '../core/tilt.directive';
import { TEAM } from '../data/kallix.data';
import { PixelAvatar } from '../ui/pixel-avatar';
import { SectionHeader } from '../ui/section-header';

@Component({
  selector: 'kx-team',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeader, PixelAvatar, Reveal, Tilt],
  templateUrl: './team.html',
  styleUrl: './team.css',
})
export class Team {
  protected readonly members = TEAM;
}
