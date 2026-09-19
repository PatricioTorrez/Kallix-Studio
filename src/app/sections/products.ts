import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { prefersReducedMotion } from '../core/motion';
import { Reveal } from '../core/reveal.directive';
import { Tilt } from '../core/tilt.directive';
import { PRODUCT_KIND_LABEL, PRODUCTS, ProductKind } from '../data/kallix.data';
import { Badge } from '../ui/badge';
import { Carousel } from '../ui/carousel';
import { Icon } from '../ui/icon';
import { SectionHeader } from '../ui/section-header';

/**
 * Duración de la animación de firma de cada logo: tres actos —entrada,
 * intermedio y final— en 5 s. Debe coincidir con `--play` en
 * `products.motion.css`; el margen evita quitar la clase un frame antes del
 * final.
 */
const PLAY_MS = 5000 + 120;

@Component({
  selector: 'kx-products',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHeader, Carousel, Badge, Icon, Reveal, Tilt],
  templateUrl: './products.html',
  styleUrls: [
    './products.css',
    './products.motion.css',
    './products.kalen.css',
    './products.kineti.css',
    './products.kivo.css',
    './products.kora.css',
  ],
})
export class Products {
  protected readonly products = PRODUCTS;
  /** Etiquetas del indicador del carrusel: un nombre por icono. */
  protected readonly productNames = PRODUCTS.map(
    (product) => `${product.name} · ${PRODUCT_KIND_LABEL[product.kind]}`,
  );

  /** Productos cuya animación de firma está corriendo ahora mismo. */
  protected readonly playing = signal<ReadonlySet<string>>(new Set());

  private readonly catalog = viewChild.required('catalog', { read: ElementRef });
  private readonly timers = new Map<string, number>();
  private current = 0;
  private visible = false;

  constructor() {
    const destroyRef = inject(DestroyRef);

    // «Al mostrarse»: cuando el carrusel entra en pantalla se anima el logo que
    // está a la vista; después, cada vez que el carrusel cambia de diapositiva.
    afterNextRender(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          this.visible = entry.isIntersecting;
          if (this.visible) this.play(PRODUCTS[this.current].id);
        },
        { threshold: 0.45 },
      );
      observer.observe(this.catalog().nativeElement);

      destroyRef.onDestroy(() => {
        observer.disconnect();
        this.timers.forEach((timer) => clearTimeout(timer));
      });
    });
  }

  protected kindLabel(kind: ProductKind): string {
    return PRODUCT_KIND_LABEL[kind];
  }

  protected onActiveChange(index: number): void {
    this.current = index;
    if (this.visible) this.play(PRODUCTS[index].id);
  }

  /** Arranca la firma de un logo. Si ya está corriendo no la reinicia a medias. */
  protected play(id: string): void {
    if (prefersReducedMotion() || this.playing().has(id)) return;

    this.playing.update((ids) => new Set(ids).add(id));
    this.timers.set(
      id,
      setTimeout(() => {
        this.timers.delete(id);
        this.playing.update((ids) => {
          const next = new Set(ids);
          next.delete(id);
          return next;
        });
      }, PLAY_MS) as unknown as number,
    );
  }
}
