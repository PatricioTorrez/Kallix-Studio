import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    TestBed.configureTestingModule({});
  });

  it('arranca en oscuro cuando no hay preferencia guardada', () => {
    expect(TestBed.inject(ThemeService).theme()).toBe('dark');
  });

  it('lee el tema guardado al construirse', () => {
    localStorage.setItem('kx-theme', 'light');
    expect(TestBed.inject(ThemeService).theme()).toBe('light');
  });

  it('ignora un valor guardado que no es un tema válido', () => {
    localStorage.setItem('kx-theme', 'banana');
    expect(TestBed.inject(ThemeService).theme()).toBe('dark');
  });

  it('refleja el tema inicial en <html> sin necesidad de tocar nada', () => {
    localStorage.setItem('kx-theme', 'light');
    TestBed.inject(ThemeService);
    expect(document.documentElement.dataset['theme']).toBe('light');
  });

  it('toggle alterna el tema y lo escribe en <html>', () => {
    const service = TestBed.inject(ThemeService);

    service.toggle();
    expect(service.theme()).toBe('light');
    expect(document.documentElement.dataset['theme']).toBe('light');

    service.toggle();
    expect(service.theme()).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');
  });

  it('persiste la elección en localStorage', () => {
    TestBed.inject(ThemeService).toggle();
    expect(localStorage.getItem('kx-theme')).toBe('light');
  });

  it('set al tema que ya está activo no hace nada', () => {
    const service = TestBed.inject(ThemeService);
    service.set('dark');
    expect(service.theme()).toBe('dark');
    expect(localStorage.getItem('kx-theme')).toBeNull();
  });

  it('sobrevive a un localStorage que lanza', () => {
    const original = Storage.prototype.getItem;
    Storage.prototype.getItem = () => {
      throw new Error('almacenamiento bloqueado');
    };

    try {
      expect(TestBed.inject(ThemeService).theme()).toBe('dark');
    } finally {
      Storage.prototype.getItem = original;
    }
  });

  it('actualiza el meta theme-color si existe', () => {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = '#04161C';
    document.head.append(meta);

    try {
      TestBed.inject(ThemeService).toggle();
      expect(meta.content).toBe('#F4F1EC');
    } finally {
      meta.remove();
    }
  });
});
