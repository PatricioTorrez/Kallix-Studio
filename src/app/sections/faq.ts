import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Reveal } from '../core/reveal.directive';
import { CONTACT, FAQS } from '../data/kallix.data';
import { Accordion } from '../ui/accordion';
import { Icon } from '../ui/icon';
import { PixelSprite } from '../ui/pixel-sprite';
import { SectionHeader } from '../ui/section-header';

@Component({
  selector: 'kx-faq',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeader, Accordion, Icon, PixelSprite, Reveal],
  templateUrl: './faq.html',
  styleUrl: './faq.css',
})
export class Faq {
  protected readonly faqs = FAQS;
  protected readonly contact = CONTACT;
}
