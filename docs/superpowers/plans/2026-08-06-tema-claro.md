# Tema claro con anclas oscuras — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir un tema claro y un control para cambiarlo, manteniendo hero, clientes, CTA y footer permanentemente oscuros.

**Architecture:** Los roles semánticos de color salen de `:root` a una lista de selectores que incluye `[data-theme='light'] .on-dark`, de modo que cualquier subárbol marcado con `.on-dark` conserva los tokens oscuros aunque la página esté en claro. Un `ThemeService` escribe `data-theme` en `<html>` de forma síncrona (para que `startViewTransition` fotografíe el DOM ya cambiado) y persiste la elección en `localStorage`.

**Tech Stack:** Angular 22 (signals, `ChangeDetectionStrategy.OnPush`), CSS custom properties, View Transitions API, vitest + jsdom.

**Spec:** `docs/superpowers/specs/2026-08-06-tema-claro-design.md`

## Global Constraints

- **Cero dependencias nuevas.** El proyecto no tiene ninguna añadida y sigue así.
- **Solo se anima `transform` y `opacity`.** Excepciones ya sancionadas: `clip-path` en tabs, `grid-template-rows` en el acordeón. El crossfade de tema va por View Transitions API, que ocurre en el compositor y no cuenta.
- **Nunca `transition: all`, nunca `ease-in`, nunca `scale(0)`.**
- **Todo `:hover` con movimiento** va dentro de `@media (hover: hover) and (pointer: fine)`.
- **Todo lo que se mueve** tiene variante en `@media (prefers-reduced-motion: reduce)`.
- **Los colores de componente que varían por tema van por token global**, nunca por `:host-context(...)`: ese selector no ve la frontera `.on-dark` y pondría en claro un badge dentro del hero.
- **Comentarios en español**, como el resto del código.
- **Clave de `localStorage`:** `kx-theme`. **Atributo:** `data-theme` en `<html>`. **Valores:** `dark` | `light`.
- Comandos: `npx ng test --watch=false` · `npx ng build --configuration production` · `npx ng serve --port 4321`

---

## File Structure

| Archivo | Responsabilidad |
| --- | --- |
| `src/app/core/theme.service.ts` | **Nuevo.** Único dueño del estado de tema: lectura, escritura al DOM, persistencia, transición |
| `src/app/core/theme.service.spec.ts` | **Nuevo.** Pruebas del servicio |
| `src/index.html` | Script anti-parpadeo antes del primer pintado; metas `color-scheme` y `theme-color` |
| `src/styles.css` | Los dos bloques de roles semánticos, los tokens nuevos, `.on-dark`, reglas de view-transition |
| `src/app/app.html` | Marca las tres zonas oscuras |
| `src/app/ui/icon.ts` | +2 glifos: `sun`, `moon` |
| `src/app/sections/site-header.{ts,html,css}` | El control: botón en la barra (≥900px) y fila en el drawer (<900px) |
| `src/app/ui/badge.ts`, `src/app/ui/logo.ts` | Literales de color a tokens |
| 8 CSS de sección | Literales que asumen fondo oscuro, a `--veil` / `--substrate` |

---

## Task 1: ThemeService y persistencia sin parpadeo

**Files:**
- Create: `src/app/core/theme.service.ts`
- Create: `src/app/core/theme.service.spec.ts`
- Modify: `src/index.html:12-13` (metas) y el `<head>` (script)

**Interfaces:**
- Consumes: `prefersReducedMotion()` de `src/app/core/motion.ts`
- Produces:
  - `export type Theme = 'dark' | 'light'`
  - `class ThemeService` con `readonly theme: Signal<Theme>`, `toggle(): void`, `set(theme: Theme): void`. Inyectable con `inject(ThemeService)`; es `providedIn: 'root'`.

- [ ] **Step 1: Escribir las pruebas que fallan**

Crear `src/app/core/theme.service.spec.ts`:

```ts
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
```

- [ ] **Step 2: Correr las pruebas y verificar que fallan**

Run: `npx ng test --watch=false`
Expected: FAIL — no existe el módulo `./theme.service`.

- [ ] **Step 3: Escribir el servicio**

Crear `src/app/core/theme.service.ts`:

```ts
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
```

- [ ] **Step 4: Correr las pruebas y verificar que pasan**

Run: `npx ng test --watch=false`
Expected: PASS — las 9 nuevas más las 3 que ya existían.

- [ ] **Step 5: Añadir el script anti-parpadeo y ajustar los metas**

En `src/index.html`, cambiar la línea 13 de:

