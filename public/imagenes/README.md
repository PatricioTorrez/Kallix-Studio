# imagenes/

Logotipo de KALLIX. Todo lo que esté en `public/` se copia tal cual a la raíz del
build, así que un archivo aquí se sirve en `/imagenes/<nombre>`:

```html
<img src="/imagenes/logo_completo.svg" alt="KALLIX" />
```

## Lo que hay

Los tres son SVG. **No queda ningún PNG**: los rasterizados originales se
borraron el 2026-08-11 al pasar todo a vectorial.

| Archivo             | Qué es                                                      | viewBox          |
| ------------------- | ----------------------------------------------------------- | ---------------- |
| `logo_solo.svg`     | Isotipo: la «K» de dos mitades con el rombo ámbar           | `0 0 127 110`    |
| `logo_completo.svg` | Isotipo con la palabra KALLIX debajo (vertical)             | `0 0 323 169`    |
| `logo_navbar.svg`   | Isotipo, barra separadora y la palabra al lado (horizontal) | `0 0 745.07 136` |

Ninguno lleva fondo pintado: son transparentes de verdad, sin `<rect>` de
respaldo.

Estos archivos son la fuente canónica, pero la página **no carga ninguno como
imagen**: `src/app/ui/logo.ts` lleva los `path` de `logo_solo.svg` y de
`logo_navbar.svg` inline, con los rellenos por token en vez de por color fijo. Es
lo que permite que el logotipo cambie con el tema y respete la frontera
`.on-dark`. Si tocas un SVG, toca también el componente.

## Colores medidos

Muestreados sobre el archivo, no estimados a ojo:

| Rol                     | En el logo | Token del proyecto     | ¿Coinciden?                              |
| ----------------------- | ---------- | ---------------------- | ---------------------------------------- |
| Turquesa                | `#3c918a`  | `--teal-500: #3e9b94`  | Sí, a simple vista son el mismo          |
| Ámbar                   | `#e79e38`  | `--amber-500: #e7a84e` | Sí, el del logo va un punto más saturado |
| Crema (palabra)         | `#eee7dd`  | `--cream: #f4f1ec`     | Sí                                       |
| Gris (barra del navbar) | `#8a8f91`  | —                      | Solo aparece en `logo_navbar.svg`        |

**La paleta de la marca ya era la de la página.** No hay que retocar tokens.

## ⚠️ Tal cual vienen, los dos lockups solo sirven sobre fondo oscuro

La palabra «KALLIX» está en crema `#eee7dd`. Sobre el tema claro (`--bg: #f4f1ec`)
da un contraste de **1.09:1** — es invisible. El ámbar tampoco aguanta el tema
claro (1.99:1 contra el mínimo de 3.0 para elementos gráficos).

| Color              | Sobre oscuro `#04161c` | Sobre claro `#f4f1ec` |
| ------------------ | ---------------------- | --------------------- |
| Turquesa `#3c918a` | 4.93 ✅                | 3.32 ✅               |
| Ámbar `#e79e38`    | 8.22 ✅                | **1.99 ❌**           |
| Crema `#eee7dd`    | 15.05 ✅               | **1.09 ❌**           |

Consecuencias para quien lo integre:

- En el **footer** y el **CTA** (zonas `.on-dark`, siempre oscuras) `logo_completo.svg`
  y `logo_navbar.svg` entran tal cual, como `<img>`.
- En el **header** no: la barra cruza de zona oscura a clara al hacer scroll, y en
  tema claro la palabra desaparecería. Por eso `logo.ts` lo sirve inline con la
  palabra en `var(--text)` y la barra separadora en `var(--text-dim)`, que sí
  siguen al tema. Ver `.on-dark` en `CLAUDE.md`.
- El isotipo solo (`logo_solo.svg`) **sí** funciona en ambos temas sin retoque: sus
  dos colores pasan el mínimo de 3.0 en claro y en oscuro.

## Convenciones

- **SVG siempre.** Hoy la página no carga ni una imagen rasterizada.
- **PNG solo para Open Graph** (1200×630), si alguna vez hace falta: es el único
  caso donde el vectorial no sirve.
- Nombres en minúscula, sin espacios ni acentos.
