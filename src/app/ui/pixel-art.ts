/**
 * Utilidades de pixel art. Las rejillas se escriben como texto para poder
 * leerlas y editarlas directamente en el código fuente.
 */

export interface PixelRun {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly fill: string;
}

/**
 * Convierte una rejilla en rectángulos, fusionando píxeles contiguos del mismo
 * color. Un avatar de 14×14 pasa de ~196 nodos a menos de 60.
 */
export function gridToRuns(
  rows: readonly string[],
  palette: Readonly<Record<string, string>>,
): PixelRun[] {
  const runs: PixelRun[] = [];

  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const key = row[x];
      const fill = palette[key];
      if (!fill) {
        x++;
        continue;
      }

      let w = 1;
      while (x + w < row.length && row[x + w] === key) w++;
      runs.push({ x, y, w, fill });
      x += w;
    }
  });

  return runs;
}
