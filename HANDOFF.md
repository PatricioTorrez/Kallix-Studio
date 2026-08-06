# Kallix Studio — Landing Page

Documento de continuidad. Todo lo necesario para retomar el proyecto sin volver a
deducir decisiones. Última actualización: **2026-08-05**.

---

## 1. Estado actual

Landing page completa y funcional. Build de producción sin warnings, 3 pruebas en verde.

| Métrica | Valor |
| --- | --- |
| Bundle inicial | 434 kB crudos · **107 kB transferidos** (JS 103 + CSS 3.2) |
| Dependencias añadidas | **ninguna** |
| Imágenes externas | **ninguna** (todo SVG inline) |
| Secciones | 16 |
| Temas | oscuro (default) y claro, con hero/clientes/CTA/footer siempre oscuros |
| Pruebas | 19/19 pasando |
| Contraste | 0 fallos WCAG AA en ambos temas, auditado sobre el DOM real |

### Comandos

```bash
npm start                        # ng serve en :4200
npx ng serve --port 4321         # el que se usó durante el desarrollo
npx ng build --configuration production
npx ng test --watch=false
```

> `npm serve` no existe: el script del proyecto es `start`.

---

## 2. Decisiones tomadas (y por qué)

| Decisión | Elección | Razón |
| --- | --- | --- |
| Tema | Dark-first retro-futurista, con tema claro de anclas oscuras | El pixel art y el glassmorphism se leen premium sobre base oscura. El claro se añadió después sin tocar el hero: ver §4 |
| Paleta | Turquesa profunda + ámbar | Combinación de las paletas turquesa y cálida del brief, la de mejor contraste y armonía |
| Stack de motion | CSS + `IntersectionObserver` propio | Máximo Lighthouse, bundle mínimo, control total del easing. No hay springs ni gestos que CSS no cubra |
| Librerías UI | Ninguna | `pick-ui-library` recomienda `motion`, Sonner y base-ui, pero esa lista es **React-first**. El único viable en Angular (`motion` vanilla) no aportaba nada aquí |
| Contenido | Datos realistas en un archivo único | La página se puede mostrar hoy; reemplazar es cambiar un archivo |
| Formulario | Endpoint configurable, simula por defecto | Sin backend todavía; conectar es una línea |
| Tailwind | Descartado | Con un design system propio de tokens aportaba poco y sumaba configuración |

### Identidad gráfica

El pixel art es **acento decorativo**, nunca textura general. Aparece solo en:
avatares del equipo, sprites flotantes del hero y del CTA, el logotipo, el sol de
bandas del hero, los números de etapa del proceso y la marca de agua del footer.

### Tipografías (Google Fonts, cargadas en `src/index.html`)

- **Space Grotesk** (500/600/700) — titulares y UI display
- **Inter** (400/500/600) — texto
- **JetBrains Mono** (400/500) — etiquetas técnicas, antetítulos, metadatos
- **Press Start 2P** — solo números de etapa y marca de agua del footer

---

## 3. Mapa de archivos

