# KALLIX — Landing Page

Documento de continuidad. Todo lo necesario para retomar el proyecto sin volver a
deducir decisiones. Última actualización: **2026-11-18**.

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

### Cambios del 2026-11-18

Revisión de diseño con dos skills nuevas, `web-design-guidelines` (Vercel) y
`design-taste-frontend` (tasteskill). Donde chocan con este proyecto manda
`CLAUDE.md`: de tasteskill se tomaron solo criterios (nada se inclina, áreas
táctiles de 44 px, un solo sistema), **no** sus fotografías, efectos ni scripts.

- **Carruseles: asoma la siguiente ficha, hay contador y ya no avanzan solos.**
  Lo pidió Claudio para los dos (`nosotros` y `productos`), y revierte la decisión
  del 2026-09-21 de una sola ficha. `--peek` vive en `about.css` (`.roster`) y
  `products.css` (`.catalog`); la ficha que asoma se ve al 45 % de opacidad para
  leerse como «lo siguiente». Volver a una sola es `[full]="true"`.
  `kx-carousel` perdió `autoplayMs` y todo su código (pausas, temporizador), y
  ganó un contador «01 / 04» con `aria-live="polite"`. El indicador dejó de ser
  `tablist`/`tab` —no había `tabpanel`— y usa `aria-current`. Flechas y puntos
  miden 44 px; las diapositivas son `group` con «2 de 5» y `scroll-snap-stop:
  always` evita saltarse una ficha con dos clics rápidos.
- **Equipo en orden Patricio, Francisco, Claudio, Jesús, Miguel.** Claudio lleva
  playera negra y audífonos grises con almohadillas negras (`7` y `8` de su paleta).
- **Servicios: fuera `[kxTilt]` y su foco de luz.** La directiva sigue en
  `core/` porque la usa `products-motion/`.
- `color-scheme` en `<html>` sigue a `data-theme` (antes solo la meta, que
  obedecía al sistema); `touch-action: manipulation` en `a`, `button` y `label`;
  el error del formulario usa `--badge-rust` (el `#eda274` fijo daba ~2:1 en claro);
  nombres de producto con `translate="no"`.

Segunda pasada, con auditoría automática sobre la página real (1440, 390 y 320):

- **Corregido: «Infraestructura» se cortaba en Tecnologías a partir de 900 px.**
  En fila, el título le quitaba ancho al pill; `.tabs-wrap` lleva `flex: none`
  en ese tramo.
- **Áreas táctiles de 44 px:** pestañas, chips del formulario, botón de menú,
  `.btn--sm`, redes del footer y «Hablemos de tu proyecto» (con margen negativo
  para no mover nada). Los enlaces del footer solo crecen con `pointer: coarse`:
  con ratón la lista sigue compacta. Quedan por debajo el logo del header (39) y
  la píldora de estado del footer (34), los dos sin vecinos cerca.
- Copy: «Más elegido» → «Recomendado» (sin clientes, era una cifra implícita
  inventada); «Disponibles para proyectos · Q4» → «Disponibles para nuevos
  proyectos» (el trimestre caducaba solo); placeholders terminan en «…»; el
  correo lleva `spellcheck="false"`. Ojo: esos textos siguen en las plantillas,
  no en `kallix.data.ts`.

Tercera pasada:

- **Enlaces honestos.** Fuera «Aviso de privacidad» y «Términos de servicio» del
  footer: llevaban a `#nosotros`. Vuelven cuando existan las páginas (el aviso
  de privacidad es obligatorio en México al recoger datos con el formulario).
  «Tecnologías» pasó de la columna Servicios a Estudio.
- **Motion mejorado, sin quitar nada.** Los botones suben 1 px al pasar y se
  hunden al pulsar (`:hover:active` gana al `:hover`); los enlaces del footer
  usan el mismo subrayado que crece desde la izquierda que `.link`; el reveal
  recorre 14 px en 560 ms (antes 20 px en 620 ms): acompaña, no protagoniza.
- Corregido: en Modelos, `padding-right: 6rem` reservaba el hueco del sello en
  las tres tarjetas y partía título y descripción en columnas de 100 px. Ahora
  solo en el título de la destacada.
- Corregido: en móvil la esquina pixelada de Servicios se montaba sobre la
  maqueta; pasó arriba a la derecha, girada para conservar el sentido.
