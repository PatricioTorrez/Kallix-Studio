/** Utilidades compartidas de motion. */

const query = (q: string): boolean =>
  typeof matchMedia === 'function' ? matchMedia(q).matches : false;

/** El usuario pidió menos movimiento: se conservan opacidad y color, no el desplazamiento. */
export const prefersReducedMotion = (): boolean => query('(prefers-reduced-motion: reduce)');

/** Táctil dispara hover falso al tocar; el movimiento por puntero se limita a punteros finos. */
export const hasFinePointer = (): boolean => query('(hover: hover) and (pointer: fine)');

/** Interpolación amortiguada: da inercia sin necesidad de una librería de springs. */
export const damp = (current: number, target: number, factor = 0.14): number =>
  current + (target - current) * factor;

export const easeOutExpo = (t: number): number => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
