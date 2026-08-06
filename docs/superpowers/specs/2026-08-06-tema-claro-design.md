# Tema claro con anclas oscuras — diseño

Fecha: **2026-08-06** · Proyecto: Kallix Studio landing

## Problema

La landing es dark-first. Falta un tema claro y un control para cambiarlo, sin
perder la identidad retro-futurista que depende de un lienzo oscuro (pixel art,
scanlines, sol de bandas, glows).

## Decisión de alcance

**Claro con anclas oscuras.** El cuerpo de la página vira a claro; el hero, la
franja de clientes, el CTA de media página y el footer quedan permanentemente
oscuros.

Razones:

- El pixel art y los glows están construidos para lienzo oscuro. Invertirlos
  exige re-tonalizar 7 sprites, el sol de bandas, la viñeta y la marca de agua.
- El patrón "hero oscuro, cuerpo claro" es el estándar de los estudios de
  producto y da una cadencia editorial: oscuro → claro → oscuro → claro → oscuro.
- Reduce a la mitad la superficie de riesgo.

Descartadas: el flip total (el doble de trabajo, el hero pierde carácter) y el
flip de tokens sin retoque (scrims y viñetas quedan visiblemente rotos).

---

## 1. Mecanismo: zonas, no un flip global

Los roles semánticos no se atan solo a `:root`. Una clase `.on-dark` declara
cualquier subárbol como permanentemente oscuro:

```css
/* Roles oscuros: por defecto, y dentro de cualquier .on-dark en tema claro */
:root,
[data-theme='light'] .on-dark { --bg: …; --text: …; --veil: 207, 240, 234; … }

/* Roles claros */
[data-theme='light']          { --bg: …; --text: …; --veil: 4, 22, 28; … }
```

La especificidad resuelve sola: `[data-theme='light'] .on-dark` (0,2,0) gana
sobre `[data-theme='light']` (0,1,0), y la herencia de custom properties propaga
los tokens oscuros a todo el subárbol. Sin JS, anidable a cualquier profundidad.

La paleta cruda (`--ink-*`, `--teal-*`, `--amber-*`, `--rust-500`, `--sand-200`,
`--cream`) **no cambia**: sigue en `:root` y es la misma en ambos temas. Lo que
cambia son los roles semánticos que apuntan a ella.

### Regla: los colores de componente van por token, nunca por `:host-context`

Tentador pero incorrecto: resolver un color de componente con
`:host-context([data-theme='light'])`. Ese selector solo ve el atributo del
`<html>`, **no ve la frontera `.on-dark`** — un badge dentro del hero se pondría
en modo claro cuando el tema de la página es claro, que es justo lo contrario de
lo que corresponde.

Todo color que deba variar por tema se declara como token en los dos bloques de
roles. La herencia de custom properties respeta las zonas sola.

## 2. Zonas oscuras

`.on-dark` se aplica en `app.html` sobre tres bloques:

| Elemento | Motivo |
| --- | --- |
| `kx-hero` + `kx-clients` | Sol de bandas, scanlines, sprites, viñetas. El marquee se lee como parte del bloque del hero |
| `kx-cta` | Tiene sprites pixel; corta el cuerpo claro y refuerza el punto de conversión |
| `kx-site-footer` | Marca de agua pixel |

Claras: nosotros, servicios, tecnologías, productos, precios, portafolio,
proceso, estadísticas, equipo, testimonios, FAQ, contacto.

El header queda fuera de `main` y flota sobre ambas zonas: sigue el tema de la
página, no el de la zona (ver §5).

## 3. Tokens

### Nuevos, en ambos temas

| Token | Qué es | Oscuro | Claro |
| --- | --- | --- | --- |
| `--veil` | Triplete RGB del tinte de superficies y bordes. Se usa como `rgba(var(--veil), α)` | `207, 240, 234` | `4, 22, 28` |
| `--substrate` | Triplete RGB del fondo de scrims, desvanecidos y cristal | `4, 22, 28` | `244, 241, 236` |
| `--grid-line` | Línea de la rejilla de `.grid-bg`, que aparece en hero (oscuro) y en estadísticas (claro) | `rgba(136, 201, 196, 0.06)` | `rgba(var(--veil), 0.07)` |
| `--badge-teal`<br>`--badge-amber`<br>`--badge-rust` | Texto de los tres tonos de `badge.ts`. Hoy son tintes claros pensados para fondo oscuro y no pasan contraste sobre crema | `#a8ddd7`<br>`#f0c075`<br>`#eda274` | Versiones oscurecidas, a fijar con medición de contraste |