- El subrayado de «Hablemos de tu proyecto» se reubicó bajo el texto al crecer
  la caja a 44 px.
- **Fondo de los retratos más claro en tema oscuro.** Token `--avatar-ground`
  en `styles.css` (oscuro `#355861→#284951`; claro, el crema de antes). Las
  miniaturas del carrusel lo toman por `--thumb-ground`, que `kx-carousel` acepta
  con `--bg-raised` como respaldo.
- **Animación al pasar de ficha en los carruseles.** Dos capas, solo
  `transform`/`opacity`: la ficha que no está activa queda un plano por detrás
  (`scale(0.96)` anclada a la izquierda, 45 % de opacidad) y avanza al activarse
  en 420 ms; y el contenido de la ficha nueva entra escalonado. Esto último vive
  en `styles.css` (sección «Carrusel»), no en `carousel.ts`, porque el contenido
  lo pinta quien usa el carrusel y el encapsulado no lo alcanza. Es opt-in:
  `data-slide-stagger` escalona a sus hijos directos (0/60/120/180 ms, sube 10
  px) y `data-slide-pop` hace aparecer un elemento desde `scale(0.94)`. Hoy lo
  llevan retrato, ficha y cita del equipo, e icono y texto de productos.
  ⚠️ Al verificar: esta máquina tiene los efectos de animación de Windows
  apagados, así que Chrome informa `prefers-reduced-motion: reduce` y el sitio
  las desactiva a propósito. Para verlas hay que encenderlos o emular
  `no-preference` (CDP `Emulation.setEmulatedMedia`).
- **Corregido: el carrusel saltaba sin transición.** Dos causas. Una, la escala
  y la opacidad cambiaban de golpe al pasar `.is-active` a mitad del recorrido;
  ahora `update()` las escribe en línea en cada fotograma según la distancia
  real de cada ficha a su punto de ajuste, también al arrastrar. Dos, y la que
  se veía: **`scrollTo({ behavior: 'smooth' })` es un salto seco en Chrome
  para Windows con los efectos de animación apagados**, aunque la página no
  pida movimiento reducido. `glide()` anima `scrollLeft` por su cuenta (520 ms,
  ease-out quart) con el snap suspendido mientras dura, y cede al instante si
  alguien toca o usa la rueda. Con movimiento reducido no hay desplazamiento:
  fundido cruzado con la Web Animations API (la regla global acorta las CSS).
  Medido fotograma a fotograma por CDP en los dos modos.

Verificado por CDP en Chrome headless a 1280 y 390, en ambos temas: 0 px de
desborde, 10 s sin avance, el contador sigue a las flechas hasta el final, la
última ficha alineada con desfase 0 y la flecha deshabilitada.

### Cambios del 2026-09-21

