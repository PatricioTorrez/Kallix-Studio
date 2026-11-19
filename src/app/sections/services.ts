import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Reveal } from '../core/reveal.directive';
import { SERVICES } from '../data/kallix.data';
import { Icon } from '../ui/icon';
import { ProjectPreview } from '../ui/project-preview';
import { SectionHeader } from '../ui/section-header';

@Component({
  selector: 'kx-services',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeader, Icon, ProjectPreview, Reveal],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services {
  protected readonly services = SERVICES;
}
