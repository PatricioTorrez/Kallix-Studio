import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';
import { RevealService } from './reveal.service';

export type RevealVariant = 'up' | 'down' | 'left' | 'right' | 'scale' | 'clip';

/**
 * Aparición al entrar en pantalla. El estado inicial y la transición viven en
 * `styles.css` (`[data-reveal]`), así que el movimiento corre fuera del hilo
 * principal y se interrumpe limpio si el usuario vuelve a hacer scroll.
 */
@Directive({ selector: '[kxReveal]' })
export class Reveal implements OnInit, OnDestroy {
  readonly variant = input<RevealVariant>('up', { alias: 'kxReveal' });
  /** Escalonado dentro de un grupo. Manténlo entre 30 y 80 ms por elemento. */
  readonly delay = input(0, { alias: 'kxRevealDelay' });

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly reveals = inject(RevealService);

  ngOnInit(): void {
    this.element.dataset['reveal'] = this.variant();
    if (this.delay()) {
      this.element.style.setProperty('--reveal-delay', `${this.delay()}ms`);
    }
    this.reveals.observe(this.element, () => (this.element.dataset['visible'] = ''));
  }

  ngOnDestroy(): void {
    this.reveals.unobserve(this.element);
  }
}