- **`productos`: las firmas de los logos quedan desactivadas y el carrusel deja
  asomar la siguiente ficha.** Dos comentarios del equipo: «yo digo que sea un
  carrusel donde se vea como un avance de la siguiente card» y «que se vea más
  profesional». Patricio pidió **no borrar** las animaciones: moverlas y
  reactivarlas si algún día se quieren de vuelta.

  Todo lo de las firmas vive ahora en **`src/app/sections/products-motion/`**,
  fuera de la compilación: las cinco hojas CSS, el recorte de plantilla
  (`products.motion.html`), las capas del escenario que animaban
  (`products.stage.css`) y un `README.md` con los cuatro pasos para reponerlas.
  `products.ts` se quedó sin estado —fuera `PLAY_MS`, la señal `playing`, el
  `IntersectionObserver` y `[kxTilt]`— y la ficha es estática.

  **Escenario sobrio.** Con las firmas se fueron el halo de marca que respiraba,
  los anillos concéntricos, el brillo de vidrio, el reflejo bajo el puntero y la
  sombra de contacto. Queda el icono como placa limpia sobre el degradado neutro
  del sustrato, con una sombra **neutra** que solo lo asienta: el resplandor de
  color que llevaba debajo también se fue, lo pidió Patricio al verlo. En el
  escenario ya no queda nada teñido de `--brand`; el color de cada producto solo
  vive en su título. `.stage` bajó de 2.25 iconos de alto a 1.9: los 2.25 eran
  para que el mazo de Kalen no se cortara.

  ⚠️ **El asomo se probó y se descartó el mismo día.** Se implementó tal como
  lo pidió el equipo —la siguiente ficha asomando por la derecha, con un trozo
  de su icono— y Patricio lo paró al verlo: «que no se vea el inicio de la
  siguiente tarjeta, solo una». `productos` volvió a `[full]="true"`. Si vuelve
  a pedirse, es quitar ese atributo y dar un valor a `--peek` en `products.css`;
  lo que se midió entonces fue `clamp(3.25rem, 12vw, 10.5rem)`, porque el
  escenario ocupa 0.8 de las 2 columnas y el icono va centrado en él, así que el
  icono de la siguiente app empieza a unos 105 px de su borde: con menos asoma
  el canto vacío de la tarjeta y no se lee como un avance.

  **`kx-carousel` se quedó sabiendo hacer el asomo**, y mejor que antes. El modo
  sin `[full]` existía ya y estaba roto: la última ficha no llegaba nunca a su
  posición de ajuste. El hueco que le falta al riel va ahora como **separador
  `::after`** (`--peek` menos el hueco del riel), no como `padding-inline-end`:
  el `flex-basis` de la ficha es un porcentaje y se mide contra el ancho
  **interior** del riel, así que con relleno se restaría dos veces y la ficha
  saldría 70 px corta. Por eso el modificador `is-full` pasó de la diapositiva
  al riel: el separador es suyo.

  Verificado por CDP en Chrome headless (la extensión sigue sin conectar), en
  ambos temas y a 1280 y 390 px: cero piezas de firma en el DOM, cero
  animaciones corriendo en la ficha, ninguna sombra teñida bajo el icono, 0 px
  de desborde horizontal, la ficha del ancho del visor (la siguiente empieza 19
  px por fuera) y la última alineada al borde con desfase 0. El carrusel de
  `nosotros` sigue igual. Build de producción sin warnings, 19 pruebas en verde
  y `scripts/contrast.mjs` en OK.

### Cambios del 2026-09-19

> Las firmas que describe esta entrada y la siguiente están **desactivadas**
> desde el 2026-09-21; el código está completo en `products-motion/`. Lo que
> sigue vale tal cual si se reponen.

- **Las cuatro firmas pasan de 1.8 s a 5 s en tres actos.** Lo pidió Patricio:
  «una de entrada, intermediaria y una final». No es una animación larga, son
  tres cortas encadenadas con un respiro entre ellas; la rejilla de tiempos, la
  misma para los cuatro, está en la cabecera de `products.motion.css`:

  | Acto            | Tramo     | Qué pasa                                 |
  | --------------- | --------- | ---------------------------------------- |
  | I · entrada     | 0–~27 %   | El objeto del oficio llega y se acomoda  |
  | II · intermedio | ~27–70 %  | El verbo del producto: lo que hace       |
  | III · final     | ~70–100 % | El desenlace, y todo se retira al reposo |

  Con `--play: 5000ms`, **1 % = 50 ms**: sirve para comprobar de un vistazo que
  ningún gesto suelto se pasa de rosca (un golpe son 2 %, un movimiento de
  interfaz nunca más de 6 %). `PLAY_MS` en `products.ts` va con ello.

  Reparto por producto: Kalen, el mazo entra y se prepara / dos golpes con su
  onda / el expediente en abanico y la retirada. Kineti, la barra cae sobre los
  hombros / sentadilla, press y bloqueo / la suelta, golpe, temblor y doble
  latido. Kivo, el ticket se imprime / el escaneo y la confirmación / monedas,
  avisos y el ticket se guarda. Kora, caen los audífonos / seis tiempos de baile
  / acento final y se los quita.

  Tercera regla nueva del bloque: **los retrasos se escriben como fracción de
  `--play`** (`calc(var(--play) * 0.62)`), nunca en milisegundos sueltos, para
  que cambiar la duración no descoloque el guion. Las duraciones de los gestos
  sueltos —monedas, avisos, notas, ondas— sí van en ms: son el gesto, no su
  posición en el guion.

