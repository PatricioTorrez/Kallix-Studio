import { TestBed } from '@angular/core/testing';
import { ThemeService } from '../core/theme.service';
import { SiteHeader } from './site-header';

describe('SiteHeader — control de tema', () => {
  beforeEach(async () => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    await TestBed.configureTestingModule({ imports: [SiteHeader] }).compileComponents();
  });

  const render = async () => {
    const fixture = TestBed.createComponent(SiteHeader);
    await fixture.whenStable();
    return fixture;
  };

  it('anuncia el tema al que se va a cambiar', async () => {
    const fixture = await render();
    const button = (fixture.nativeElement as HTMLElement).querySelector('.theme-btn')!;

    expect(button.getAttribute('aria-label')).toBe('Cambiar a tema claro');
    expect(button.getAttribute('aria-pressed')).toBe('false');
  });

  it('cambia el tema al pulsarlo y actualiza su etiqueta', async () => {
    const fixture = await render();
    const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
      '.theme-btn',
    )!;

    button.click();
    await fixture.whenStable();

    expect(TestBed.inject(ThemeService).theme()).toBe('light');
    expect(button.getAttribute('aria-label')).toBe('Cambiar a tema oscuro');
    expect(button.getAttribute('aria-pressed')).toBe('true');
  });

  it('ofrece el mismo control dentro del menú móvil', async () => {
    const fixture = await render();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('.drawer .theme-row button'),
    ).toBeTruthy();
  });
});

describe('SiteHeader — desplegable «Más»', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SiteHeader] }).compileComponents();
  });

  it('abre, se cierra con Escape y devuelve el foco al botón', async () => {
    const fixture = TestBed.createComponent(SiteHeader);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const button = root.querySelector<HTMLButtonElement>('.more-btn')!;

    button.click();
    await fixture.whenStable();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(root.querySelector('.more-menu.is-open')).toBeTruthy();

    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await fixture.whenStable();
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(button);
  });

  it('se cierra con un clic fuera', async () => {
    const fixture = TestBed.createComponent(SiteHeader);
    await fixture.whenStable();
    const button = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
      '.more-btn',
    )!;

    button.click();
    await fixture.whenStable();
    document.body.click();
    await fixture.whenStable();
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });
});