```html
  <meta name="color-scheme" content="dark">
```

a:

```html
  <meta name="color-scheme" content="dark light">
```

Y justo después de esa línea, añadir:

```html
  <!-- Antes del primer pintado: quien ya eligió claro no debe ver un fogonazo
       oscuro. El visitante nuevo no parpadea, porque oscuro es el default. -->
  <script>
    try {
      var t = localStorage.getItem('kx-theme');
      if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
    } catch (e) {}
  </script>
```

`<meta name="theme-color" content="#04161C">` (línea 12) se queda como está: es el valor de arranque y el servicio lo actualiza.

- [ ] **Step 6: Verificar que el build sigue limpio**

Run: `npx ng build --configuration production`
Expected: sin warnings. El script inline es del documento, no del bundle, así que el tamaño no cambia.

- [ ] **Step 7: Commit**

```bash
git add src/app/core/theme.service.ts src/app/core/theme.service.spec.ts src/index.html
git commit -m "Add ThemeService with localStorage persistence and no-flash script"
```

---

## Task 2: Tokens — mecanismo de zonas y paleta clara

**Files:**
- Modify: `src/styles.css:7-77` (bloque `:root`), `src/styles.css:478-488` (`.grid-bg`)
- Create: `scripts/contrast.mjs` (herramienta de verificación, se queda en el repo)

**Interfaces:**
- Produces: los tokens que consumen todas las tareas siguientes — `--veil`, `--substrate`, `--grid-line`, `--badge-teal`, `--badge-amber`, `--badge-rust`, más los roles ya existentes ahora definidos en dos temas. Y la clase `.on-dark`.

- [ ] **Step 1: Escribir el verificador de contraste**

Crear `scripts/contrast.mjs`. No es una prueba unitaria: es la herramienta que decide los valores de la paleta clara, y hay que poder volver a correrla si se retocan.

```js
/** Contraste WCAG 2.1 entre pares de colores. Uso: node scripts/contrast.mjs */

const luminance = (hex) => {
  const [r, g, b] = hex
    .replace('#', '')
    .match(/../g)
    .map((h) => {
      const c = parseInt(h, 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** [nombre, primer plano, fondo, mínimo exigido] */
const PAIRS = [
  ['text / bg', '#06202a', '#f4f1ec', 4.5],
  ['text-muted / bg', '#3d5f63', '#f4f1ec', 4.5],
  ['text-dim / bg', '#64807f', '#f4f1ec', 3.0],
  ['accent / bg', '#a96c16', '#f4f1ec', 3.0],
  ['accent-ink / accent', '#fffdf7', '#a96c16', 4.5],
  ['badge-teal / bg', '#1f6b66', '#f4f1ec', 4.5],
  ['badge-amber / bg', '#8a5a12', '#f4f1ec', 4.5],
  ['badge-rust / bg', '#9c4a17', '#f4f1ec', 4.5],
];

let failed = false;

for (const [name, fg, bg, min] of PAIRS) {
  const value = ratio(fg, bg);
  const ok = value >= min;
  if (!ok) failed = true;
  console.log(`${ok ? 'OK  ' : 'FALLA'} ${name.padEnd(22)} ${value.toFixed(2)}:1 (mín ${min})`);
}

process.exit(failed ? 1 : 0);
```

- [ ] **Step 2: Correr el verificador y ajustar la paleta hasta que pase**

Run: `node scripts/contrast.mjs`
Expected: todas las líneas en `OK`. Si alguna falla, oscurecer ese color en `PAIRS` y volver a correr **antes** de escribir el CSS. Los valores del Step 3 deben ser exactamente los que quedaron aquí.

- [ ] **Step 3: Partir el bloque `:root` en paleta cruda + dos juegos de roles**

En `src/styles.css`, el bloque `:root` actual (líneas 7-77) mezcla paleta cruda con roles semánticos. Se parte en tres.

**3a.** Dejar en `:root` solo lo que no depende del tema — la paleta cruda (líneas 9-23), tipografía (42-45), radios (48-53), layout (56-59) y motion (62-69). Es decir, **borrar de `:root`** el bloque "Roles semánticos" (líneas 25-39) y el bloque "Sombras" (líneas 71-76).

**3b.** Añadir justo después del `:root`:

