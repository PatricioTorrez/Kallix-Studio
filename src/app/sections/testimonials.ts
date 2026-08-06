import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Reveal } from '../core/reveal.directive';
import { TESTIMONIALS, Testimonial } from '../data/kallix.data';
import { Carousel } from '../ui/carousel';
import { Icon } from '../ui/icon';
import { SectionHeader } from '../ui/section-header';

@Component({
  selector: 'kx-testimonials',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeader, Carousel, Icon, Reveal],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.css',
})
export class Testimonials {
  protected readonly testimonials = TESTIMONIALS;
  protected readonly stars = [0, 1, 2, 3, 4];

  protected asTestimonial(value: unknown): Testimonial {
    return value as Testimonial;
  }
}