```
src/
├── index.html                  SEO, OG, JSON-LD Organization, fuentes, theme-color
├── styles.css                  ⭐ Design system global (tokens, reset, botones, reveal, a11y)
└── app/
    ├── app.ts / app.html       Shell: compone las 16 secciones en orden
    ├── data/
    │   └── kallix.data.ts      ⭐ TODO el contenido de la página. Ningún componente tiene texto
    ├── core/                   Primitivas de motion
    │   ├── theme.service.ts    ⭐ Único dueño del tema. Escribe `data-theme` en <html>
    │   │                       de forma SÍNCRONA: `startViewTransition` fotografía el
    │   │                       DOM al retornar el callback, y un `effect` correría después
    │   ├── motion.ts           prefersReducedMotion, hasFinePointer, damp, easeOutExpo
    │   ├── reveal.service.ts   IntersectionObserver único para toda la página
    │   ├── reveal.directive.ts [kxReveal]="up|down|left|right|scale|clip" [kxRevealDelay]
    │   ├── count-up.directive.ts   [kxCountUp] contadores animados al entrar en pantalla
    │   ├── tilt.directive.ts       [kxTilt] inclinación + foco de luz con inercia
    │   ├── parallax.directive.ts   [kxParallax] scroll parallax, un solo rAF compartido
    │   └── mouse-parallax.directive.ts  [kxMouseParallax] capas con data-depth
    ├── ui/                     Componentes reutilizables
    │   ├── icon.ts             28 iconos, trazo 1.6, remates cuadrados. Tipo IconName
    │   ├── pixel-art.ts        gridToRuns(): rejilla de texto → rectángulos SVG fusionados
    │   ├── pixel-avatar.ts     retratos 14×14 del equipo
    │   ├── pixel-sprite.ts     7 sprites 8×8 · 4 tonos (amber/teal/sand/rust)
    │   ├── project-preview.ts  8 maquetas SVG de producto. Tipo PreviewName
    │   ├── logo.ts             marca pixel "K" + wordmark
    │   ├── badge.ts            4 tonos, con o sin punto
    │   ├── section-header.ts   antetítulo + título proyectado + entradilla
    │   ├── tabs.ts             indicador por clip-path (técnica de la lista duplicada)
    │   ├── accordion.ts        grid-template-rows 0fr→1fr, sin medir alturas en JS
    │   ├── carousel.ts         scroll nativo con snap + controles
    │   └── marquee.ts          cinta continua, pausa al hover
    └── sections/               16 secciones (ts + html + css cuando crecen)
        site-header, hero, clients, about, services, tech, products, pricing,
        portfolio, cta, process, stats, team, testimonials, faq, contact, site-footer
```

**Orden en `app.html`:** hero → clientes → nosotros → servicios → tecnologías →
productos → modelos → portafolio → **CTA** → proceso → estadísticas → equipo →
testimonios → FAQ → contacto → footer.

El CTA va a media página (punto natural de conversión), no pegado al formulario.

---

## 4. Design system

Todo vive en `src/styles.css` como custom properties.

```css
/* Color */   --bg --surface --stroke --text --text-muted --accent
              --ink-950…600  --teal-500…100  --amber-500/400  --rust-500  --sand-200
/* Motion */  --ease-out: cubic-bezier(.23,1,.32,1)
              --ease-in-out: cubic-bezier(.77,0,.175,1)
              --ease-drawer: cubic-bezier(.32,.72,0,1)
              --d-press:160ms --d-fast:180ms --d-base:220ms --d-slow:280ms --d-reveal:620ms
/* Forma */   --r-xs…--r-pill   --container --gutter --section-y --header-h
```

Clases globales reutilizables: `.container` `.section` `.card` `.card--glass`
`.card--lit` `.btn` (`--primary/--secondary/--ghost/--sm/--lg/--block`) `.eyebrow`
`.display` `.h2` `.h3` `.h4` `.lede` `.mono` `.gradient-text` `.link` `.grid-bg`
`.aurora` `.pixel-text` `.sr-only` `.skip-link`.

### Temas: zonas, no un interruptor global

Ya **no** basta con editar `:root`. Los roles semánticos viven en dos bloques:

```css
:root,
[data-theme='light'] .on-dark { /* roles oscuros */ }

[data-theme='light']          { /* roles claros  */ }
```

`[data-theme='light'] .on-dark` (0,2,0) gana a `[data-theme='light']` (0,1,0), y
las custom properties se heredan: por eso **cualquier subárbol con `.on-dark`
conserva el lienzo oscuro** aunque la página esté en claro. En `app.html` la
llevan `kx-hero`, `kx-clients`, `kx-cta` y `kx-site-footer`.

`.on-dark` además **pinta** `background` y `color`: redefinir tokens no basta si
la sección era transparente y heredaba el fondo del body. Ojo: los estilos de
componente llegan después que los globales, así que un `:host { background }`
propio le gana — tiene que componer sobre `var(--bg)`, como hace `clients.ts`.