```css
/* ============================================================================
   Roles semánticos — oscuro

   Es el default, y también lo que rige dentro de cualquier `.on-dark` cuando la
   página está en claro: `[data-theme='light'] .on-dark` (0,2,0) gana a
   `[data-theme='light']` (0,1,0), y las custom properties se heredan a todo el
   subárbol. Así el hero conserva su lienzo sin que el JS sepa nada.
   ========================================================================= */

:root,
[data-theme='light'] .on-dark {
  /* Tinte de superficies y bordes: luz sobre oscuro. */
  --veil: 207, 240, 234;
  /* Fondo de scrims, desvanecidos y cristal. */
  --substrate: 4, 22, 28;

  --bg: var(--ink-950);
  --bg-raised: #06202a;
  --surface: rgba(var(--veil), 0.035);
  --surface-2: rgba(var(--veil), 0.06);
  --surface-3: rgba(var(--veil), 0.09);
  --stroke: rgba(var(--veil), 0.11);
  --stroke-strong: rgba(var(--veil), 0.2);
  --text: #eaf3f1;
  --text-muted: #a3bfbf;
  --text-dim: #789797;
  --accent: var(--amber-500);
  --accent-soft: rgba(231, 168, 78, 0.14);
  --accent-ink: #14252c;
  --focus: var(--teal-300);

  /* `.grid-bg` sale en el hero (oscuro) y en estadísticas (claro). */
  --grid-line: rgba(136, 201, 196, 0.06);

  /* Tonos de `badge.ts`. Por token, no por `:host-context`: ese selector no ve
     la frontera `.on-dark` y pondría en claro un badge dentro del hero. */
  --badge-teal: #a8ddd7;
  --badge-amber: #f0c075;
  --badge-rust: #eda274;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 12px 32px -18px rgba(0, 0, 0, 0.9);
  --shadow-lg: 0 30px 70px -40px rgba(0, 0, 0, 1);
  --glow-accent: 0 14px 40px -18px rgba(231, 168, 78, 0.65);
  --glow-teal: 0 14px 40px -18px rgba(62, 155, 148, 0.5);
}

/* ============================================================================
   Roles semánticos — claro
   ========================================================================= */

[data-theme='light'] {
  --veil: 4, 22, 28;
  --substrate: 244, 241, 236;

  --bg: var(--cream);
  --bg-raised: #fbfaf8;
  --surface: rgba(var(--veil), 0.035);
  --surface-2: rgba(var(--veil), 0.06);
  --surface-3: rgba(var(--veil), 0.09);
  --stroke: rgba(var(--veil), 0.12);
  --stroke-strong: rgba(var(--veil), 0.22);
  --text: #06202a;
  --text-muted: #3d5f63;
  --text-dim: #64807f;
  /* El ámbar #e7a84e no pasa contraste sobre crema; se oscurece y la tinta invierte. */
  --accent: #a96c16;
  --accent-soft: rgba(169, 108, 22, 0.12);
  --accent-ink: #fffdf7;
  /* El teal-300 es prácticamente invisible sobre crema. */
  --focus: #2b7d77;

  --grid-line: rgba(var(--veil), 0.07);

  --badge-teal: #1f6b66;
  --badge-amber: #8a5a12;
  --badge-rust: #9c4a17;

  /* Negro puro a alfa alta ensucia sobre claro: se tinta con ink y se suaviza. */
  --shadow-sm: 0 1px 2px rgba(var(--veil), 0.08);
  --shadow-md: 0 12px 32px -18px rgba(var(--veil), 0.35);
  --shadow-lg: 0 30px 70px -40px rgba(var(--veil), 0.45);
  --glow-accent: 0 14px 40px -18px rgba(169, 108, 22, 0.4);
  --glow-teal: 0 14px 40px -18px rgba(43, 125, 119, 0.32);
}

/* Una zona oscura pinta su propio lienzo: redefinir tokens no basta si la
   sección era transparente y heredaba el fondo del body. */
.on-dark {
  background: var(--bg);
  color: var(--text);
}
```

**3c.** Sustituir los valores de `.grid-bg` (líneas 483-484) por el token:

```css
  background-image:
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
```

(El `#000` del `mask-image` de las líneas 486-487 **no se toca**: en una máscara solo cuenta el canal alfa.)

- [ ] **Step 4: Añadir las reglas de la transición de tema**

Al final de `src/styles.css`:

```css
/* ============================================================================
   Cambio de tema

   Crossfade en el compositor. No animamos `background-color` en toda la página:
   sería exactamente lo que prohíbe la regla de motion del proyecto. Los 320 ms
   pasan de los 300 de la UI a propósito — un cambio de tema es explicativo.
   ========================================================================= */

::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 320ms;
  animation-timing-function: var(--ease-out);
}

@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }
}
```

- [ ] **Step 5: Verificar que nada se rompió en oscuro**

