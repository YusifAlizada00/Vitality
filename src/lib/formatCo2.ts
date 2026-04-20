/** Format mass in grams with fixed decimals (locale thousands). */
export function formatGrams(g: number, decimals = 2): string {
  if (!Number.isFinite(g)) return "—";
  const abs = Math.abs(g);
  if (abs >= 1_000_000) return `${(g / 1_000_000).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })} t`;
  if (abs >= 1000) return `${(g / 1000).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })} kg`;
  return `${g.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })} g`;
}

export function formatKgFromG(grams: number, decimals = 4): string {
  return `${(grams / 1000).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })} kg`;
}

export function formatPercent(p: number, decimals = 2): string {
  if (!Number.isFinite(p)) return "—";
  return `${p.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}%`;
}

export function formatScore(score: number, decimals = 2): string {
  if (!Number.isFinite(score)) return "—";
  return score.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
