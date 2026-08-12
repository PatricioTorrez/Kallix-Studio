# KALLIX — Landing Page

Documento de continuidad. Todo lo necesario para retomar el proyecto sin volver a
deducir decisiones. Última actualización: **2026-08-11**.

> **La marca pasó de «Kallix Studio» a «KALLIX»** el 2026-08-11, en versalitas en
> todas partes. El logotipo ya no es pixel art: `logo.ts` lleva el isotipo oficial
> calcado de `public/imagenes/logo_solo.svg`. El dominio `kallix.studio` y el correo
> `hola@kallix.studio` **no** cambiaron: siguen siendo los placeholders de §7.

---

## 1. Estado actual

Landing page completa y funcional. Build de producción sin warnings, pruebas en verde.

**La página ofrece tres cosas y solo tres:** sistemas SaaS, apps móviles Android y
chatbots para negocios. Todo el contenido inventado (portafolio, testimonios,
clientes, productos propios, estadísticas) se eliminó el 2026-08-07; ver §7.

| Métrica               | Valor                                                                           |
| --------------------- | ------------------------------------------------------------------------------- |
| Bundle inicial        | 401 kB crudos · **100 kB transferidos** (JS 97.3 + CSS 2.9)                     |
| Dependencias añadidas | **ninguna**                                                                     |
| Imágenes externas     | **ninguna** (todo SVG inline)                                                   |
| Secciones             | 11                                                                              |
| Temas                 | oscuro (default) y claro, con hero/CTA/footer siempre oscuros                   |
| Pruebas               | 19/19 pasando                                                                   |
| Contraste             | 0 fallos WCAG AA en ambos temas, auditado sobre el DOM real (antes del recorte) |

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

| Decisión        | Elección                                                     | Razón                                                                                                                                                           |
| --------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tema            | Dark-first retro-futurista, con tema claro de anclas oscuras | El pixel art y el glassmorphism se leen premium sobre base oscura. El claro se añadió después sin tocar el hero: ver §4                                         |
| Paleta          | Turquesa profunda + ámbar                                    | Combinación de las paletas turquesa y cálida del brief, la de mejor contraste y armonía                                                                         |
| Stack de motion | CSS + `IntersectionObserver` propio                          | Máximo Lighthouse, bundle mínimo, control total del easing. No hay springs ni gestos que CSS no cubra                                                           |
| Librerías UI    | Ninguna                                                      | `pick-ui-library` recomienda `motion`, Sonner y base-ui, pero esa lista es **React-first**. El único viable en Angular (`motion` vanilla) no aportaba nada aquí |
| Contenido       | Solo lo verificable, en un archivo único                     | Nada de clientes, casos ni cifras que no podamos sostener. Cambiar el discurso es editar un archivo                                                             |
| Oferta          | Tres servicios, no seis                                      | SaaS, Android y chatbots. Decir menos y decirlo completo vende mejor que un catálogo                                                                            |
| Precios         | Fuera de la página                                           | Se definen en la propuesta, después de entender el alcance. Los modelos de trabajo se quedan, sin cifras                                                        |
| Formulario      | Endpoint configurable, simula por defecto                    | Sin backend todavía; conectar es una línea                                                                                                                      |
| Tailwind        | Descartado                                                   | Con un design system propio de tokens aportaba poco y sumaba configuración                                                                                      |

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
    ├── app.ts / app.html       Shell: compone las 11 secciones en orden
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
    │   ├── project-preview.ts  8 maquetas SVG de producto. Tipo PreviewName.
    │   │                       Hoy solo se usan 3 (dashboard/mobile/chat), una por servicio
    │   ├── logo.ts             isotipo oficial inline · variant navbar|wordmark|mark
    │   ├── badge.ts            4 tonos, con o sin punto
    │   ├── section-header.ts   antetítulo + título proyectado + entradilla
    │   ├── tabs.ts             indicador por clip-path (técnica de la lista duplicada)
    │   ├── accordion.ts        grid-template-rows 0fr→1fr, sin medir alturas en JS
    │   ├── carousel.ts         scroll nativo con snap + controles ⚠️ sin uso
    │   └── marquee.ts          cinta continua, pausa al hover ⚠️ sin uso
    └── sections/               11 secciones (ts + html + css cuando crecen)
        site-header, hero, about, services, tech, pricing, cta, process,
        team, faq, contact, site-footer
```

**Orden en `app.html`:** hero → nosotros → servicios → tecnologías → modelos →
**CTA** → proceso → equipo → FAQ → contacto → footer.

El CTA va a media página (punto natural de conversión), no pegado al formulario.

`carousel.ts`, `marquee.ts` y `count-up.directive.ts` quedaron sin consumidor al
retirar testimonios, clientes y estadísticas. Se conservan a propósito: son
primitivas genéricas, no están importadas en ningún sitio y por tanto no pesan
en el bundle. Si vuelve la prueba social, están listas.

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
[data-theme='light'] .on-dark {
  /* roles oscuros */
}

[data-theme='light'] {
  /* roles claros  */
}
```