Run: `npx ng build --configuration production` — sin warnings.
Run: `npx ng test --watch=false` — en verde.

El refactor de los roles oscuros produce **exactamente los mismos valores** que antes (`rgba(var(--veil), 0.035)` con `--veil: 207, 240, 234` es `rgba(207, 240, 234, 0.035)`). Si algo se ve distinto en oscuro, es un error de transcripción.

- [ ] **Step 6: Commit**

```bash
git add src/styles.css scripts/contrast.mjs
git commit -m "Split color roles into dark and light token sets with .on-dark zones"
```

---

## Task 3: Marcar las zonas oscuras

**Files:**
- Modify: `src/app/app.html:6,7,14,23`
- Modify: `src/app/app.spec.ts`

**Interfaces:**
- Consumes: la clase `.on-dark` de la Task 2.

- [ ] **Step 1: Comprobar que los hosts pueden pintar fondo**

`.on-dark` pinta `background`, y un elemento personalizado sin `display` declarado es `inline` — el fondo saldría mal.

Run: `grep -n -A3 ':host' src/app/sections/hero.css src/app/sections/site-footer.css src/app/sections/clients.ts src/app/sections/cta.ts`

Expected: cada uno debe resolver a `display: block` (o `contents`). Anotar el resultado:
- Si un host es `display: block` o no declara nada pero su CSS ya pinta fondo → sin acción.
- Si un host es `display: contents` → la clase **no** puede ir en el host; ponerla en el `<section>` interno del componente.
- Si un host es inline por defecto → añadir `display: block` a su `:host` en el mismo commit.

- [ ] **Step 2: Escribir la prueba que falla**

Añadir a `src/app/app.spec.ts`, dentro del `describe('App')`:

```ts
  it('marca como oscuras las zonas que conservan el lienzo del hero', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    for (const selector of ['kx-hero', 'kx-clients', 'kx-cta', 'kx-site-footer']) {
      expect(compiled.querySelector(`${selector}.on-dark`)).toBeTruthy();
    }
  });

  it('no marca como oscuras las secciones del cuerpo', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    for (const selector of ['kx-about', 'kx-services', 'kx-pricing', 'kx-contact']) {
      expect(compiled.querySelector(`${selector}.on-dark`)).toBeNull();
    }
  });
```

> Si el Step 1 obligó a mover la clase a un `<section>` interno en algún componente, ajustar ese selector en la prueba al elemento real.

- [ ] **Step 3: Correr la prueba y verificar que falla**

Run: `npx ng test --watch=false`
Expected: FAIL — `expect(null).toBeTruthy()` en la primera de las dos nuevas.

- [ ] **Step 4: Aplicar las clases**

En `src/app/app.html`:

```html
<a class="skip-link" href="#main">Saltar al contenido</a>

<kx-site-header />

<main id="main">
  <!-- Zonas oscuras permanentes: el pixel art, las scanlines, el sol de bandas
       y los glows están construidos sobre lienzo oscuro. -->
  <kx-hero class="on-dark" />
  <kx-clients class="on-dark" />
  <kx-about />
  <kx-services />
  <kx-tech />
  <kx-products />
  <kx-pricing />
  <kx-portfolio />
  <kx-cta class="on-dark" />
  <kx-process />
  <kx-stats />
  <kx-team />
  <kx-testimonials />
  <kx-faq />
  <kx-contact />
</main>

<kx-site-footer class="on-dark" />
```

- [ ] **Step 5: Correr las pruebas y verificar que pasan**

Run: `npx ng test --watch=false`
Expected: PASS — 5 pruebas de `App` más las 9 de `ThemeService`.

- [ ] **Step 6: Comprobar a ojo que en oscuro no cambió nada**

Run: `npx ng serve --port 4321`
Abrir `http://localhost:4321`. La página sigue en oscuro (aún no hay control) y debe verse idéntica a antes. `.on-dark` pinta el mismo `--bg` que el body.

- [ ] **Step 7: Commit**

```bash
git add src/app/app.html src/app/app.spec.ts
git commit -m "Mark hero, clients, CTA and footer as permanent dark zones"
```

---

## Task 4: Iconos sun y moon

**Files:**
- Modify: `src/app/ui/icon.ts:49-50` (junto a `menu` y `close`)
- Create: `src/app/ui/icon.spec.ts`

**Interfaces:**
- Produces: `'sun'` y `'moon'` como miembros válidos del tipo `IconName`, consumidos por la Task 5.

- [ ] **Step 1: Escribir la prueba que falla**

Crear `src/app/ui/icon.spec.ts`:

```ts
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
```

