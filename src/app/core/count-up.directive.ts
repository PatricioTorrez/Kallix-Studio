import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';
import { easeOutExpo, prefersReducedMotion } from './motion';
import { RevealService } from './reveal.service';

/**
 * Cuenta hasta el valor cuando el número entra en pantalla. Es explicativo, no
 * decorativo: el conteo es lo que hace legible la magnitud de la cifra.
 */
@Directive({ selector: '[kxCountUp]' })
export class CountUp implements OnInit, OnDestroy {
  readonly value = input.required<number>({ alias: 'kxCountUp' });
  readonly decimals = input(0, { alias: 'kxCountUpDecimals' });
  readonly prefix = input('', { alias: 'kxCountUpPrefix' });
  readonly suffix = input('', { alias: 'kxCountUpSuffix' });

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly reveals = inject(RevealService);
  private frame = 0;

  ngOnInit(): void {
    this.render(0);

    if (prefersReducedMotion()) {
      this.render(this.value());
      return;
    }

    this.reveals.observe(this.element, () => this.run());
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frame);
    this.reveals.unobserve(this.element);
  }

  private run(): void {
    const duration = 1400;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      this.render(this.value() * easeOutExpo(progress));
      if (progress < 1) this.frame = requestAnimationFrame(tick);
    };

    this.frame = requestAnimationFrame(tick);
  }

  private render(current: number): void {
    const decimals = this.decimals();
    const formatted = current.toLocaleString('es-MX', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    this.element.textContent = `${this.prefix()}${formatted}${this.suffix()}`;
  }
}
