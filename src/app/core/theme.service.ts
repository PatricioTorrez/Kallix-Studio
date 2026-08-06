import { Injectable, signal } from '@angular/core';
import { prefersReducedMotion } from './motion';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'kx-theme';

/** Debe coincidir con `--bg` de cada tema en styles.css. */
const THEME_COLOR: Record<Theme, string> = { dark: '#04161C', light: '#F4F1EC' };

/**
 * `startViewTransition` es reciente y no está en todas las versiones de lib.dom.
 * Se tipa aquí para no depender de la del compilador.
 */
type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => unknown;
};

const isTheme = (value: unknown): value is Theme => value === 'dark' || value === 'light';

/** Oscuro es el default de marca, no el del sistema: el hero está construido para él. */
const storedTheme = (): Theme => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return isTheme(value) ? value : 'dark';
  } catch {
    return 'dark';
  }
};

/**
 * Único dueño del tema de la página. El hero, la franja de clientes, el CTA y el
 * footer se quedan oscuros siempre: lo resuelve la clase `.on-dark` en CSS, no
 * este servicio.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>(storedTheme());

  constructor() {
    // El script del <head> ya puso el atributo; esto alinea el meta theme-color
    // y cubre el caso de que el script no llegara a correr.
    this.reflect(this.theme());
  }

  toggle(): void {
    this.set(this.theme() === 'dark' ? 'light' : 'dark');
  }

  set(theme: Theme): void {
    if (theme === this.theme()) return;

    // Síncrono a propósito: `startViewTransition` fotografía el DOM en cuanto
    // este callback retorna, y un `effect` de Angular correría después — la
    // instantánea saldría con el tema viejo.
    const commit = () => {
      this.reflect(theme);
      this.persist(theme);
      this.theme.set(theme);
    };

    const view = document as ViewTransitionDocument;

    if (prefersReducedMotion() || typeof view.startViewTransition !== 'function') {
      commit();
      return;
    }

    view.startViewTransition(commit);
  }

  private reflect(theme: Theme): void {
    document.documentElement.dataset['theme'] = theme;
    document
      .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_COLOR[theme]);
  }

  private persist(theme: Theme): void {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Modo privado o almacenamiento bloqueado: el tema vale para esta sesión.
    }
  }
}