- **Los audífonos de Kora ahora rodean el logo**, no se le ponen encima. El
  lienzo pasó a ser un cuadrado de 1.5 iconos centrado sobre el icono (viewBox
  `0 0 300 300`, con el icono en 50…250), la diadema arquea **por fuera** de esa
  caja y las copas se apoyan en los costados a media altura, con la almohadilla
  pisando el borde 4 unidades. Medido con `getPointAtLength`: la holgura mínima
  entre el trazo de la diadema y la esquina redondeada del icono es de 4.9
  unidades, así que no se tocan en ningún punto. Si retocas la curva, vuelve a
  medirlo: es lo único que separa «puestos» de «encima». El brillo de la diadema
  recorre el mismo `d` recortado con `stroke-dasharray`, para que no se despegue.

  Las tres ondas pasaron a cuatro y viven en un contenedor `.waves` propio, para
  indexarlas con `:nth-child` sin contar el resto de la pila (la trampa de Kivo).
  La cuarta es el acento del acto III y se abre más que las otras.

- **Corregido: el mazo de Kalen se salía del escenario.** `.stage` recorta
  (`overflow: clip`) y el mazo levantado sacaba la cabeza fuera de la tarjeta:
  hasta 65 px, medidos barriendo la firma entera. Con 1.8 s pasaba en un
  parpadeo; con 5 s se queda ahí segundos y salta a la vista. También era
  anterior a este cambio. Tres cifras quedaron atadas entre sí y hay que
  moverlas juntas: `.stage` mide ahora **2.25 iconos** de alto (era 2), el mazo
  **0.6 iconos** de largo (era 0.8) y su ángulo de tope son **54°** (era 66).
  `top` y `left` se recalcularon a partir del nuevo largo. Barrido de los 5 s
  con el escenario como referencia: **0 px de desbordamiento en los cuatro
  productos**, a 1280 y a 390 px.

- **Corregido: `svg { max-width: 100% }` recortaba las piezas anchas.** El reset
  global de `styles.css` las medía contra `.icon-stack`, que mide justo un icono,
  y el navegador las encogía sin avisar: **la barra de Kineti salía del ancho del
  icono en vez de 1.75, con los discos por dentro**, y los audífonos salían
  cuadrados. `.gavel`, `.barbell` y `.headphones` llevan ahora `max-width: none`
  en `products.motion.css`. Era un fallo anterior a este cambio: la verificación
  de «0 px de desbordamiento» no lo detecta, porque el recorte es justo lo que
  evita el desbordamiento.

  Verificado por CDP en Chrome headless (la extensión sigue sin conectar): las
  siete animaciones de cada firma duran 5000 ms, el fotograma final coincide con
  el reposo pieza por pieza en los cuatro productos —lo único que difiere es el
  `halo`, que respira en su propio bucle de 7 s—, 0 px de desbordamiento, y
  fotogramas congelados revisados en ambos temas y a 390 px.

### Cambios del 2026-09-18

