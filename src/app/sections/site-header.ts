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
  private spy?: IntersectionObserver;
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
    this.spy?.disconnect();
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
    });
  };

  private watchSections(): void {
    if (typeof IntersectionObserver === 'undefined') return;

    const targets = this.links
      .map((link) => document.querySelector(link.href))
      .filter((element): element is Element => !!element);

    this.spy = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) this.active.set(`#${entry.target.id}`);
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );

    targets.forEach((target) => this.spy!.observe(target));
  }
}
