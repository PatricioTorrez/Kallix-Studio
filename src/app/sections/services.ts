import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Reveal } from '../core/reveal.directive';
import { Tilt } from '../core/tilt.directive';
import { SERVICES } from '../data/kallix.data';
import { Icon } from '../ui/icon';
import { SectionHeader } from '../ui/section-header';

@Component({
  selector: 'kx-services',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeader, Icon, Reveal, Tilt],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services {
  protected readonly services = SERVICES;
}