`--veil` y `--substrate` resuelven de una sola vez las dos familias de literales
que obligatoriamente invierten: la luz-sobre-oscuro y el sustrato oscuro.
`--grid-line` y los `--badge-*` existen porque esos colores viven en zonas de
ambos tipos y no pueden resolverse con `:host-context` (ver §1).

### Roles en tema claro

```css
[data-theme='light'] {
  --bg: var(--cream);              /* #f4f1ec, ya existía sin usarse */
  --bg-raised: #fbfaf8;
  --veil: 4, 22, 28;
  --substrate: 244, 241, 236;

  --surface: rgba(var(--veil), 0.035);
  --surface-2: rgba(var(--veil), 0.06);
  --surface-3: rgba(var(--veil), 0.09);
  --stroke: rgba(var(--veil), 0.12);
  --stroke-strong: rgba(var(--veil), 0.22);

  --text: #06202a;
  --text-muted: #3d5f63;
  --text-dim: #64807f;

  --accent: #a96c16;               /* ámbar oscurecido: el #e7a84e no pasa contraste sobre crema */
  --accent-soft: rgba(169, 108, 22, 0.12);
  --accent-ink: #fffdf7;           /* invierte: tinta clara sobre el acento oscurecido */
  --focus: #2b7d77;                /* el teal-300 es invisible sobre crema */

  --shadow-sm: 0 1px 2px rgba(var(--veil), 0.08);
  --shadow-md: 0 12px 32px -18px rgba(var(--veil), 0.35);
  --shadow-lg: 0 30px 70px -40px rgba(var(--veil), 0.45);
  --glow-accent: 0 14px 40px -18px rgba(169, 108, 22, 0.4);
  --glow-teal: 0 14px 40px -18px rgba(43, 125, 119, 0.32);
}
```

El bloque oscuro se refactoriza para expresar `--surface*` y `--stroke*` en
términos de `--veil`, produciendo exactamente los mismos valores de hoy.

**Contraste a verificar en implementación** (objetivo AA):

| Par | Aproximado | Uso permitido |
| --- | --- | --- |
| `--text` sobre `--bg` | ~15:1 | Cualquiera |
| `--text-muted` sobre `--bg` | ~6.5:1 | Cualquiera |
| `--text-dim` sobre `--bg` | ~4.0:1 | Solo texto grande y metadatos decorativos |
| `--accent` sobre `--bg` | ~4.4:1 | Texto grande y elementos de UI |
| `--accent-ink` sobre `--accent` | ~4.6:1 | Texto de botón primario |

Si alguno queda por debajo, se oscurece el rol hasta cumplir; los valores de
arriba son punto de partida, no dogma.

## 4. Migración de literales

Inventario real: ~60 colores literales fuera de `:root`. Se dividen en tres
grupos con tratamiento distinto.

### 4.1 Obligatorios — invierten sí o sí

Están en zona clara (o en el header) y hoy asumen fondo oscuro:

| Archivo:línea | Valor actual | Pasa a |
| --- | --- | --- |
| `pricing.css:26` | `rgba(207,240,234,0.03)` | `rgba(var(--veil), 0.03)` |
| `services.css:93` | `rgba(207,240,234,0.03)` | `rgba(var(--veil), 0.03)` |
| `contact.css:130` | `rgba(4,22,28,0.55)` | `rgba(var(--substrate), 0.55)` |
| `contact.css:146` | `rgba(120,151,151,0.7)` | `var(--text-dim)` |
| `process.css:32` | `rgba(4,22,28,0.6)` | `rgba(var(--substrate), 0.6)` |
| `team.css:47` | `rgba(4,22,28,0.7)`, `rgba(12,59,69,0.5)` | `rgba(var(--substrate), α)` |
| `site-header.css:19` | `rgba(4,22,28,0.72)` | `rgba(var(--substrate), 0.72)` |
| `site-header.css:157` | `rgba(6,31,38,0.92)` | `rgba(var(--substrate), 0.92)` |
| `styles.css:483,484` | `rgba(136,201,196,0.06)` en `.grid-bg` | `var(--grid-line)` |
| `logo.ts:96` | `#fff` (relleno del pixel "K") | `var(--text)`, que ya usa el propio componente en la línea 45 |
| `badge.ts:39,45,51` | `#a8ddd7`, `#f0c075`, `#eda274` | `var(--badge-teal / -amber / -rust)` |

### 4.2 Sin cambio — ya están en zona oscura

