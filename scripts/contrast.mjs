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
  ['accent / bg', '#945d11', '#f4f1ec', 4.5],
  ['accent-ink / accent', '#fffdf7', '#945d11', 4.5],
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
