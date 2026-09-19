/**
 * Contraste WCAG 2.1 de los roles del tema claro. Uso: node scripts/contrast.mjs
 *
 * Mide cada color contra TODAS las superficies claras, no solo contra el fondo
 * base. Un texto oscuro pierde contraste sobre las superficies tintadas y lo
 * gana sobre las elevadas, así que el peor caso no siempre es el mismo — medir
 * solo contra `--bg` dejó pasar varios fallos reales.
 */

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

/** Superficies del tema claro, de la más elevada a la más tintada. */
const SURFACES = {
  'bg-raised': '#fbfaf8',
  bg: '#f4f1ec',
  tintada: '#efe7dc',
  'surface-3': '#ece9e5',
};

/** [rol, color, mínimo exigido] — texto normal 4.5, elementos grandes 3.0 */
const ON_SURFACE = [
  ['text', '#06202a', 4.5],
  ['text-muted', '#3d5f63', 4.5],
  ['text-dim', '#4f6766', 4.5],
  ['accent', '#8a560f', 4.5],
  ['accent-cool', '#1f6b66', 4.5],
  ['badge-teal', '#1f6b66', 4.5],
  ['badge-amber', '#8a5a12', 4.5],
  ['badge-rust', '#9c4a17', 4.5],
  ['focus', '#2b7d77', 3.0],
  // El isotipo es un elemento gráfico: le basta 3.0. Un logotipo está exento de
  // WCAG, pero la «K» es de dos tonos y con el ámbar de marca (#e79e38, 1.83)
  // la mitad derecha se desvanecía sobre crema y el dibujo quedaba cojo.
  ['logo-teal', '#3c918a', 3.0],
  ['logo-amber', '#ad762a', 3.0],
  // Títulos de producto (`PRODUCTS[].colorOnLight`): el tono de marca con la
  // luminosidad bajada hasta pasar 4.5 en la peor superficie.
  ['kalen', '#3c5dda', 4.5],
  ['kineti', '#d2020b', 4.5],
  ['kivo', '#087369', 4.5],
  ['kora', '#ce084c', 4.5],
];

/** [nombre, primer plano, fondo, mínimo] — pares que no van sobre superficie */
const PAIRS = [['accent-ink / accent', '#fffdf7', '#8a560f', 4.5]];

let failed = false;

for (const [role, color, min] of ON_SURFACE) {
  let worst = Infinity;
  let where = '';
  for (const [name, surface] of Object.entries(SURFACES)) {
    const value = ratio(color, surface);
    if (value < worst) {
      worst = value;
      where = name;
    }
  }
  const ok = worst >= min;
  if (!ok) failed = true;
  console.log(
    `${ok ? 'OK  ' : 'FALLA'} ${role.padEnd(14)} ${worst.toFixed(2)}:1 (mín ${min}, peor sobre ${where})`,
  );
}

for (const [name, fg, bg, min] of PAIRS) {
  const value = ratio(fg, bg);
  const ok = value >= min;
  if (!ok) failed = true;
  console.log(`${ok ? 'OK  ' : 'FALLA'} ${name.padEnd(14)} ${value.toFixed(2)}:1 (mín ${min})`);
}

process.exit(failed ? 1 : 0);
