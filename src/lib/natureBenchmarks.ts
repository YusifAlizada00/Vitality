/**
 * Teaching-scale benchmarks (same order of magnitude as RecoveryPlan’s 21 kg/tree/year).
 * Not site-specific science — keeps comparisons human-sized.
 */
export const TREE_CO2_KG_PER_YEAR = 21;
/** Rough average CO₂ drawdown attributed to one “yardstick” temperate tree for messaging. */
export const TREE_CO2_G_PER_DAY = (TREE_CO2_KG_PER_YEAR * 1000) / 365;

export function timesTreeDailyUptake(co2Grams: number): number {
  if (co2Grams <= 0) return 0;
  return co2Grams / TREE_CO2_G_PER_DAY;
}
