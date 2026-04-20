/** g CO₂ per km — passenger trip averages (local static model, no API). */
export const COMMUTE_FACTORS = {
  walk: 0,
  bus: 90,
  car: 185,
} as const;

export type CommuteMode = keyof typeof COMMUTE_FACTORS;

/** Economy short-haul: g CO₂-e per passenger-km (static estimate). */
export const FLIGHT_G_PER_KM = 180;

/** Mature temperate tree ~21 kg CO₂ absorbed / year (common communications factor). */
export const KG_CO2_PER_TREE_YEAR = 21;

/** Single-use 500 ml bottle: manufacturing + transport (g CO₂-e per bottle). */
export const PLASTIC_BOTTLE_G_CO2 = 82;

/**
 * Grid electricity — g CO₂-e per kWh (blended grid rough average for in-app math).
 * (Order of magnitude for education; real grids vary by region and hour.)
 */
export const HOME_GRID_G_PER_KWH = 386.4;

/**
 * Per-meal food estimates (g CO₂-e) — simplified lunch-scale portions.
 */
export const MEAL_VEG_G = 390;
export const MEAL_MEAT_G = 2150;

/** HD video streaming — g CO₂-e per hour (device + data-center rough midpoint). */
export const STREAMING_G_PER_HOUR = 47.6;

/** CO₂ gas volume at STP: L per gram (ideal gas, M_CO₂ = 44.01 g/mol, V_m = 22.414 L/mol). */
export const CO2_LITERS_PER_GRAM_STP = 22.414 / 44.01;

export function commuteCo2Grams(distanceKm: number, mode: CommuteMode): number {
  const d = Math.max(0, distanceKm);
  return d * COMMUTE_FACTORS[mode];
}

export function pollutionGapGrams(distanceKm: number, actualMode: CommuteMode): number {
  if (actualMode === "walk") return 0;
  const carGrams = commuteCo2Grams(distanceKm, "car");
  const actualGrams = commuteCo2Grams(distanceKm, actualMode);
  return Math.max(0, carGrams - actualGrams);
}

export function walkSavingsGrams(distanceKm: number, mode: CommuteMode): number {
  const d = Math.max(0, distanceKm);
  if (mode === "walk") return d * COMMUTE_FACTORS.car;
  if (mode === "bus") return d * (COMMUTE_FACTORS.car - COMMUTE_FACTORS.bus);
  return 0;
}

export function flightCo2Grams(distanceKm: number): number {
  return Math.max(0, distanceKm) * FLIGHT_G_PER_KM;
}

export function hydrationCo2Grams(bottles: number): number {
  return Math.max(0, bottles) * PLASTIC_BOTTLE_G_CO2;
}

export function homeEnergyCo2Grams(kwh: number): number {
  return Math.max(0, kwh) * HOME_GRID_G_PER_KWH;
}

/** Produced emissions from meals. */
export function foodProducedGrams(vegMeals: number, meatMeals: number): number {
  return Math.max(0, vegMeals) * MEAL_VEG_G + Math.max(0, meatMeals) * MEAL_MEAT_G;
}

/**
 * "Good" vs counterfactual: each plant-based meal logged as if it replaced a meat meal of same slot.
 */
export function foodDietSavingsGrams(vegMeals: number): number {
  return Math.max(0, vegMeals) * (MEAL_MEAT_G - MEAL_VEG_G);
}

export function digitalCo2Grams(streamingHours: number): number {
  return Math.max(0, streamingHours) * STREAMING_G_PER_HOUR;
}

export function co2VolumeLitersStp(gramsCo2: number): number {
  return gramsCo2 * CO2_LITERS_PER_GRAM_STP;
}

export function balloonAnalogy(gramsCo2: number): string {
  const L = co2VolumeLitersStp(gramsCo2);
  if (L < 0.01) return "Under 0.01 L CO₂ at STP—negligible on this scale.";
  const balloons = Math.max(1, Math.round(L / 2));
  return `${L.toFixed(2)} L CO₂ at STP (~${balloons} party balloons if ≈2 L each).`;
}

export function treesToOffsetKg(co2Kg: number): number {
  if (co2Kg <= 0) return 0;
  return co2Kg / KG_CO2_PER_TREE_YEAR;
}

export function twoYearBusSavingsKg(distanceKmOneWay: number): number {
  const tripsPerWeek = 3;
  const weeksPerYear = 52;
  const years = 2;
  const annualKm = distanceKmOneWay * 2 * tripsPerWeek * weeksPerYear;
  const totalKm = annualKm * years;
  const savedPerKmG = COMMUTE_FACTORS.car - COMMUTE_FACTORS.bus;
  return (totalKm * savedPerKmG) / 1000;
}

export type VitalityInputs = {
  distanceKm: number;
  mode: CommuteMode;
  bottles: number;
  flightKm: number;
  homeKwh: number;
  vegMeals: number;
  meatMeals: number;
  streamingHours: number;
};

/** Empty day / no log — neutral score baseline. */
export const EMPTY_VITALITY_INPUTS: VitalityInputs = {
  distanceKm: 0,
  mode: "walk",
  bottles: 0,
  flightKm: 0,
  homeKwh: 0,
  vegMeals: 0,
  meatMeals: 0,
  streamingHours: 0,
};