`[data-theme='light'] .on-dark` (0,2,0) gana a `[data-theme='light']` (0,1,0), y
las custom properties se heredan: por eso **cualquier subárbol con `.on-dark`
conserva el lienzo oscuro** aunque la página esté en claro. En `app.html` la
llevan `kx-hero`, `kx-cta` y `kx-site-footer` (`kx-clients` desapareció en el
recorte del 2026-08-07).

`.on-dark` además **pinta** `background` y `color`: redefinir tokens no basta si
la sección era transparente y heredaba el fondo del body. Ojo: los estilos de
componente llegan después que los globales, así que un `:host { background }`
propio le gana — tiene que componer sobre `var(--bg)`, como hace `clients.ts`.

Tokens añadidos: `--veil` y `--substrate` (tripletes RGB para tintes y sustratos),
`--accent-cool` (contraparte fría de `--accent`), `--figure` (cifras grandes),
`--grid-line`, `--badge-teal/-amber/-rust`, `--scrollbar-thumb`,
`--logo-teal/-amber`.

### El logotipo y el tema claro

Los colores de marca son `#3c918a` y `#e79e38`, y resultan ser los mismos tokens
turquesa/ámbar que ya usaba la página. Pero **el ámbar de marca no aguanta el tema
claro**: 1.83:1 contra el mínimo de 3.0, y la mitad derecha de la «K» se
desvanecía. En claro se sirve oscurecido (`--logo-amber: #ad762a`, 3.17:1)
conservando el tono; dentro de `.on-dark` vuelve el ámbar exacto de marca.
Borrar esa línea de `styles.css` restaura el color original en todas partes.

Los dos lockups con la palabra (`logo_completo.svg` vertical y `logo_navbar.svg`
horizontal) **traen la palabra en crema `#eee7dd`**, que sobre el tema claro da
1.09:1. Como `<img>` solo servirían en zonas `.on-dark`; por eso el header lleva
`logo_navbar.svg` calcado inline en `logo.ts` (`variant="navbar"`), con la palabra
en `var(--text)` y la barra en `var(--text-dim)`. Ver `public/imagenes/README.md`.

El 2026-08-11 se borraron los PNG del logotipo: `public/imagenes/` es solo SVG
(`logo_solo`, `logo_completo`, `logo_navbar`).

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

| Hallazgo                                                | Corrección                                       |
| ------------------------------------------------------- | ------------------------------------------------ |
| `will-change` en decenas de elementos con reveal        | Eliminado: promovía capas de composición de más  |
| `backdrop-filter` en la transición del header           | Quitado: parte de `none`, no interpola           |
| Titular del hero (elemento LCP) oculto tras el observer | Pasó a animación de carga escalonada             |
| Capa activa de tabs desalineada al desbordar en móvil   | Contenedor `.stack` con ancho del contenido real |
| Menú móvil sin trampa de foco                           | Fondo `inert` + foco al primer enlace            |
| `viewChild` leído en `ngOnInit` (header)                | Movido a `afterNextRender`                       |

---

## 7. Pendientes

### Bloqueantes para publicar

| #   | Qué                                                                                     | Dónde                                                 |
| --- | --------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 1   | **Endpoint del formulario** — hoy simula el envío con 900 ms de latencia                | `src/app/sections/contact.ts:15` → `CONTACT_ENDPOINT` |
| 2   | **Teléfono y WhatsApp reales** — son placeholders                                       | `src/app/data/kallix.data.ts` → `CONTACT`             |
| 3   | **Dominio real** — `https://kallix.studio/` está hardcodeado en canonical, OG y JSON-LD | `src/index.html`                                      |

### Recorte de contenido ficticio (2026-08-07)

Se eliminaron las cinco secciones que sostenían negocios, clientes y cifras
inventadas, junto con sus datos y componentes:

| Fuera          | Qué contenía                                        |
| -------------- | --------------------------------------------------- |
| `portfolio`    | 6 proyectos con cliente, año y resultado inventados |
| `testimonials` | 4 testimonios con autor y empresa inventados        |
| `clients`      | marquesina de logos de clientes inventados          |
| `products`     | 3 SaaS propios inventados (Botaro, Kanttia, Flujo)  |
| `stats`        | 38 proyectos, 99.9% uptime, 4.9/5, 26 reseñas       |

También se quitaron `Plan.price` y `Plan.unit` (los modelos siguen, sin cifras) y
la respuesta del FAQ que prometía «desde 4,900 USD».

**Lo que queda es verificable:** el equipo, los servicios, el proceso, el stack y
los compromisos (plazos por tipo de proyecto, 30 días de garantía, código en tu
repositorio, respuesta en menos de 24 h). Si algún compromiso no se puede
sostener, se edita en `kallix.data.ts` y desaparece de toda la página.

**Consecuencia:** el sitio ya no tiene prueba social. Cuando haya trabajo real
que enseñar, `portfolio` y `testimonials` se pueden recuperar del historial
(`git show a60bfee:src/app/sections/portfolio.ts`) junto con `carousel.ts` y
`marquee.ts`, que se dejaron en su sitio para eso.

### Mejoras opcionales