`hero.css` (12), `site-footer.css` (3), `marquee.ts` (4), `pixel-sprite.ts` (12).

Dos que parecen candidatos pero no lo son:

- **`site-header.css:132`** — el scrim del menú móvil, `rgba(4,12,16,0.6)`. Un
  scrim oscuro es correcto en ambos temas.
- **`products.css:66`** — `background: #06212a` en `.preview`. Es el lienzo
  detrás de `kx-project-preview`, y **se mantiene oscuro a propósito**: las
  maquetas se leen como pantallas sobre tarjeta clara (§4.4). Solo hay que
  comprobar que su borde `var(--stroke)` siga separándolo bien de la tarjeta.
- **`.aurora`** — solo aparece en el hero, y no tiene color propio: lo recibe de
  quien la usa. Sin cambios.

### 4.3 Ajuste visual — tintes de acento

~40 literales del tipo `rgba(231,168,78,α)` (ámbar), `rgba(62,155,148,α)` (teal)
y `rgba(217,108,44,α)` (rust) a alfa baja. Sobreviven al cambio de tema, pero
**un tinte que brilla sobre oscuro casi desaparece sobre crema**.

Tratamiento: no se convierten mecánicamente. Se revisan en el navegador en tema
claro y se añade un override `[data-theme='light']` puntual solo donde el tinte
se pierde o se ensucia. Candidatos a revisar, en zona clara:

`about.css:116` · `contact.css:153,157,162,167,169` · `portfolio.css:43,104` ·
`pricing.css:25,27,124` · `process.css:48,58` · `products.css:14,48,53,58` ·
`services.css:31,44,86,87,93` · `team.css:32,46,101` · `testimonials.css:51`

Expectativa: entre 6 y 12 overrides reales. También hay que comprobar sobre
crema los tres hex sólidos de chips en `products.css:49,54,59` y el
`#eda274` de `contact.css:162`.

### 4.4 SVG en TypeScript — auditado, sin trabajo

| Componente | Hallazgo |
| --- | --- |
| `project-preview.ts` | Un solo color de sustrato (`#06212a`, el lienzo de la maqueta). Se **mantiene oscuro** a propósito: las 8 previews se leen como pantallas sobre tarjeta clara, que es el look correcto. El resto son acentos que funcionan sobre oscuro. Sin cambios |
| `pixel-avatar.ts` | Sin colores propios; salen de las paletas de `kallix.data.ts`. Sin cambios |
| `pixel-sprite.ts` | Solo aparece en hero y CTA, ambas oscuras. Sin cambios |
| `logo.ts` | Ya usa `var(--text)`, `var(--stroke-strong)`, `var(--text-dim)`. Los 3 hex son colores de marca del pixel "K" y se quedan. El `#fff` de la línea 96 sí cambia (§4.1) |
| `badge.ts` | Sus 3 colores de tono pasan a tokens `--badge-*` (§3, §4.1) |

## 5. Estado y persistencia

`src/app/core/theme.service.ts`, siguiendo el patrón de `reveal.service.ts`:

```ts
export type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>(/* leído de localStorage, 'dark' si no hay */);
  toggle(): void;
  set(theme: Theme): void;
}
```

**Los efectos secundarios se aplican de forma síncrona**, no vía `effect`. Esto
importa: `document.startViewTransition` toma la instantánea del DOM en cuanto su
callback retorna, y un `effect` de Angular corre en el planificador de forma
asíncrona — la instantánea saldría con el tema viejo. El método privado `apply()`
escribe directo:

```ts
private apply(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('kx-theme', theme);          // guardado con guarda de disponibilidad
  metaThemeColor.content = theme === 'dark' ? '#04161C' : '#F4F1EC';
}
```

El `signal` existe para los consumidores (icono, `aria-pressed`), no para
producir el efecto.

Acceso a `localStorage` con guarda `typeof`, igual que el `typeof
IntersectionObserver` que ya usa `site-header.ts`.

### Parpadeo inicial

Como el default es oscuro y oscuro **es** `:root`, el visitante nuevo no
parpadea. Solo lo haría quien ya eligió claro, así que va un script inline en el
`<head>` de `index.html`, antes del primer pintado:

```html
<script>
  try {
    var t = localStorage.getItem('kx-theme');
    if (t) document.documentElement.dataset.theme = t;
  } catch (e) {}
</script>
```

`<meta name="color-scheme">` pasa de `dark` a `dark light`.

## 6. Motion del cambio

