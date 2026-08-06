import { Injectable, OnDestroy } from '@angular/core';

/**
 * Un único IntersectionObserver para toda la página. Cada elemento se dispara
 * una sola vez: volver a animar en cada scroll es pelearse con quien lee.
 */
@Injectable({ providedIn: 'root' })
export class RevealService implements OnDestroy {
  private observer: IntersectionObserver | null = null;
  private readonly callbacks = new Map<Element, () => void>();

  observe(element: Element, onEnter: () => void): void {
    if (typeof IntersectionObserver === 'undefined') {
      onEnter();
      return;
    }

    this.observer ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const callback = this.callbacks.get(entry.target);
          this.unobserve(entry.target);
          callback?.();
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0 },
    );

    this.callbacks.set(element, onEnter);
    this.observer.observe(element);
  }

  unobserve(element: Element): void {
    this.callbacks.delete(element);
    this.observer?.unobserve(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.callbacks.clear();
  }
}
