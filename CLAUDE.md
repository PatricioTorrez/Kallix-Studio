# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es esto

Landing page de **Kallix Studio** (Angular 22, standalone, signals, sin router activo).
El repo se llama `Vista` por el scaffold de Angular CLI; el producto es la landing.

`HANDOFF.md` es el documento de continuidad: estado, decisiones tomadas y pendientes.
**Léelo antes de empezar** y actualízalo cuando cambies algo estructural.

El idioma del proyecto —comentarios, commits, contenido y documentación— es **español**.

## Comandos

```bash
npm start                                  # ng serve en :4200
npx ng build --configuration production    # build; presupuesto: 500 kB warning / 1 MB error
npx ng test --watch=false                  # suite completa (Vitest sobre jsdom)
npx prettier --write .                     # formateo (no hay linter configurado)
node scripts/contrast.mjs                  # auditoría de contraste WCAG del tema claro
```

`npm serve` no existe: el script es `start`.

Un solo archivo o un solo test:

```bash
npx ng test --watch=false --include src/app/core/theme.service.spec.ts
npx ng test --watch=false --filter "^ThemeService"   # regex sobre nombres de suite/test
```

## Arquitectura

### Todo el contenido vive en un archivo

`src/app/data/kallix.data.ts` contiene **todo** el texto de la página. Ningún componente
tiene copy hardcodeado. Cambiar el discurso comercial es editar ese archivo, nunca las
plantillas. Los tipos (`Service`, `Plan`, `NavLink`…) se exportan desde ahí.

### Composición

`src/app/app.html` compone las secciones en orden. Cada sección es un componente
standalone `OnPush` en `src/app/sections/` con su `.html` y `.css` propios; las
primitivas reutilizables están en `src/app/ui/` y las de motion en `src/app/core/`.

### Temas: zonas, no un interruptor global

Esta es la decisión que más fácil se rompe al continuar.

- `ThemeService` (`src/app/core/theme.service.ts`) es el **único** dueño del tema.
  Escribe `data-theme` en `<html>` de forma **síncrona** dentro de `startViewTransition`
  (un `effect` de Angular correría después de la instantánea y saldría con el tema viejo).
  Un script inline en `src/index.html` aplica el tema guardado antes del primer pintado.
- Los roles semánticos viven en dos bloques de `src/styles.css`:

  ```css
  :root,
  [data-theme='light'] .on-dark { /* roles oscuros */ }
  [data-theme='light']          { /* roles claros  */ }
  ```

  `[data-theme='light'] .on-dark` (0,2,0) gana a `[data-theme='light']` (0,1,0) y las
  custom properties se heredan: cualquier subárbol con `.on-dark` conserva el lienzo
  oscuro aunque la página esté en claro. Desde el 2026-11-26 solo la lleva `kx-games`
  (desde su `host`): hero, CTA y footer siguen el tema.
- `.on-dark` además **pinta** `background` y `color`. Un `:host { background }` de
  componente le gana (los estilos de componente llegan después que los globales), así que
  tiene que componer sobre `var(--bg)`.

Reglas duras que se derivan de esto:

1. **Nunca uses `:host-context()` para un color que varíe por tema.** Solo ve el atributo
   de `<html>` y no ve la frontera `.on-dark`: pondría en claro un badge dentro del hero.
2. **Nunca uses la paleta cruda (`--teal-*`, `--amber-*`, `--sand-*`, `--ink-*`) como
   color de texto.** No cambia con el tema. Usa `--text`, `--text-muted`, `--text-dim`,
   `--accent`, `--accent-cool` o `--figure`. Este fue el error más repetido del proyecto.
3. Si retocas un color del tema claro, vuelve a correr `node scripts/contrast.mjs`. Mide
   contra **todas** las superficies, no solo `--bg`: un texto oscuro pierde contraste
   sobre las tintadas, no sobre las elevadas.
4. Si cambias `--bg` de un tema, actualiza `THEME_COLOR` en `theme.service.ts`.

### Motion: CSS propio, cero dependencias

No hay librería de animación. `src/app/core/` tiene las primitivas: un único
`RevealService` (`IntersectionObserver` compartido, dispara una vez por elemento) más las
directivas `[kxReveal]`, `[kxTilt]`, `[kxParallax]`, `[kxMouseParallax]`, `[kxCountUp]`.

Reglas del sistema de motion (filosofía Emil Kowalski, ya auditada — no las rompas):

- Solo se anima `transform` y `opacity`. Excepciones sancionadas: `clip-path` en tabs,
  `grid-template-rows` en el acordeón.
- Nunca `transition: all`, nunca `ease-in`, nunca `scale(0)` — se entra desde
  `scale(.95…​.97)` + `opacity: 0`.
- UI por debajo de 300 ms; lo explicativo puede durar más. Usa los tokens `--d-*`/`--ease-*`.
- Todo `:hover` con movimiento va dentro de `@media (hover: hover) and (pointer: fine)`.
- Todo lo que se mueve tiene variante en `prefers-reduced-motion: reduce`.
- Escalonados por `[style.animation-delay]` con `animation-fill-mode: backwards` — nunca
  `both`, que congela el estado final y bloquea el hover.
- Los `transform` de los hijos se escriben sobre cada hijo, jamás propagados por una
  variable CSS del padre.

### Restricciones asumidas

Sin dependencias de runtime más allá de Angular, sin imágenes externas (todo SVG inline,
incluido el pixel art de `src/app/ui/pixel-*.ts`), sin Tailwind: el design system son
custom properties en `src/styles.css`.

## Al verificar en navegador

Dos trampas de método que ya costaron tiempo:

1. El dev server sirve CSS obsoleto tras varios cambios; recarga con `?cachebust=1` antes
   de "arreglar" un fallo de contraste que puede ser artefacto.
2. Medir justo después de cambiar el tema da valores en tránsito (`transition: color`
   devuelve el interpolado). Deja asentar o mide tras una carga limpia en cada tema.