- [ ] **Step 2: Correr la prueba y verificar que falla**

Run: `npx ng test --watch=false`
Expected: FAIL — `ICONS['sun']` es `undefined`, así que `glyph().paths` revienta.

- [ ] **Step 3: Añadir los glifos**

En `src/app/ui/icon.ts`, justo después de la línea 50 (`close`):

```ts
  sun: {
    paths: [
      'M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8',
      'M12 2.5v2',
      'M12 19.5v2',
      'M2.5 12h2',
      'M19.5 12h2',
      'M5.1 5.1l1.4 1.4',
      'M17.5 17.5l1.4 1.4',
      'M5.1 18.9l1.4-1.4',
      'M17.5 6.5l1.4-1.4',
    ],
  },
  moon: { paths: ['M20 14.5A8.5 8.5 0 0 1 9.5 4a7.5 7.5 0 1 0 10.5 10.5z'] },
```

El disco usa el mismo idioma de arcos que `target` (línea 51) y la luna es un solo trazo cerrado, coherente con el remate cuadrado del set.

- [ ] **Step 4: Correr la prueba y verificar que pasa**

Run: `npx ng test --watch=false`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/ui/icon.ts src/app/ui/icon.spec.ts
git commit -m "Add sun and moon icons"
```

---

## Task 5: El control de tema en el header

**Files:**
- Modify: `src/app/sections/site-header.ts`, `site-header.html`, `site-header.css`
- Create: `src/app/sections/site-header.spec.ts`

**Interfaces:**
- Consumes: `ThemeService` (Task 1), iconos `sun`/`moon` (Task 4).

- [ ] **Step 1: Escribir la prueba que falla**

Crear `src/app/sections/site-header.spec.ts`:

```ts
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
```

- [ ] **Step 2: Correr la prueba y verificar que falla**

Run: `npx ng test --watch=false`
Expected: FAIL — `querySelector('.theme-btn')` devuelve `null`.

- [ ] **Step 3: Conectar el servicio en el componente**

En `src/app/sections/site-header.ts`, añadir el import y los miembros. El bloque de imports pasa a incluir `ThemeService`:

```ts
import { ThemeService } from '../core/theme.service';
```

Y dentro de la clase, junto a las demás propiedades protegidas (después de la línea 27, `active`):

```ts
  private readonly themeService = inject(ThemeService);

  protected readonly isLight = computed(() => this.themeService.theme() === 'light');
  protected readonly themeLabel = computed(() =>
    this.isLight() ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro',
  );

  protected toggleTheme(): void {
    this.themeService.toggle();
  }
```

`computed` hay que añadirlo al import de `@angular/core` de la línea 1-11, que ya trae `inject` y `signal`.

- [ ] **Step 4: Añadir el botón a la barra y la fila al drawer**

En `src/app/sections/site-header.html`, dentro de `<div class="actions">` (línea 25), **antes** del enlace `.cta` para no competir con él:

```html
      <button
        type="button"
        class="theme-btn"
        [attr.aria-label]="themeLabel()"
        [attr.aria-pressed]="isLight()"
        (click)="toggleTheme()"
      >
        <kx-icon [name]="isLight() ? 'moon' : 'sun'" [size]="18" />
      </button>
```

Y en el `.drawer`, después del `<nav>` y antes del botón `.btn--primary` (línea 69):

```html
  <div class="theme-row">
    <span>Tema</span>
    <button
      type="button"
      [attr.aria-label]="themeLabel()"
      [attr.aria-pressed]="isLight()"
      (click)="toggleTheme()"
    >
      <kx-icon [name]="isLight() ? 'moon' : 'sun'" [size]="18" />
      {{ isLight() ? 'Claro' : 'Oscuro' }}
    </button>
  </div>
```

- [ ] **Step 5: Estilar el control**

En `src/app/sections/site-header.css`, después del bloque `.menu-btn:active` (línea 124):

```css
/* --- Control de tema ------------------------------------------------------ */

.theme-btn {
  /* En móvil vive en el drawer: la barra ya lleva marca y botón de menú. */
  display: none;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--stroke);
  border-radius: var(--r-pill);
  background: var(--surface);
  color: var(--text-muted);
  cursor: pointer;
  transition:
    transform var(--d-press) var(--ease-out),
    color var(--d-base) ease,
    background-color var(--d-base) ease;
}

.theme-btn:active {
  transform: scale(0.94);
}

/* El icono entrante y el saliente son el mismo nodo: Angular lo reemplaza, y la
   animación de entrada basta para leer el cambio. */