export type LedgerLine = {
  id: string;
  label: string;
  producedG: number;
  savedG: number;
  detail: string;
};

export type VitalityLedger = {
  lines: LedgerLine[];
  commuteProducedG: number;
  commuteSavedG: number;
  hydrationProducedG: number;
  travelProducedG: number;
  homeProducedG: number;
  foodProducedG: number;
  foodSavedG: number;
  digitalProducedG: number;
  totalPollutionG: number;
  totalGoodG: number;
  activitySumG: number;
  /** Share of activity pool (good + pollution), each 0–100, sum = 100 when pool > 0. */
  goodSharePct: number;
  pollutionSharePct: number;
  /** 100 × good / (good + pollution); 100 when both zero. */
  vitalityScoreRaw: number;
  vitalityScoreClamped: number;
  scoreFormula: string;
};

function roundPct(x: number, places: number): number {
  const m = 10 ** places;
  return Math.round(x * m) / m;
}

export function computeVitalityLedger(i: VitalityInputs): VitalityLedger {
  const commuteProducedG = commuteCo2Grams(i.distanceKm, i.mode);
  const commuteSavedG = walkSavingsGrams(i.distanceKm, i.mode);
  const hydrationProducedG = hydrationCo2Grams(i.bottles);
  const travelProducedG = flightCo2Grams(i.flightKm);
  const homeProducedG = homeEnergyCo2Grams(i.homeKwh);
  const foodProducedG = foodProducedGrams(i.vegMeals, i.meatMeals);
  const foodSavedG = foodDietSavingsGrams(i.vegMeals);
  const digitalProducedG = digitalCo2Grams(i.streamingHours);

  const lines: LedgerLine[] = [
    {
      id: "commute",
      label: "Commute",
      producedG: commuteProducedG,
      savedG: commuteSavedG,
      detail: `${i.distanceKm.toFixed(2)} km × ${COMMUTE_FACTORS[i.mode]} g/km`,
    },
    {
      id: "hydration",
      label: "Hydration (plastic)",
      producedG: hydrationProducedG,
      savedG: 0,
      detail: `${i.bottles} × ${PLASTIC_BOTTLE_G_CO2} g/bottle`,
    },
    {
      id: "travel",
      label: "Travel (flight)",
      producedG: travelProducedG,
      savedG: 0,
      detail: `${i.flightKm.toFixed(2)} km × ${FLIGHT_G_PER_KM} g/km`,
    },
    {
      id: "home",
      label: "Home electricity",
      producedG: homeProducedG,
      savedG: 0,
      detail: `${i.homeKwh.toFixed(3)} kWh × ${HOME_GRID_G_PER_KWH} g/kWh`,
    },
    {
      id: "food",
      label: "Food (meals)",
      producedG: foodProducedG,
      savedG: foodSavedG,
      detail: `${i.vegMeals} veg × ${MEAL_VEG_G} g + ${i.meatMeals} meat × ${MEAL_MEAT_G} g; savings vs meat baseline for veg slots`,
    },
    {
      id: "digital",
      label: "Streaming",
      producedG: digitalProducedG,
      savedG: 0,
      detail: `${i.streamingHours.toFixed(2)} h × ${STREAMING_G_PER_HOUR} g/h`,
    },
  ];

  const totalPollutionG =
    commuteProducedG + hydrationProducedG + travelProducedG + homeProducedG + foodProducedG + digitalProducedG;
  const totalGoodG = commuteSavedG + foodSavedG;
  const activitySumG = totalPollutionG + totalGoodG;

  let goodSharePct = 0;
  let pollutionSharePct = 0;
  if (activitySumG > 0) {
    goodSharePct = roundPct((100 * totalGoodG) / activitySumG, 4);
    pollutionSharePct = roundPct((100 * totalPollutionG) / activitySumG, 4);
    const drift = 100 - (goodSharePct + pollutionSharePct);
    if (Math.abs(drift) >= 0.0001) {
      pollutionSharePct = roundPct(100 - goodSharePct, 4);
    }
  }

  let vitalityScoreRaw = 100;
  if (totalGoodG + totalPollutionG > 0) {
    vitalityScoreRaw = (100 * totalGoodG) / (totalGoodG + totalPollutionG);
  }
  const vitalityScoreClamped = Math.min(100, Math.max(0, vitalityScoreRaw));
  const scoreFormula =
    totalGoodG + totalPollutionG === 0
      ? "Score = 100.00 (no activity logged)"
      : `Score = 100 × ${totalGoodG.toFixed(4)} / (${totalGoodG.toFixed(4)} + ${totalPollutionG.toFixed(4)}) = ${vitalityScoreRaw.toFixed(4)}`;

  return {
    lines,
    commuteProducedG,
    commuteSavedG,
    hydrationProducedG,
    travelProducedG,
    homeProducedG,
    foodProducedG,
    foodSavedG,
    digitalProducedG,
    totalPollutionG,
    totalGoodG,
    activitySumG,
    goodSharePct,
    pollutionSharePct,
    vitalityScoreRaw,
    vitalityScoreClamped,
    scoreFormula,
  };
}