- **`productos` pasa de Tonalli a cuatro productos propios, en carrusel.** Tonalli
  salió. Entran dos SaaS —**Kalen** (despachos de abogados: casos, contactos,
  agenda, facturas, documentos, equipos y roles con permisos) y **Kineti**
  (membresías de gimnasios)— y dos apps Android —**Kivo** (gastos personales y
  préstamos, lee notificaciones bancarias, escanea tickets) y **Kora**
  (reproductor FLAC de música local)—. Datos en `PRODUCTS` (`kallix.data.ts`),
  ahora con `kind`, `icon`, `color` y `colorOnLight`; `url`, `status` y `preview` se
  fueron porque ninguno tiene enlace público confirmado.

  Usa `kx-carousel` igual que el equipo: una ficha por diapositiva (icono solo, centrado sobre un
  resplandor de su color, a un lado, texto al otro) y **los iconos de las
  apps como miniaturas del indicador**, así los cuatro se ven aunque solo uno esté
  desplegado. Avance automático cada 9 s.

  El escenario del icono son capas centradas en un mismo punto: halo de su color
  que respira (7 s), anillos concéntricos desvanecidos con máscara, y el icono
  como placa de vidrio (brillo en el canto, sombra teñida, `[kxTilt]` con reflejo
  bajo el puntero) sobre una sombra de contacto que se encoge cuando el icono se
  eleva al pasar por la ficha. Se centran con la propiedad `translate`, no con
  `transform`, para que la animación no pise el centrado. Hubo un barrido de
  radar girando dentro de los anillos: **se quitó a petición**, no lo repongas.

  **Cada logo tiene una animación de firma según su producto**, una hoja por
  producto (`products.kalen.css`, `.kineti`, `.kivo`, `.kora`) más las reglas
  comunes en `products.motion.css`. Así ninguna pasa del presupuesto de 12 kB
  por estilo de componente, y cambiar un producto no toca a los demás:

  | Producto | Firma                                                                                                                      |
  | -------- | -------------------------------------------------------------------------------------------------------------------------- |
  | Kalen    | Un mazo de juez golpea el icono dos veces (onda en el primero); el expediente sale en abanico y el mazo se retira          |
  | Kineti   | La barra cae sobre el icono: sentadilla, press sobre la cabeza con la barra flexionándose, golpe, temblor, doble latido    |
  | Kivo     | Un ticket con su $ sale por detrás y se escanea; confirma con un pulso, saltan tres monedas y aparecen avisos «+$» y «−$»  |
  | Kora     | Caen unos audífonos, quedan puestos alrededor del logo y baila al compás; notas, ondas y un ecualizador en lugar de sombra |

  Las piezas que son objetos (mazo, ticket, monedas, audífonos) llevan colores
  fijos de madera, papel, oro o plástico, iguales en ambos temas. Lo que es
  texto o grafía usa roles del tema: los avisos de Kivo `--text` sobre
  `--bg-raised`, y las notas de Kora el mismo `color-mix` que el título.

  **Sin elevación al pasar el puntero.** El icono subía 8 px y se quedaba arriba
  mientras el cursor siguiera encima; se quitó (y el envoltorio `.lift` con
  ella). Pasar el puntero solo dispara la firma, que siempre vuelve sola.

  ⚠️ **Al terminar, cada logo vuelve a su estado natural** (lo pidió Patricio):
  en reposo se ve solo el icono. Hojas, barra, ecualizador y demás piezas entran
  y salen dentro de la animación. Hubo una versión que las dejaba puestas como
  «personalidad en reposo» y se descartó: no la repongas.

  Corren **al mostrarse y al pasar el puntero** (lo eligió Patricio): `products.ts`
  pone `.is-playing` cuando el carrusel entra en pantalla (`IntersectionObserver`
  al 45%), cuando cambia de diapositiva —`kx-carousel` tiene ahora la salida
  `activeChange`— y en `pointerenter` de la ficha; la quita al terminar
  (`PLAY_MS` en TS = `--play` en CSS, cámbialos juntos; hoy 5 s, ver
  2026-09-19). No reinicia una firma a medias ni corre con
  `prefers-reduced-motion`.

  Tres reglas del bloque: el fotograma 100% de cada animación es **idéntico al
  reposo**, y el reposo es el logo tal cual (al quitar la clase nada salta ni
  se queda puesto); la firma anima `.motion`, un nivel
  por fuera de `.icon`, porque `[kxTilt]` escribe `transform` en línea sobre
  `.icon`; y las piezas repetidas van en su propio contenedor para indexar con
  `:nth-child` — sueltas, `:nth-of-type` contaba la sombra del piso y corrió los
  retrasos de Kivo un lugar.

  Verificado en Chrome headless por CDP (la extensión no conecta): cada
  diapositiva dispara solo su firma y la apaga al terminar, icono y halo
  centrados al píxel, 0 px de desbordamiento, fotogramas congelados revisados en
  ambos temas y a 390 px. El script de un solo uso quedó fuera del repo.

  Los PNG originales (`public/imagenes/*.png`, ~800 kB cada uno) no se usan en la
  página: se sirven `public/imagenes/apps/*.png`, cuadrados de 384 px (86–156 kB)
  con el fondo de cada logo horneado. Kora venía transparente y va sobre crema
  `#f5f2ee`, porque su sombra negra desaparece sobre oscuro.

  Cada título lleva el color de su marca (`color`): Kalen `#768de5`, Kineti
  `#fd1923`, Kivo `#0ec9b8`, Kora `#fb9dbd`, que también tiñe el resplandor del
  icono. En tema claro esos tonos bajan hasta 1.6:1 sobre crema, así que el
  título usa `colorOnLight`: el mismo tono con la luminosidad bajada y la
  saturación intacta, hasta 4.5:1 (auditado en `scripts/contrast.mjs`). El cambio
  lo hace el token global `--light-mix` (0% en oscuro, 100% en claro) dentro de
  un `color-mix()`, no `:host-context()`: así respeta la frontera `.on-dark`.

  ⚠️ Lo de Kineti más allá de «membresías» (socios, planes, vencimientos) son deducción, no descripción del equipo. Sin
  comprobar en navegador: la extensión de Chrome no conectó.