.theme-btn kx-icon,
.theme-row kx-icon {
  animation: theme-icon-in var(--d-fast) var(--ease-out) backwards;
}

@keyframes theme-icon-in {
  from {
    opacity: 0;
    transform: rotate(-90deg) scale(0.7);
  }
}

.theme-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1.25rem;
  border-top: 1px solid var(--stroke);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.theme-row button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.9rem;
  border: 1px solid var(--stroke-strong);
  border-radius: var(--r-pill);
  background: var(--surface);
  color: var(--text);
  font-family: inherit;
  font-size: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
  cursor: pointer;
  transition: transform var(--d-press) var(--ease-out);
}

.theme-row button:active {
  transform: scale(0.96);
}

@media (prefers-reduced-motion: reduce) {
  .theme-btn kx-icon,
  .theme-row kx-icon {
    animation: none;
  }
}
```

Añadir el hover dentro del `@media (hover: hover) and (pointer: fine)` que ya existe en la línea 219:

```css
  .theme-btn:hover {
    background: var(--surface-2);
    color: var(--text);
  }
```

Y mostrar el botón en la barra dentro del `@media (min-width: 900px)` de la línea 230:

```css
  .theme-btn {
    display: grid;
  }
```

- [ ] **Step 6: Correr las pruebas y verificar que pasan**

Run: `npx ng test --watch=false`
Expected: PASS — las 3 nuevas más las 14 anteriores.

> El drawer se renderiza siempre (se oculta con `visibility`), así que la tercera prueba lo encuentra sin necesidad de abrirlo.

- [ ] **Step 7: Probarlo en el navegador**

Run: `npx ng serve --port 4321`

Comprobar: el botón cambia el tema, el icono rota al entrar, el cuerpo pasa a claro, y hero/clientes/CTA/footer siguen oscuros. Recargar y verificar que el tema elegido persiste sin fogonazo.

- [ ] **Step 8: Commit**

```bash
git add src/app/sections/site-header.ts src/app/sections/site-header.html src/app/sections/site-header.css src/app/sections/site-header.spec.ts
git commit -m "Add theme toggle to header bar and mobile drawer"
```

---

## Task 6: Migrar los literales que asumen fondo oscuro

**Files:**
- Modify: `src/app/sections/site-header.css:19,157`
- Modify: `src/app/sections/pricing.css:26`, `services.css:93`, `contact.css:130,146`, `process.css:32`, `team.css:47`
- Modify: `src/app/ui/badge.ts:39,45,51`, `src/app/ui/logo.ts:96`

**Interfaces:**
- Consumes: `--veil`, `--substrate`, `--badge-*` de la Task 2.

- [ ] **Step 1: Sustituir los literales de sustrato y de velo**

Cada sustitución conserva la alfa original; solo cambia el color base para que siga el tema.

| Archivo:línea | De | A |
| --- | --- | --- |
| `site-header.css:19` | `rgba(4, 22, 28, 0.72)` | `rgba(var(--substrate), 0.72)` |
| `site-header.css:157` | `rgba(6, 31, 38, 0.92)` | `rgba(var(--substrate), 0.92)` |
| `pricing.css:26` | `rgba(207, 240, 234, 0.03)` | `rgba(var(--veil), 0.03)` |
| `services.css:93` | `rgba(207, 240, 234, 0.03)` | `rgba(var(--veil), 0.03)` |
| `contact.css:130` | `rgba(4, 22, 28, 0.55)` | `rgba(var(--substrate), 0.55)` |
| `contact.css:146` | `rgba(120, 151, 151, 0.7)` | `var(--text-dim)` |
| `process.css:32` | `rgba(4, 22, 28, 0.6)` | `rgba(var(--substrate), 0.6)` |
| `team.css:47` | `rgba(4, 22, 28, 0.7)` | `rgba(var(--substrate), 0.7)` |
| `team.css:47` | `rgba(12, 59, 69, 0.5)` | `rgba(var(--substrate), 0.5)` |

**No tocar** (ya verificado en el spec §4.2):
- `site-header.css:132` — el scrim del menú. Un scrim oscuro es correcto en ambos temas.
- `products.css:66` — `#06212a` es el lienzo de las maquetas SVG y se mantiene oscuro a propósito.
- `hero.css`, `site-footer.css`, `marquee.ts`, `pixel-sprite.ts` — todo está en zona `.on-dark`.

- [ ] **Step 2: Pasar los tonos del badge a tokens**

En `src/app/ui/badge.ts`, cambiar solo las tres líneas de `--badge-fg`:

