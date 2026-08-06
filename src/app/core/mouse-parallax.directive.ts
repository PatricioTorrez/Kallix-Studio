import { Directive, ElementRef, OnDestroy, OnInit, inject } from '@angular/core';
import { damp, hasFinePointer, prefersReducedMotion } from './motion';

/**
 * Parallax de puntero por capas. Cada hijo con `data-depth` se desplaza en
 * proporción a su profundidad, con inercia.
 *
 * El transform se escribe directamente sobre cada capa; propagarlo desde una
 * variable CSS del contenedor recalcularía el estilo de todos los hijos en
 * cada frame.
 */
@Directive({ selector: '[kxMouseParallax]' })
export class MouseParallax implements OnInit, OnDestroy {
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  private layers: { node: HTMLElement; depth: number }[] = [];
  private readonly target = { x: 0, y: 0 };
  private readonly current = { x: 0, y: 0 };
  private frame = 0;
  private enabled = false;

  ngOnInit(): void {
    this.enabled = hasFinePointer() && !prefersReducedMotion();
    if (!this.enabled) return;

    this.layers = [...this.element.querySelectorAll<HTMLElement>('[data-depth]')].map((node) => ({
      node,
      depth: Number(node.dataset['depth']) || 0,
    }));
    if (!this.layers.length) return;

    addEventListener('pointermove', this.onMove, { passive: true });
  }

  ngOnDestroy(): void {
    if (!this.enabled) return;
    cancelAnimationFrame(this.frame);
    removeEventListener('pointermove', this.onMove);
  }

  private readonly onMove = (event: PointerEvent) => {
    this.target.x = (event.clientX / innerWidth - 0.5) * 2;
    this.target.y = (event.clientY / innerHeight - 0.5) * 2;
    if (!this.frame) this.frame = requestAnimationFrame(this.tick);
  };

  private readonly tick = () => {
    this.current.x = damp(this.current.x, this.target.x, 0.08);
    this.current.y = damp(this.current.y, this.target.y, 0.08);

    for (const { node, depth } of this.layers) {
      const x = (-this.current.x * depth).toFixed(2);
      const y = (-this.current.y * depth).toFixed(2);
      node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }

    const settled =
      Math.abs(this.current.x - this.target.x) < 0.001 &&
      Math.abs(this.current.y - this.target.y) < 0.001;

    this.frame = settled ? 0 : requestAnimationFrame(this.tick);
  };
}
