import { TestBed } from '@angular/core/testing';
import { Icon } from './icon';

describe('Icon', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Icon] }).compileComponents();
  });

  const render = async (name: string) => {
    const fixture = TestBed.createComponent(Icon);
    fixture.componentRef.setInput('name', name);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  };

  it('dibuja el icono del sol', async () => {
    const element = await render('sun');
    // Disco central más los ocho rayos.
    expect(element.querySelectorAll('path').length).toBe(9);
  });

  it('dibuja el icono de la luna', async () => {
    const element = await render('moon');
    expect(element.querySelectorAll('path').length).toBe(1);
  });
});
