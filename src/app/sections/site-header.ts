import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ThemeService } from '../core/theme.service';
import { NAV_LINKS } from '../data/kallix.data';
import { Icon } from '../ui/icon';
import { Logo } from '../ui/logo';

@Component({
  selector: 'kx-site-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Logo, Icon],
  templateUrl: './site-header.html',
  styleUrl: './site-header.css',
})
export class SiteHeader implements OnDestroy {
  protected readonly links = NAV_LINKS;
  protected readonly scrolled = signal(false);
  protected readonly menuOpen = signal(false);
  protected readonly active = signal<string>('');

  private readonly themeService = inject(ThemeService);

  protected readonly isLight = computed(() => this.themeService.theme() === 'light');
  protected readonly themeLabel = computed(() =>
    this.isLight() ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro',
  );

  private readonly progressBar = viewChild.required<ElementRef<HTMLElement>>('progress');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private sections: { href: string; element: HTMLElement }[] = [];
  private frame = 0;

  constructor() {
    effect(() => {
      const open = this.menuOpen();

      // El bloqueo de scroll acompaña al menú: sin él, el fondo se desliza detrás.
      document.body.style.overflow = open ? 'hidden' : '';

      // Y el fondo queda inerte: sin esto el tabulador se escapa por detrás del panel.
      this.setBackgroundInert(open);

      if (open) {
        requestAnimationFrame(() => this.host.querySelector<HTMLElement>('.drawer a')?.focus());
      }
    });

    // Después del primer render: la barra de progreso y las secciones que se
    // observan ya existen en el DOM.
    afterNextRender(() => {
      addEventListener('scroll', this.onScroll, { passive: true });
      addEventListener('resize', this.onScroll, { passive: true });
      this.onScroll();
      this.watchSections();
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frame);
    removeEventListener('scroll', this.onScroll);
    removeEventListener('resize', this.onScroll);
    document.body.style.overflow = '';
    this.setBackgroundInert(false);
  }

  private setBackgroundInert(inert: boolean): void {
    for (const selector of ['#main', 'kx-site-footer']) {
      const element = document.querySelector(selector);
      if (!element) continue;
      if (inert) element.setAttribute('inert', '');
      else element.removeAttribute('inert');
    }
  }

  protected toggleTheme(): void {
    this.themeService.toggle();
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.menuOpen()) {
      this.closeMenu();
      this.host.querySelector<HTMLButtonElement>('.menu-btn')?.focus();
    }
  }

  /**
   * La barra de progreso se escribe directamente en el DOM: pasarla por una
   * señal dispararía detección de cambios en cada frame de scroll.
   */
  private readonly onScroll = () => {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      const scrolled = scrollY;
      const max = document.documentElement.scrollHeight - innerHeight;
      const progress = max > 0 ? Math.min(scrolled / max, 1) : 0;
      this.progressBar().nativeElement.style.transform = `scaleX(${progress.toFixed(4)})`;
      if (this.scrolled() !== scrolled > 8) this.scrolled.set(scrolled > 8);
      // `set` con el mismo valor no notifica, así que esto no dispara CD por frame.
      this.active.set(this.sectionAtReadingLine());
    });
  };

  private watchSections(): void {
    this.sections = this.links
      .map((link) => ({ href: link.href, element: document.querySelector<HTMLElement>(link.href) }))
      .filter((section): section is { href: string; element: HTMLElement } => !!section.element);
  }

  /**
   * Qué sección cruza la línea de lectura (45% de la altura de la ventana).
   *
   * Se calcula entero en cada frame en lugar de reaccionar a un
   * `IntersectionObserver`: aquel solo **asignaba** el resaltado y nunca lo
   * quitaba, así que la última sección visitada se quedaba encendida sobre el
   * hero, sobre el CTA y sobre cualquier tramo sin entrada en el menú. Devolver
   * cadena vacía cuando no hay nada es justo lo que faltaba.
   */
  private sectionAtReadingLine(): string {
    const line = scrollY + innerHeight * 0.45;

    for (const { href, element } of this.sections) {
      const rect = element.getBoundingClientRect();
      const top = rect.top + scrollY;
      if (line >= top && line < top + rect.height) return href;
    }

    return '';
  }
}