### Cambios del 2026-08-12

- **La ventana del hero se fue; ahora hay tres maquetas apiladas.** Anunciaba
  «Respondemos tu mensaje en < 24 h» con los tres servicios repetidos (ya estaban
  en `HERO_TAGS`, dos pulgadas más arriba) y un pie sobre cómo trabajamos. Se probó
  una versión intermedia que enumeraba entregables —demo en la semana 2, código en
  tu repositorio, 30 días de garantía— y **también se descartó**: en el hero el
  cliente no viene a leer promesas, viene a ver qué construimos.

  Lo que hay es una cascada de tres tarjetas con las maquetas SVG que ya existían
  en `project-preview.ts`: panel de operación (`dashboard`), ChatBots en Telegram
  (`chat`) y app Android (`mobile`, recortada en vertical). El contenido está en
  `HERO_MOCKS` (`kallix.data.ts`), con `label`, `depth` de parallax y `alt`.

  Dos detalles que conviene no deshacer: las tarjetas **no van rotadas** —el
  parallax escribe `transform` sobre `.mock` y la entrada anima `.mock-card`, así
  que una inclinación estática se pisaría con una de las dos—, y las etiquetas
  nombran la pieza («Panel de operación»), no el servicio, porque el servicio ya
  lo dicen las píldoras de `HERO_TAGS` justo al lado.

  Con la ventana desaparecieron `HERO_PANEL`, las barras decorativas de `hero.ts` y
  todo el CSS de `.window*`, `.metric*`, `.chart`, `.bar`, `.chips` y `.deploy`.

- **El equipo describe qué hace cada uno, no jerarquías.** Fuera el «CEO ·
  Arquitectura» de Patricio y el «CEO · KALLIX» que firmaba la cita de `about.html`.
  Los cinco perfiles se reescribieron sobre experiencia real (móvil offline y Oracle,
  plataformas web con Laravel, chatbots en producción, Angular y cloud, IA con
  Python) y el orden del array pasó a Patricio, Jesús, Francisco, Claudio, Miguel.
  Los avatares pixel no se tocaron.
- **`equipo` desapareció como sección: ahora vive dentro de `nosotros`.** Eran dos
  bloques contando lo mismo con distinto formato —una rejilla de cinco fichas por
  un lado, una cita suelta de Patricio por otro—. Se fusionaron en un carrusel de
  fichas: por diapositiva, un integrante con su retrato, su rol, su especialidad,
  su frase, su descripción y sus etiquetas.

  `sections/team.{ts,html,css}` se borraron y `<kx-team />` salió de `app.html`.
  **El ancla `#equipo` sigue viva** sobre el bloque nuevo, porque la usan el menú
  (`NAV_LINKS`) y el footer (`FOOTER_COLUMNS`). Las secciones pasan de 11 a 10.

  Las frases están en `TeamMember.quote` (`kallix.data.ts`), junto al avatar y al
  rol, para que no se puedan desincronizar. La de Patricio es la que ya estaba
  firmando la cita de `about`.

  ⚠️ **Las otras cuatro frases están redactadas por mí, no dichas por ellos.**
  Cada quien debería aprobar la suya antes de publicar.

- **`carousel.ts` se estrenó y creció.** Llevaba sin consumidor desde el recorte del
  2026-08-07. Tres capacidades nuevas, todas opcionales y apagadas por defecto, así
  que el uso genérico no cambia:

  | Entrada      | Para qué                                                          |
  | ------------ | ----------------------------------------------------------------- |
  | `full`       | La diapositiva ocupa el 100%: una por movimiento, sin asomo       |
  | `autoplayMs` | Avance automático; 0 lo desactiva                                 |
  | `itemLabels` | Nombres accesibles del indicador, en vez de «Elemento 3»          |
  | `#thumb`     | Plantilla opcional: convierte los puntos en miniaturas (retratos) |

  El avance automático (8 s en `about`) **se detiene** con el puntero encima, con
  el foco dentro y con la pestaña en segundo plano, y no arranca siquiera bajo
  `prefers-reduced-motion`. Mover un texto mientras alguien lo lee es hostil; estas
  tres pausas son lo que lo hace tolerable, no un adorno. El temporizador se
  reinicia cuando alguien pulsa una flecha o un retrato, para no encadenar un salto
  automático justo después del manual.

  Comprobado en iframes de 390 y 320 px: **los controles envuelven**. Cinco
  miniaturas (232 px) más las dos flechas (92 px) no caben en los 256 px útiles de
  un móvil de 320, y sin `flex-wrap` desbordaban la página 45 px. Es el mismo modo
  de fallo del pill de categorías de §9: `overflow-x: clip` en el `body` esconde el
  scrollbar delator y el desbordamiento pasa desapercibido.