```css
    :host(.tone-teal) {
      --badge-bg: rgba(62, 155, 148, 0.14);
      --badge-border: rgba(136, 201, 196, 0.32);
      --badge-fg: var(--badge-teal);
    }

    :host(.tone-amber) {
      --badge-bg: rgba(231, 168, 78, 0.14);
      --badge-border: rgba(231, 168, 78, 0.34);
      --badge-fg: var(--badge-amber);
    }

    :host(.tone-rust) {
      --badge-bg: rgba(217, 108, 44, 0.16);
      --badge-border: rgba(217, 108, 44, 0.38);
      --badge-fg: var(--badge-rust);
    }
```

`--badge-bg` y `--badge-border` se quedan: son tintes de acento y entran en la pasada visual de la Task 7.

- [ ] **Step 3: Hacer el logo sensible al tema**

En `src/app/ui/logo.ts` línea 96, el relleno del pixel "K" es blanco fijo y sobre crema desaparecería:

```ts
  protected readonly runs = computed(() => gridToRuns(MARK, { '1': 'var(--text)' }));
```

`var(--text)` es lo que ya usa el propio componente en la línea 45, así que sigue la zona: blanco en el header sobre hero oscuro, tinta oscura cuando la página está en claro.

> Si `gridToRuns` escribe el color en un atributo SVG `fill` en vez de en un estilo, `var(--text)` no resolverá. En ese caso usar `currentColor`, que sí funciona como valor de presentación SVG. Comprobar en `pixel-art.ts` antes de elegir.

- [ ] **Step 4: Verificar**

Run: `npx ng test --watch=false` — en verde.
Run: `npx ng build --configuration production` — sin warnings.

Con la página en **oscuro** todo debe verse exactamente igual que antes: `rgba(var(--substrate), 0.72)` con `--substrate: 4, 22, 28` es el valor original.

- [ ] **Step 5: Commit**

```bash
git add src/app/sections/*.css src/app/ui/badge.ts src/app/ui/logo.ts
git commit -m "Route dark-substrate literals through theme tokens"
```

---

## Task 7: Pasada visual en el navegador y ajuste de tintes

Esta es la tarea que el HANDOFF §8 registra como deuda: *"La página nunca se abrió en un navegador"*. Ahora sí.

**Files:**
- Modify: los CSS de sección que la revisión señale (overrides `[data-theme='light']`)
- Modify: `HANDOFF.md`

**Interfaces:**
- Consumes: todo lo anterior.

- [ ] **Step 1: Levantar la app y recorrerla en ambos temas**

Run: `npx ng serve --port 4321`

Recorrer `http://localhost:4321` en oscuro y en claro. Mirar específicamente:

1. **Las cuatro fronteras oscuro↔claro:** hero→clientes→nosotros · portafolio→CTA→proceso · contacto→footer. Buscar bordes sucios, dobles separadores o sombras que se corten.
2. **El cristal del header** cruzando de zona oscura a clara al hacer scroll.
3. **El drawer móvil en claro** (ventana <900px), incluidos el scrim y la fila "Tema".
4. **Las 8 maquetas SVG** de portafolio y productos sobre tarjeta clara — que el borde las separe del fondo.
5. **Los avatares pixel del equipo** a tamaño real sobre tarjeta clara.
6. **El foco del teclado** en claro: tabular por header, tabs, acordeón del FAQ y formulario.

- [ ] **Step 2: Auditar los tintes de acento sobre crema**

Los ~40 literales `rgba(231,168,78,α)` / `rgba(62,155,148,α)` / `rgba(217,108,44,α)` sobreviven al cambio, pero **un tinte que brilla sobre oscuro casi desaparece sobre crema**. Revisar en claro, en este orden:

`about.css:116` · `contact.css:153,157,162,167,169` · `portfolio.css:43,104` ·
`pricing.css:25,27,124` · `process.css:48,58` · `products.css:14,48,49,53,54,58,59` ·
`services.css:31,44,86,87` · `team.css:32,46,101` · `testimonials.css:51` ·
`badge.ts` (`--badge-bg` y `--badge-border` de los tres tonos)

Para cada uno que se pierda o se ensucie, añadir un override al final del CSS de esa sección. Ejemplo del patrón, con el separador de `services.css:44`:

```css
/* Sobre crema el tinte se pierde: sube la alfa para conservar la misma presencia. */
[data-theme='light'] .divider {
  background: linear-gradient(90deg, rgba(62, 155, 148, 0.38), rgba(231, 168, 78, 0.16));
}
```

