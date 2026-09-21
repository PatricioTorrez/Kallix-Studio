# Animaciones de firma de `productos` — desactivadas

**Nada de esta carpeta se compila ni se sirve.** Es código vivo puesto en pausa,
no código muerto: está completo y verificado, solo desconectado.

Se desactivó el **2026-09-21** por dos comentarios del equipo sobre la sección
de productos:

1. «Yo digo que sea un carrusel donde se vea como un avance de la siguiente
   card.»
2. «Que se vea más profesional.»

Patricio pidió no borrarlas: moverlas aquí y reactivarlas si algún día se
quieren de vuelta.

## Qué había

Cada logo tenía una animación de firma propia, de 5 s en tres actos —entrada,
intermedio y final—, que corría al aparecer su diapositiva y al pasar el
puntero por la ficha:

| Producto | Firma                                                                                                                      |
| -------- | -------------------------------------------------------------------------------------------------------------------------- |
| Kalen    | Un mazo de juez golpea el icono dos veces (onda en el primero); el expediente sale en abanico y el mazo se retira          |
| Kineti   | La barra cae sobre el icono: sentadilla, press sobre la cabeza con la barra flexionándose, golpe, temblor, doble latido    |
| Kivo     | Un ticket con su $ sale por detrás y se escanea; confirma con un pulso, saltan tres monedas y aparecen avisos «+$» y «−$»  |
| Kora     | Caen unos audífonos, quedan puestos alrededor del logo y baila al compás; notas, ondas y un ecualizador en lugar de sombra |

Con ellas se fue también el escenario luminoso del icono: halo de marca que
respiraba, anillos concéntricos, brillo de vidrio, reflejo que seguía al
puntero y sombra de contacto.

## Archivos

| Archivo                | Qué es                                                                                                         |
| ---------------------- | -------------------------------------------------------------------------------------------------------------- |
| `products.motion.css`  | Reglas comunes: `--play`, los tres actos, `max-width` de las piezas anchas, la red de `prefers-reduced-motion` |
| `products.kalen.css`   | Firma de Kalen (mazo, expediente, sello)                                                                       |
| `products.kineti.css`  | Firma de Kineti (barra, pulsos, líneas)                                                                        |
| `products.kivo.css`    | Firma de Kivo (ticket, monedas, avisos)                                                                        |
| `products.kora.css`    | Firma de Kora (audífonos, notas, ondas, ecualizador)                                                           |
| `products.stage.css`   | Las capas del escenario que las firmas animan o necesitan (`.floor`, `.halo`, `.rings`, `.gloss`, `.spot`)     |
| `products.motion.html` | El recorte literal de plantilla: las piezas que van dentro de `.icon-stack`                                    |

## Cómo reactivarlas

Cuatro pasos. Los cuatro hacen falta: las hojas de firma animan elementos que
hoy no existen en la plantilla.

### 1 · `products.ts` — devolver los estilos y el disparador

```ts
import { ElementRef, afterNextRender, inject, signal, viewChild, DestroyRef } from '@angular/core';
import { prefersReducedMotion } from '../core/motion';
import { Tilt } from '../core/tilt.directive';

/** Debe coincidir con `--play` en `products.motion.css`; el margen evita
    quitar la clase un frame antes del final. */
const PLAY_MS = 5000 + 120;

// En el decorador:
//   imports: [..., Tilt],
//   styleUrls: [
//     './products.css',
//     './products-motion/products.stage.css',
//     './products-motion/products.motion.css',
//     './products-motion/products.kalen.css',
//     './products-motion/products.kineti.css',
//     './products-motion/products.kivo.css',
//     './products-motion/products.kora.css',
//   ],

  /** Productos cuya animación de firma está corriendo ahora mismo. */
  protected readonly playing = signal<ReadonlySet<string>>(new Set());

  private readonly catalog = viewChild.required('catalog', { read: ElementRef });
  private readonly timers = new Map<string, number>();
  private current = 0;
  private visible = false;

  constructor() {
    const destroyRef = inject(DestroyRef);

    // «Al mostrarse»: cuando el carrusel entra en pantalla se anima el logo que
    // está a la vista; después, cada vez que cambia de diapositiva.
    afterNextRender(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          this.visible = entry.isIntersecting;
          if (this.visible) this.play(PRODUCTS[this.current].id);
        },
        { threshold: 0.45 },
      );
      observer.observe(this.catalog().nativeElement);

      destroyRef.onDestroy(() => {
        observer.disconnect();
        this.timers.forEach((timer) => clearTimeout(timer));
      });
    });
  }

  protected onActiveChange(index: number): void {
    this.current = index;
    if (this.visible) this.play(PRODUCTS[index].id);
  }

  /** Arranca la firma de un logo. Si ya está corriendo no la reinicia a medias. */
  protected play(id: string): void {
    if (prefersReducedMotion() || this.playing().has(id)) return;

    this.playing.update((ids) => new Set(ids).add(id));
    this.timers.set(
      id,
      setTimeout(() => {
        this.timers.delete(id);
        this.playing.update((ids) => {
          const next = new Set(ids);
          next.delete(id);
          return next;
        });
      }, PLAY_MS) as unknown as number,
    );
  }
```

### 2 · `products.html` — el carrusel y la ficha

En `<kx-carousel>`: añadir `#catalog` y `(activeChange)="onActiveChange($event)"`.

En `<article class="product">`: añadir
`[class.is-playing]="playing().has(product.id)"` y `(pointerenter)="play(product.id)"`.

Dentro de `.stage`, antes de `.icon-stack`:

```html
<span class="halo" aria-hidden="true"></span> <span class="rings" aria-hidden="true"></span>
```

Dentro de `.icon-stack`: sustituir el `<img class="app-icon">` suelto por los
tres bloques de `products.motion.html`, en ese orden.

### 3 · `products.css` — quitar lo que sobra

El escenario sobrio define `.icon` con su propia sombra y sin `.floor`.
`products.stage.css` trae la versión con capas y sobrescribe `min-height` de
`.stage`; cárgalo **después** de `products.css` en `styleUrls` (paso 1) y
revisa que no queden duplicadas las reglas de `.icon`.

### 4 · Volver a medir

- Presupuesto de estilos: 12 kB por componente (`angular.json`). Por eso hay una
  hoja por producto en vez de una sola.
- `.stage` recorta (`overflow: clip`): barrer los 5 s de las cuatro firmas y
  comprobar **0 px de desbordamiento** contra `.stage`, a 1280 y a 390 px.
- El fotograma 100 % de cada animación tiene que ser idéntico al reposo: al
  quitarse `.is-playing` nada debe saltar ni quedarse puesto.