Animar `background-color` en toda la página es exactamente lo que prohíbe la
regla 1 del HANDOFF. Se usa la **View Transitions API**: toma una instantánea y
hace un crossfade en el compositor, sin tocar layout ni animar color.

```ts
toggle(): void {
  const next = this.theme() === 'dark' ? 'light' : 'dark';
  const commit = () => { this.apply(next); this.theme.set(next); };

  if (!prefersReducedMotion() && document.startViewTransition) {
    document.startViewTransition(commit);
  } else {
    commit();
  }
}
```

Donde la API no existe, el cambio es instantáneo — que también es una respuesta
honesta. `prefersReducedMotion()` ya existe en `core/motion.ts`; se reutiliza.

Duración del crossfade: **320ms** con `--ease-out`, vía
`::view-transition-old(root)` / `::view-transition-new(root)`. Supera los 300ms
de la regla 3 del HANDOFF de forma deliberada: un cambio de tema es explicativo,
no una respuesta de UI.

Refuerzo en CSS por si el JS no alcanza:

```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) { animation: none !important; }
}
```

## 7. El control

Botón circular de 36px en `.actions` del header, **antes** del CTA para no
competir con él.

- Iconos: hay que **añadir `sun` y `moon` a `icon.ts`** (hoy no existen), con el
  trazo 1.6 y los remates cuadrados del resto del set de 28.
- Transición: el icono saliente rota 90° y se desvanece mientras el entrante
  hace lo inverso, en `--d-fast` (180ms) con `--ease-out`. Solo `transform` y
  `opacity`.
- Móvil: por debajo del breakpoint del header baja al pie del drawer como una
  fila "Tema", para no saturar la barra.

### Accesibilidad

- `<button type="button">` real, con `aria-pressed` reflejando si el tema claro
  está activo y `aria-label` dinámico: "Cambiar a tema claro" / "Cambiar a tema
  oscuro".
- Foco visible con el `--focus` de cada tema.
- El hover con movimiento va dentro de `@media (hover: hover) and (pointer: fine)`,
  como el resto del proyecto.

## 8. Archivos

| Archivo | Cambio |
| --- | --- |
| `src/styles.css` | Refactor del bloque de roles a `--veil`/`--substrate`; bloque `[data-theme='light']`; reglas de view-transition; `.grid-bg` pasa a `var(--grid-line)` |
| `src/app/core/theme.service.ts` | **Nuevo** |
| `src/app/ui/icon.ts` | +2 iconos (`sun`, `moon`) |
| `src/app/ui/badge.ts`, `src/app/ui/logo.ts` | Colores literales a tokens |
| `src/app/sections/site-header.{ts,html,css}` | Botón en la barra, fila en el drawer, `--substrate` en cristal y drawer |
| `src/app/app.html` | 3 clases `.on-dark` |
| `src/index.html` | Script anti-parpadeo, `color-scheme: dark light` |
| 8 CSS de sección | Literales de §4.1 a tokens; overrides puntuales de §4.3 |

## 9. Pruebas

Unitarias nuevas sobre `ThemeService` (vitest + jsdom, donde
`startViewTransition` no existe y por tanto se ejerce la rama de fallback):

1. Sin nada guardado, el tema por defecto es `dark`.
2. `toggle()` alterna y deja `data-theme` en `<html>`.
3. El tema elegido se persiste en `localStorage`.
4. Un valor guardado previamente se lee en la construcción.
5. Un `localStorage` que lanza excepción no rompe la construcción.

## 10. Verificación

- `npx ng build --configuration production` sin warnings.
- `npx ng test --watch=false` en verde (las 3 existentes + las nuevas).
- **Revisión en navegador real, en ambos temas** — el HANDOFF §8 registra que la
  página nunca se abrió en un navegador; esta vez sí. Puntos a mirar:
  - Las cuatro fronteras oscuro↔claro (hero→clientes→nosotros, portafolio→CTA→proceso, contacto→footer).
  - El cristal del header cruzando de zona oscura a clara al hacer scroll.
  - El drawer móvil en tema claro.
  - Los tintes de acento del §4.3 sobre crema.
  - Las 8 maquetas SVG y los avatares del equipo sobre tarjeta clara.

## Fuera de alcance

- Re-tonalizar el hero, los sprites o el sol de bandas para claro.
- Un tercer modo "auto/sistema" en el control. El default es oscuro fijo; el
  toggle es binario y su elección se recuerda.
- Los pendientes que ya registra el HANDOFF §7 (endpoint del formulario,
  teléfonos reales, dominio real).