Tokens añadidos: `--veil` y `--substrate` (tripletes RGB para tintes y sustratos),
`--accent-cool` (contraparte fría de `--accent`), `--figure` (cifras grandes),
`--grid-line`, `--badge-teal/-amber/-rust`, `--scrollbar-thumb`.

`scripts/contrast.mjs` mide los roles claros contra **todas** las superficies.
Si retocas un color, vuelve a correrlo: medir solo contra `--bg` dejaba pasar
fallos reales, porque un texto oscuro pierde contraste sobre las superficies
tintadas, no sobre las elevadas.

---

## 5. Reglas de motion (no romper al continuar)

Se siguió la filosofía de Emil Kowalski. Quien continúe debe respetar:

1. Solo se anima `transform` y `opacity` (excepción sancionada: `clip-path` en tabs,
   `grid-template-rows` en el acordeón).
2. Nunca `transition: all`, nunca `ease-in`, nunca `scale(0)` — se entra desde
   `scale(.95….97)` + `opacity: 0`.
3. UI por debajo de 300 ms. Lo explicativo/marketing puede durar más.
4. Todo `:hover` con movimiento va dentro de `@media (hover: hover) and (pointer: fine)`.
5. Todo lo que se mueve tiene su variante en `prefers-reduced-motion: reduce`.
6. Los escalonados van por `[style.animation-delay]`, con `animation-fill-mode: backwards`
   — nunca `both`, que congelaría el estado final y bloquearía el hover.
7. Los transform de los hijos se escriben directamente sobre cada hijo, jamás
   propagados por una variable CSS del padre (recalcularía el estilo de todos).
8. **Ningún color que varíe por tema se resuelve con `:host-context()`.** Ese
   selector solo ve el atributo del `<html>` y **no ve la frontera `.on-dark`**:
   pondría en claro un badge dentro del hero. Va siempre por token global.
9. **Nunca uses la paleta cruda (`--teal-*`, `--amber-*`, `--sand-*`) como color
   de texto.** No cambia con el tema. Usa `--text`, `--text-muted`, `--text-dim`,
   `--accent`, `--accent-cool` o `--figure`. Este fue el error más repetido:
   34 elementos quedaban ilegibles en claro por esto.

---

## 6. Auditoría de motion ya aplicada

Se corrió el playbook de `improve-animations` sobre el código propio. Cero
violaciones duras. Seis hallazgos, todos corregidos:

| Hallazgo | Corrección |
| --- | --- |
| `will-change` en decenas de elementos con reveal | Eliminado: promovía capas de composición de más |
| `backdrop-filter` en la transición del header | Quitado: parte de `none`, no interpola |
| Titular del hero (elemento LCP) oculto tras el observer | Pasó a animación de carga escalonada |
| Capa activa de tabs desalineada al desbordar en móvil | Contenedor `.stack` con ancho del contenido real |
| Menú móvil sin trampa de foco | Fondo `inert` + foco al primer enlace |
| `viewChild` leído en `ngOnInit` (header) | Movido a `afterNextRender` |

---

## 7. Pendientes

### Bloqueantes para publicar

| # | Qué | Dónde |
| --- | --- | --- |
| 1 | **Endpoint del formulario** — hoy simula el envío con 900 ms de latencia | `src/app/sections/contact.ts:15` → `CONTACT_ENDPOINT` |
| 2 | **Teléfono y WhatsApp reales** — son placeholders | `src/app/data/kallix.data.ts` → `CONTACT` |
| 3 | **Dominio real** — `https://kallix.studio/` está hardcodeado en canonical, OG y JSON-LD | `src/index.html` |

### Contenido inventado que hay que reemplazar

Todo está en `src/app/data/kallix.data.ts`, marcado con `⚠️ PLACEHOLDER` en la
cabecera del archivo. **Es real:** el equipo (5 personas, roles, especialidades) y
los servicios. **Es inventado y plausible:**

