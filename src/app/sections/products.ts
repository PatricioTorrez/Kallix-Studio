import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Reveal } from '../core/reveal.directive';
import { PRODUCT_KIND_LABEL, PRODUCTS, ProductKind } from '../data/kallix.data';
import { Badge } from '../ui/badge';
import { Carousel } from '../ui/carousel';
import { Icon } from '../ui/icon';
import { SectionHeader } from '../ui/section-header';

/**
 * Catálogo de productos propios: un carrusel de fichas con el icono de la app
 * a un lado y su descripción al otro.
 *
 * Las animaciones de firma de cada logo —mazo, barra, ticket, audífonos— están
 * **desactivadas** desde el 2026-09-21 a petición del equipo. No se borraron:
 * viven completas en `products-motion/`, con las instrucciones para reponerlas
 * en el `README.md` de esa carpeta. Por eso este componente no tiene estado: la
 * ficha es estática.
 */
@Component({
  selector: 'kx-products',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeader, Carousel, Badge, Icon, Reveal],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  protected readonly products = PRODUCTS;
  /** Etiquetas del indicador del carrusel: un nombre por icono. */
  protected readonly productNames = PRODUCTS.map(
    (product) => `${product.name} · ${PRODUCT_KIND_LABEL[product.kind]}`,
  );

  protected kindLabel(kind: ProductKind): string {
    return PRODUCT_KIND_LABEL[kind];
  }
}
