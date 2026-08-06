import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';
import { damp, hasFinePointer, prefersReducedMotion } from './motion';

/**
 * Inclinación y foco de luz siguiendo el puntero.
 *
 * El seguimiento pasa por una interpolación amortiguada en lugar de atarse
 * directamente a la posición del cursor: sin inercia el efecto se siente
 * mecánico. El foco es un elemento `.spot` que se traslada — solo `transform`,
 * ningún repintado por frame.
 */
@Directive({ selector: '[kxTilt]' })
export class Tilt implements OnInit, OnDestroy {
  readonly max = input(6, { alias: 'kxTilt' });

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private spot: HTMLElement | null = null;

  private readonly target = { x: 0, y: 0, spotX: 0, spotY: 0 };
  private readonly current = { x: 0, y: 0, spotX: 0, spotY: 0 };
  private frame = 0;
  private hovering = false;
  private enabled = false;
  private entering = false;

  ngOnInit(): void {
    this.enabled = hasFinePointer() && !prefersReducedMotion();
    if (!this.enabled) return;

    this.spot = this.element.querySelector<HTMLElement>('.spot');
    this.element.addEventListener('pointerenter', this.onEnter);
    this.element.addEventListener('pointermove', this.onMove);
    this.element.addEventListener('pointerleave', this.onLeave);
  }

  ngOnDestroy(): void {
    if (!this.enabled) return;
    cancelAnimationFrame(this.frame);
    this.element.removeEventListener('pointerenter', this.onEnter);
    this.element.removeEventListener('pointermove', this.onMove);
    this.element.removeEventListener('pointerleave', this.onLeave);
  }

  private readonly onEnter = () => {
    this.hovering = true;
    this.entering = true;
    this.element.style.willChange = 'transform';
    this.start();
  };

  private readonly onMove = (event: PointerEvent) => {
    const rect = this.element.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    this.target.x = (0.5 - py) * 2 * this.max();
    this.target.y = (px - 0.5) * 2 * this.max();
    this.target.spotX = event.clientX - rect.left;
    this.target.spotY = event.clientY - rect.top;

    // El foco aparece bajo el cursor, no viajando desde la esquina.
    if (this.entering) {
      this.entering = false;
      this.current.spotX = this.target.spotX;
      this.current.spotY = this.target.spotY;
    }

    this.start();
  };

  private readonly onLeave = () => {
    this.hovering = false;
    this.target.x = 0;
    this.target.y = 0;
    this.start();
  };

  private start(): void {
    if (this.frame) return;
    this.frame = requestAnimationFrame(this.tick);
  }

  private readonly tick = () => {
    this.current.x = damp(this.current.x, this.target.x);
    this.current.y = damp(this.current.y, this.target.y);
    this.current.spotX = damp(this.current.spotX, this.target.spotX, 0.2);
    this.current.spotY = damp(this.current.spotY, this.target.spotY, 0.2);

    this.element.style.transform = `perspective(900px) rotateX(${this.current.x.toFixed(3)}deg) rotateY(${this.current.y.toFixed(3)}deg)`;

    if (this.spot) {
      this.spot.style.transform = `translate3d(${this.current.spotX.toFixed(1)}px, ${this.current.spotY.toFixed(1)}px, 0) translate(-50%, -50%)`;
    }

    const settled =
      Math.abs(this.current.x - this.target.x) < 0.01 &&
      Math.abs(this.current.y - this.target.y) < 0.01;

    if (this.hovering || !settled) {
      this.frame = requestAnimationFrame(this.tick);
      return;
    }

    this.frame = 0;
    this.element.style.transform = '';
    this.element.style.willChange = '';
  };
}