Regla práctica: al pasar de oscuro a claro, un tinte necesita entre **1.5× y 2× la alfa** para leerse igual. Expectativa: entre 6 y 12 overrides reales, no 40.

Comprobar aparte los tres hex sólidos de chips en `products.css:49,54,59` (`#e7a84e`, `#3e9b94`, `#d96c2c`) y el `#eda274` de `contact.css:162`: si son texto sobre crema, medirlos con `node scripts/contrast.mjs` añadiéndolos a `PAIRS`, y oscurecerlos vía token si no llegan a 4.5:1.

- [ ] **Step 3: Verificar la transición y `prefers-reduced-motion`**

- El cambio de tema hace un crossfade suave de ~320 ms, sin saltos de layout.
- Activar "reducir movimiento" en el SO y comprobar que el cambio es instantáneo, sin crossfade.

- [ ] **Step 4: Correr Lighthouse**

Con `npx ng build --configuration production` servido, correr Lighthouse. Meta: **>90** en las cuatro categorías. Anotar el resultado — el HANDOFF lo pide y nunca se midió.

- [ ] **Step 5: Verificación final**

Run: `npx ng test --watch=false` — todas en verde.
Run: `npx ng build --configuration production` — sin warnings. Anotar el tamaño transferido y compararlo con los **105 kB** que registra el HANDOFF.
Run: `node scripts/contrast.mjs` — todo en `OK`.

- [ ] **Step 6: Actualizar el HANDOFF**

En `HANDOFF.md`:
- **§1** — nueva métrica de bundle; el conteo de pruebas pasa de 3 a las que haya.
- **§2** — la fila "Tema" de la tabla de decisiones pasa a describir el esquema de zonas.
- **§3** — añadir `core/theme.service.ts` al mapa de archivos.
- **§4** — documentar `--veil`, `--substrate`, `--grid-line`, `--badge-*`, la clase `.on-dark` y **corregir** la frase *"Para cambiar el tema completo basta con editar el bloque `:root`"*, que ya no es cierta: ahora son dos bloques de roles.
- **§5** — añadir como regla 8 que los colores de componente van por token, nunca por `:host-context`.
- **§8** — reescribir: la página **sí** se abrió en un navegador; dejar anotado lo que se comprobó y el resultado de Lighthouse.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Tune light-theme accent tints and update HANDOFF"
```

---

## Self-review

**Cobertura del spec:**

| Sección del spec | Tarea |
| --- | --- |
| §1 mecanismo de zonas | Task 2 (step 3b) |
| §1 regla anti-`:host-context` | Global Constraints + Task 2 + Task 6 (step 2) |
| §2 zonas oscuras | Task 3 |
| §3 tokens nuevos y roles claros | Task 2 |
| §3 verificación de contraste | Task 2 (steps 1-2), Task 7 (step 2) |
| §4.1 literales obligatorios | Task 6 (steps 1-3) |
| §4.2 los que no se tocan | Task 6 (step 1, lista "No tocar") |
| §4.3 ajuste de tintes | Task 7 (step 2) |
| §4.4 SVG en TS | Task 6 (steps 2-3); el resto no requiere trabajo |
| §5 estado y persistencia | Task 1 |
| §5 script anti-parpadeo | Task 1 (step 5) |
| §6 view transitions | Task 1 (servicio) + Task 2 (step 4, CSS) |
| §7 el control | Task 5 |
| §7 accesibilidad | Task 5 (steps 1, 4) + Task 7 (step 1.6) |
| §9 pruebas | Task 1 (9), Task 3 (2), Task 4 (2), Task 5 (3) |
| §10 verificación | Task 7 |

**Consistencia de tipos:** `Theme` se define en Task 1 y se consume en Task 5 vía `themeService.theme()`. La clave `kx-theme` es la misma en el servicio (Task 1 step 3), en el script del `<head>` (Task 1 step 5) y en las pruebas. El atributo `data-theme` coincide entre servicio, script y los selectores CSS de Task 2. `.on-dark` se define en Task 2 y se aplica en Task 3. `.theme-btn` y `.theme-row` coinciden entre la prueba (Task 5 step 1), el HTML (step 4) y el CSS (step 5). Los tokens `--badge-teal/-amber/-rust` se declaran en Task 2 y se consumen en Task 6.

**Riesgos con salida prevista en el plan:**
- Un host de sección con `display: contents` rompería el fondo de `.on-dark` → Task 3 step 1 lo comprueba antes de aplicar las clases y da la alternativa.
- `gridToRuns` podría escribir el color como atributo SVG, donde `var()` no resuelve → Task 6 step 3 lo advierte y da `currentColor` como salida.