- `PROJECTS` — 6 proyectos de portafolio con cliente, año, resultado y stack
- `TESTIMONIALS` — 4 testimonios con autor y empresa
- `PRODUCTS` — 3 SaaS propios (Botaro, Kanttia, Flujo)
- `STATS` / `HERO_STATS` — 38 proyectos, 99.9% uptime, 4.9/5, etc.
- `PLANS` — precios de los tres modelos de trabajo
- `CLIENT_LOGOS` — nombres de la marquesina
- `FAQS` — respuestas con cifras concretas (precios, plazos) que hay que confirmar

Cada proyecto y producto referencia una maqueta SVG por nombre (`PreviewName`):
`dashboard · mobile · chat · store · calendar · map · pos · flow`.

### Mejoras opcionales

- **Avatares del equipo**: son rejillas 14×14 de texto en `TEAM[].pixels` con su
  paleta. Editables a mano; cada carácter es un color (`1` pelo, `3` piel, `5` ojos,
  `6` ropa, `8` accesorio, `.` transparente).
- Animación de **salida** al filtrar el portafolio (hoy los elementos que salen
  desaparecen de golpe; la entrada sí está animada).
- Página de aviso de privacidad y términos — los enlaces del footer apuntan a `#nosotros`.
- Router: `app.routes.ts` está vacío y `provideRouter` sigue configurado, listo para
  añadir rutas sin tocar nada más.

---

## 8. Verificado en navegador (2026-08-06)

La página **sí** se abrió en un navegador, en ambos temas. Comprobado:

- El sol de bandas, las scanlines y los sprites del hero: intactos en claro,
  porque el hero es zona `.on-dark`.
- Las fronteras oscuro↔claro (hero→clientes→nosotros, portafolio→CTA→proceso,
  contacto→footer): sin bordes sucios ni dobles separadores.
- El cristal del header cruzando de zona oscura a clara al hacer scroll.
- El drawer móvil en claro: cristal crema, texto oscuro, scrim oscuro (correcto
  en ambos temas), y la fila "Tema" con su `aria-pressed`.
- Precios y estadísticas en claro (el token `--figure`).

### Auditoría de contraste sobre el DOM real

Se recorrió cada elemento con texto calculando el fondo efectivo (componiendo
las capas translúcidas) y su ratio WCAG. **Resultado: 0 fallos en ambos temas**,
partiendo de 162 en claro.

Dos trampas de método que conviene recordar si se repite la auditoría:

1. **El dev server sirve CSS obsoleto tras varios cambios.** Un audit reportó 35
   fallos que eran puro artefacto; recargar con `?cachebust=1` los borró. Verifica
   el artefacto antes de "arreglar" nada.
2. **Medir justo después de cambiar el tema da valores en tránsito.** Los
   elementos con `transition: color` devuelven el valor interpolado. Hay que
   dejar asentar, o medir tras una carga limpia en cada tema.

### Sigue pendiente

- **Lighthouse**: no se llegó a medir. Meta >90; el diseño lo favorece (sin
  imágenes, sin dependencias).
- El recorte del indicador de tabs en móvil real (se corrigió a ciegas y el
  viewport móvil no se pudo reproducir en esta sesión).
- Los avatares pixel del equipo a tamaño real (96 px) sobre tarjeta clara.
- `prefers-reduced-motion`: la rama existe y está cubierta por código, pero no se
  probó activando la preferencia en el sistema.

---

## 9. Skills usadas

`prototype` · `apple-design` · `pick-ui-library` · `find-animation-opportunities` ·
`animate` · `improve-animations` · `animation-vocabulary` · `emil-design-eng`
(instaladas en `.claude/skills/`).

`review-animations`, `prototype` y `pick-ui-library` tienen
`disable-model-invocation: true`: solo las puede lanzar el usuario con `/review-animations`.
Las dos últimas se leyeron y aplicaron directamente como documentos.

**Pendiente sugerido:** correr `/review-animations` para una crítica independiente del motion.