- **Avatares del equipo**: son rejillas 14×14 de texto en `TEAM[].pixels` con su
  paleta. Editables a mano; cada carácter es un color (`1` pelo, `3` piel, `5` ojos,
  `6` ropa, `8` accesorio, `.` transparente).
- Página de aviso de privacidad y términos — los enlaces del footer apuntan a `#nosotros`.
- Router: `app.routes.ts` está vacío y `provideRouter` sigue configurado, listo para
  añadir rutas sin tocar nada más.

---

## 8. Verificado en navegador (2026-08-06)

> ⚠️ **Esta verificación es anterior al recorte del 2026-08-07** y no cubre lo que
> cambió ese día. Sin comprobar en navegador: la nueva sección de servicios (3
> filas alternadas con maqueta SVG), las etiquetas del hero que sustituyeron a las
> cifras, la maqueta del panel con su contenido nuevo, las tarjetas de modelos sin
> el bloque de precio y **la frontera hero→nosotros**, que ahora es el corte
> oscuro→claro directo (antes mediaba la franja de clientes, también oscura).
> Es lo primero que hay que mirar al retomar; el build y las 19 pruebas sí pasan.

La página **sí** se abrió en un navegador, en ambos temas. Comprobado:

- El sol de bandas, las scanlines y los sprites del hero: intactos en claro,
  porque el hero es zona `.on-dark`.
- Las fronteras oscuro↔claro (hero→clientes→nosotros, portafolio→CTA→proceso,
  contacto→footer): sin bordes sucios ni dobles separadores.
- El cristal del header cruzando de zona oscura a clara al hacer scroll.
- El drawer móvil en claro: cristal crema, texto oscuro, scrim oscuro (correcto
  en ambos temas), y la fila "Tema" con su `aria-pressed`.
- Precios y estadísticas en claro (el token `--figure`). Ambos bloques ya no
  existen; `--figure` sigue vivo dentro de `.gradient-text`.

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
- Los avatares pixel del equipo a tamaño real (96 px) sobre tarjeta clara.
- `prefers-reduced-motion`: la rama existe y está cubierta por código, pero no se
  probó activando la preferencia en el sistema.

---

## 9. Móvil (2026-08-11)

`ng serve` no permitía reducir el viewport en esta máquina (el `resize` de la
ventana no llegaba a la página, el mismo problema de la sesión anterior). Se
rodeó **cargando la página en iframes de 390, 360 y 320 px**: las media queries
se evalúan contra el viewport del iframe, así que a efectos de CSS es un móvil
real y además permite ver los tres anchos a la vez.

**Se encontró y corrigió un desbordamiento horizontal de 81 px** (`scrollWidth`
460 sobre un viewport de 379).

El síntoma no era scroll lateral: `body` tiene `overflow-x: clip`, así que la
página no se movía. Era peor. El pill de categorías se salía de la pantalla y
quedaba **recortado**, y como `.tabs` nunca llegaba a verse constreñido, su
`overflow-x: auto` no tenía nada que desplazar: **las últimas categorías
(«Infraestructura») eran inalcanzables en móvil**, sin ninguna pista visual de
que estuvieran ahí. Es el modo de fallo típico de `overflow-x: clip` en el body:
esconde el scrollbar delator y deja el contenido mudo.

La causa estaba en `tech.css`, y es sutil: `.head` es un flex en columna con
`align-items: flex-start`, lo que dimensiona a los hijos por su contenido. El
envoltorio de las pestañas crecía hasta el `max-content` de la lista (441 px) y
entonces el `max-width: 100%` de `.tabs` se resolvía **contra esos 441 px, no
contra el viewport** — la contención nunca llegaba a aplicarse. La corrección es
`max-width: 100%` en `.tabs-wrap`, que le da al hijo un tope con referencia
definida: el pill se ciñe al contenido cuando cabe y `kx-tabs` recupera su scroll
interno cuando no.

Verificado: 0 px de desbordamiento en 390, 360 y 320. Al medir, ojo con
descartar los falsos positivos — `.spot`, `.aurora` y `.glow` sobresalen de la
pantalla por diseño, pero van recortados por un ancestro y no generan scroll. El
criterio bueno es `documentElement.scrollWidth > clientWidth`, no el rectángulo
de cada elemento.

### Sigue sin comprobarse en móvil

- El menú drawer abierto y su trampa de foco a 320 px.
- Los avatares pixel del equipo (96 px) sobre tarjeta clara.
- `prefers-reduced-motion` activado de verdad en el sistema.

---

## 10. Skills usadas

`prototype` · `apple-design` · `pick-ui-library` · `find-animation-opportunities` ·
`animate` · `improve-animations` · `animation-vocabulary` · `emil-design-eng`
(instaladas en `.claude/skills/`).

`review-animations`, `prototype` y `pick-ui-library` tienen
`disable-model-invocation: true`: solo las puede lanzar el usuario con `/review-animations`.
Las dos últimas se leyeron y aplicaron directamente como documentos.

**Pendiente sugerido:** correr `/review-animations` para una crítica independiente del motion.
