import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the hero headline', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('bien hecho');
  });

  it('should render every landing section', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    for (const id of [
      'nosotros',
      'servicios',
      'tecnologias',
      'productos',
      'modelos',
      'portafolio',
      'proceso',
      'equipo',
      'testimonios',
      'faq',
      'contacto',
    ]) {
      expect(compiled.querySelector(`#${id}`)).toBeTruthy();
    }
  });
});