- **Volvió `productos`, ahora con producto de verdad.** La sección se había retirado
  el 2026-08-07 porque los tres SaaS que enseñaba (Botaro, Kanttia, Flujo) eran
  inventados; ver §7. Vuelve con **Tonalli** —gestión para hoteles y restaurantes—
  que está en línea y se puede abrir: el botón lleva a `tonalli-stay-flow.base44.app`
  en pestaña nueva.

  Los datos están en `PRODUCTS` (`kallix.data.ts`). Las tres capacidades listadas
  (reservaciones, ocupación, administración) salen literalmente de la descripción
  del producto: **no añadir funciones que no se puedan comprobar abriendo el
  enlace**, que es justo lo que hundió a la versión anterior de la sección.

  La ficha se despliega a lo ancho —maqueta a un lado, texto al otro— porque hay un
  solo producto. Cuando entre el segundo, la clase `is-single` se apaga sola y la
  rejilla los reparte en dos columnas; no hay que tocar CSS. Va entre `servicios` y
  `tecnologias`, con entrada nueva en el menú y en el footer.

- **El resaltado del menú se calcula, ya no se observa.** «Equipo» se quedaba
  encendido para siempre. La causa no era el ancla: el `IntersectionObserver` del
  header **solo asignaba** la sección activa cuando algo entraba en la banda central
  y nunca la quitaba, así que la última sección visitada seguía marcada sobre el
  hero, sobre el CTA y sobre contacto. Al mudarse el equipo dentro de `nosotros`,
  `#equipo` pasó a ser el **primer** objetivo del documento, y bastaba con pasar por
  ahí una vez para que se quedara encendido el resto de la visita.

  Ahora `sectionAtReadingLine()` recorre las secciones en el `requestAnimationFrame`
  que ya llevaba la barra de progreso y devuelve la que cruza la línea de lectura
  (45% de la ventana), o cadena vacía si no hay ninguna. Sin observador, sin estado
  pegado, y los tramos sin entrada en el menú (hero, CTA, contacto) quedan
  correctamente sin resaltar. Poner una señal al mismo valor no notifica, así que no
  dispara detección de cambios por frame.

  Nota de orden: `#equipo` está ahora en la posición 2 del documento pero sexta en
  el menú, así que el resaltado salta al sexto elemento y vuelve al primero. Es
  fiel a la página; si molesta, se mueve la entrada en `NAV_LINKS`.

- **Favicon**: ver §4.

| Métrica               | Valor                                                                           |
| --------------------- | ------------------------------------------------------------------------------- |
| Bundle inicial        | 418 kB crudos · **105 kB transferidos** (JS 101.6 + CSS 2.9)                    |
| Dependencias añadidas | **ninguna**                                                                     |
| Imágenes externas     | **ninguna** (todo SVG inline)                                                   |
| Secciones             | 11 (`equipo` se fusionó con `nosotros`; volvió `productos`)                     |
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
| Formulario      | FormSubmit (JSON por `fetch`), simula si no hay buzón        | Sin backend propio ni cuenta. Web3Forms se descartó: ya exige cuenta para dar la clave                                                                          |
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
    ├── app.ts / app.html       Shell: compone las 10 secciones en orden
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
    │   ├── carousel.ts         snap nativo + miniaturas + contador + activeChange,
    │   │                     sin avance automático. Lo usan equipo y productos,
    │   │                     ambos con asomo (--peek). [full] = una ficha por
    │   │                     pantalla ⚠️ hoy nadie lo usa
    │   └── marquee.ts          cinta continua, pausa al hover ⚠️ sin uso
    └── sections/               11 secciones (ts + html + css cuando crecen)
        site-header, hero, about, services, products, tech, pricing, cta,
        process, faq, contact, site-footer
        └── products-motion/    ⏸️ Firmas de los logos, DESACTIVADAS el 2026-09-21.
                                No se compila: cinco hojas CSS, el recorte de
                                plantilla y README.md con cómo reponerlas
