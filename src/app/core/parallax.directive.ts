import { Directive, ElementRef, Injectable, OnDestroy, OnInit, inject, input } from '@angular/core';
import { prefersReducedMotion } from './motion';

interface ParallaxItem {
  readonly element: HTMLElement;
  readonly speed: number;
}

/**
 * Un solo listener de scroll y un solo rAF para todos los elementos con
 * parallax. Cada elemento con su propio listener es la forma más rápida de
 * perder frames en una landing larga.
 */
@Injectable({ providedIn: 'root' })
class ParallaxDriver implements OnDestroy {
  private readonly items = new Set<ParallaxItem>();
  private frame = 0;
  private listening = false;

  add(item: ParallaxItem): void {
    this.items.add(item);
    if (!this.listening) {
      addEventListener('scroll', this.schedule, { passive: true });
      addEventListener('resize', this.schedule, { passive: true });
      this.listening = true;
    }
    this.schedule();
  }

  remove(item: ParallaxItem): void {
    this.items.delete(item);
    item.element.style.transform = '';
    if (this.items.size === 0) this.stop();
  }

  ngOnDestroy(): void {
    this.stop();
  }

  private stop(): void {
    cancelAnimationFrame(this.frame);
    this.frame = 0;
    if (!this.listening) return;
    removeEventListener('scroll', this.schedule);
    removeEventListener('resize', this.schedule);
    this.listening = false;
  }

  private readonly schedule = () => {
    if (this.frame) return;
    this.frame = requestAnimationFrame(this.update);
  };

  private readonly update = () => {
    this.frame = 0;
    const viewport = innerHeight;

    for (const { element, speed } of this.items) {
      const rect = element.getBoundingClientRect();
      // Fuera de pantalla (con holgura) no hay nada que mover.
      if (rect.bottom < -200 || rect.top > viewport + 200) continue;

      const progress = (rect.top + rect.height / 2 - viewport / 2) / viewport;
      const offset = -progress * speed * 100;
      element.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    }
  };
}

/** Desplazamiento vertical ligado al scroll. `speed` útil entre 0.05 y 0.3. */
@Directive({ selector: '[kxParallax]' })
export class Parallax implements OnInit, OnDestroy {
  readonly speed = input(0.12, { alias: 'kxParallax' });

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly driver = inject(ParallaxDriver);
  private item: ParallaxItem | null = null;

  ngOnInit(): void {
    // Movimiento decorativo: fuera bajo reduced-motion y en pantallas chicas,
    // donde solo cuesta batería.
    if (prefersReducedMotion() || innerWidth < 768) return;
    this.element.style.willChange = 'transform';
    this.item = { element: this.element, speed: this.speed() };
    this.driver.add(this.item);
  }

  ngOnDestroy(): void {
    if (this.item) this.driver.remove(this.item);
  }
}
