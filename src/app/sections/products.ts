import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Reveal } from '../core/reveal.directive';
import { Tilt } from '../core/tilt.directive';
import { PRODUCTS, Product } from '../data/kallix.data';
import { Badge, BadgeTone } from '../ui/badge';
import { Icon } from '../ui/icon';
import { ProjectPreview } from '../ui/project-preview';
import { SectionHeader } from '../ui/section-header';

@Component({
  selector: 'kx-products',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeader, ProjectPreview, Badge, Icon, Reveal, Tilt],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  protected readonly products = PRODUCTS;

  protected statusTone(product: Product): BadgeTone {
    return product.status === 'Producción' ? 'teal' : product.status === 'Beta' ? 'amber' : 'neutral';
  }
}