```

**Orden en `app.html`:** hero → nosotros (**incluye el equipo**) → servicios →
**productos** → tecnologías → modelos → **CTA** → proceso → FAQ → contacto → footer.

El CTA va a media página (punto natural de conversión), no pegado al formulario.

`carousel.ts`, `marquee.ts` y `count-up.directive.ts` quedaron sin consumidor al
retirar testimonios, clientes y estadísticas. **`carousel.ts` volvió a entrar el
2026-08-12** con el equipo dentro de `about`. `marquee.ts` y `count-up.directive.ts`
siguen fuera del bundle: son primitivas genéricas y nadie las importa. Si vuelve la
prueba social, están listas.

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

### El favicon (2026-08-12)

El `favicon.ico` que había era **256×222 px, una sola entrada, 234 kB** de BMP sin
comprimir. Decodifica —no estaba corrupto—, pero el navegador dibuja el favicon
dentro de un cuadrado: un icono no cuadrado se deforma o se encaja, y sin entradas
de 16/32 px cada pestaña reescalaba 256 px a 16.

Ahora hay dos, generados del mismo trazado que `imagenes/logo_solo.svg`:

- `public/favicon.svg` — isotipo centrado en un lienzo de 128×128 con un 8% de aire.
  Es el que usan los navegadores modernos y el único que hay que editar a mano.
- `public/favicon.ico` — 16, 32, 48, 64, 128 y 256 px cuadrados, entradas PNG
  (16 kB en total, contra los 234 kB de antes).

Ambos se declaran en `src/index.html`, el SVG primero. Si hay que regenerar el
`.ico`, el arte son cuatro polígonos de segmentos rectos: se rellenan directo con
`System.Drawing` sin rasterizar SVG (el script de un solo uso quedó fuera del repo).

> Al comprobarlo: **el favicon se cachea con saña**. Si no cambia, no es el archivo:
> abre `/favicon.svg` en una pestaña nueva o recarga con el inspector abierto y la
> caché desactivada.

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

| #   | Qué                                                                                                                                                                                  | Dónde                                              |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| 1   | **Formulario activo en FormSubmit** — entrega a `patriciotzdz@gmail.com` vía alias; activado en `kallix-studio.vercel.app`. Un dominio nuevo pide activarlo otra vez desde el correo | `src/app/sections/contact.ts` → `FORMSUBMIT_INBOX` |
| 2   | **Teléfono y WhatsApp reales** — son placeholders                                                                                                                                    | `src/app/data/kallix.data.ts` → `CONTACT`          |
| 3   | **Dominio real** — `https://kallix.studio/` está hardcodeado en canonical, OG y JSON-LD                                                                                              | `src/index.html`                                   |

### Recorte de contenido ficticio (2026-08-07)

Se eliminaron las cinco secciones que sostenían negocios, clientes y cifras
inventadas, junto con sus datos y componentes:

| Fuera          | Qué contenía                                                                                                        |
| -------------- | ------------------------------------------------------------------------------------------------------------------- |
| `portfolio`    | 6 proyectos con cliente, año y resultado inventados                                                                 |
| `testimonials` | 4 testimonios con autor y empresa inventados                                                                        |
| `clients`      | marquesina de logos de clientes inventados                                                                          |
| `products`     | 3 SaaS propios inventados (Botaro, Kanttia, Flujo) — **la sección volvió el 2026-08-12 con Tonalli, que sí existe** |
| `stats`        | 38 proyectos, 99.9% uptime, 4.9/5, 26 reseñas                                                                       |

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
  paleta. Editables a mano; cada carácter es un color (`1` pelo, `2` detalle del
  pelo o la ropa —barba, raya, puño, visera—, `3` piel, `4` sombra de la piel,
  `5` ojos, `6` ropa, `7`/`8` accesorio, `.` transparente). La piel sale de
  `PIEL_MORENA` o `PIEL_CLARA`, no de literales sueltos.
  Para no editarlos a ciegas, `scripts/retratos.html` es un editor visual: se abre
  con doble clic (sin servidor ni dependencias), trae los cinco retratos cargados
  y devuelve el bloque `pixels` + `palette` ya formateado como lo dejaría prettier,
  spread de la piel incluido. Pegar y listo.
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
