import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Reveal } from '../core/reveal.directive';
import { PLANS } from '../data/kallix.data';
import { Icon } from '../ui/icon';
import { SectionHeader } from '../ui/section-header';

@Component({
  selector: 'kx-pricing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeader, Icon, Reveal],
  templateUrl: './pricing.html',
  styleUrl: './pricing.css',
})
export class Pricing {
  protected readonly plans = PLANS;
}
