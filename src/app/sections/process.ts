import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Reveal } from '../core/reveal.directive';
import { PROCESS } from '../data/kallix.data';
import { Icon } from '../ui/icon';
import { SectionHeader } from '../ui/section-header';

@Component({
  selector: 'kx-process',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeader, Icon, Reveal],
  templateUrl: './process.html',
  styleUrl: './process.css',
})
export class Process {
  protected readonly steps = PROCESS;
}
