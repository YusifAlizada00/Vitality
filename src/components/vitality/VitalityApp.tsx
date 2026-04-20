"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { CommuteMode } from "@/lib/vitalityMath";
import { computeVitalityLedger, EMPTY_VITALITY_INPUTS, type VitalityInputs } from "@/lib/vitalityMath";
import {
  HISTORY_STORAGE_KEY,
  loadHistoryStore,
  localDateKey,
  saveHistoryEntry,
  type HistoryStore,
} from "@/lib/vitalityHistoryStorage";

import { CategoryPicker, type VitalityCategory } from "./CategoryPicker";
import { CommuteCalculator } from "./CommuteCalculator";
import { DigitalCalculator } from "./DigitalCalculator";
import { FoodCalculator } from "./FoodCalculator";
import { HistoryStrip } from "./HistoryStrip";
import { HomeEnergyCalculator } from "./HomeEnergyCalculator";
import { HydrationCalculator } from "./HydrationCalculator";
import { ImpactChart } from "./ImpactChart";
import { ImpactHUD } from "./ImpactHUD";
import { NatureComparison } from "./NatureComparison";
import { RecoveryPlan } from "./RecoveryPlan";
import { ScoreBreakdown } from "./ScoreBreakdown";
import { SectionIllustration } from "./SectionIllustration";
import { TravelCalculator } from "./TravelCalculator";

export function VitalityApp() {
  const [category, setCategory] = useState<VitalityCategory>("commute");
  const [distanceKm, setDistanceKm] = useState(5);
  const [mode, setMode] = useState<CommuteMode>("bus");
  const [bottles, setBottles] = useState(0);
  const [flightKm, setFlightKm] = useState(0);
  const [homeKwh, setHomeKwh] = useState(0);
  const [vegMeals, setVegMeals] = useState(0);
  const [meatMeals, setMeatMeals] = useState(0);
  const [streamingHours, setStreamingHours] = useState(0);

  const [historyStore, setHistoryStore] = useState<HistoryStore>({});
  const [selectedHistoryKey, setSelectedHistoryKey] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const todayKey = localDateKey();

  const todayInputs: VitalityInputs = useMemo(
    () => ({
      distanceKm,
      mode,
      bottles,
      flightKm,
      homeKwh,
      vegMeals,
      meatMeals,
      streamingHours,
    }),
    [distanceKm, mode, bottles, flightKm, homeKwh, vegMeals, meatMeals, streamingHours],
  );

  const viewingPast = selectedHistoryKey !== null;

  const effectiveInputs: VitalityInputs = useMemo(() => {
    if (!selectedHistoryKey) return todayInputs;
    return historyStore[selectedHistoryKey]?.inputs ?? EMPTY_VITALITY_INPUTS;
  }, [selectedHistoryKey, historyStore, todayInputs]);

  const ledger = useMemo(() => computeVitalityLedger(effectiveInputs), [effectiveInputs]);

  const hasRecordForSelection = selectedHistoryKey ? !!historyStore[selectedHistoryKey] : true;

  useEffect(() => {
    const store = loadHistoryStore();
    setHistoryStore(store);
    const tk = localDateKey();
    const ent = store[tk];
    if (ent?.inputs) {
      const i = ent.inputs;
      setDistanceKm(i.distanceKm);
      setMode(i.mode);
      setBottles(i.bottles);
      setFlightKm(i.flightKm);
      setHomeKwh(i.homeKwh);
      setVegMeals(i.vegMeals);
      setMeatMeals(i.meatMeals);
      setStreamingHours(i.streamingHours);
    }
    setHydrated(true);
  }, []);

  const persistToday = useCallback(() => {
    saveHistoryEntry(localDateKey(), todayInputs);
    setHistoryStore(loadHistoryStore());
  }, [todayInputs]);

  useEffect(() => {
    if (!hydrated || viewingPast) return;
    const id = window.setTimeout(() => persistToday(), 750);
    return () => window.clearTimeout(id);
  }, [hydrated, viewingPast, persistToday, todayInputs]);

  const handleHistorySelect = useCallback((key: string | null) => {
    setSelectedHistoryKey(key);
  }, []);

  return (
    <div className="pb-12">
      <header className="px-5 pt-14 pb-4 text-center sm:pt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-dark/80">Planet health</p>
        <h1 className="mt-2 bg-gradient-to-r from-emerald-dark via-emerald-vitality to-sky-vitality bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
          VITALITY
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600">
          Six trackers, one ledger. History stays on this device ({HISTORY_STORAGE_KEY}). Tap{" "}
          <span className="font-semibold text-slate-700">Today</span> to edit again.
        </p>
      </header>

      <HistoryStrip
        todayKey={todayKey}
        store={historyStore}
        liveTodayInputs={todayInputs}
        selectedKey={selectedHistoryKey}
        onSelect={handleHistorySelect}
        days={14}
      />

      {viewingPast ? (
        <div
          className={`mx-4 mt-4 rounded-2xl border px-4 py-3 text-center text-sm ${
            hasRecordForSelection
              ? "border-sky-vitality/30 bg-sky-soft/50 text-slate-700"
              : "border-amber-200/80 bg-amber-50/90 text-amber-900"
          }`}
        >
          {hasRecordForSelection ? (
            <>
              Viewing <span className="font-mono font-semibold">{selectedHistoryKey}</span> — read-only. Open any
              section to see that day&apos;s illustration and math.
            </>
          ) : (
            <>
              No saved log for <span className="font-mono font-semibold">{selectedHistoryKey}</span>. Showing a neutral
              empty day (zeros).
            </>
          )}
        </div>
      ) : null}

      <CategoryPicker active={category} onSelect={setCategory} />

      <div className="mx-auto mt-6 flex max-w-3xl flex-col gap-5 px-4 sm:flex-row sm:items-stretch sm:gap-6">
        <div className="min-w-0 flex-1 space-y-0">
          {category === "commute" ? (
            <CommuteCalculator
              distanceKm={effectiveInputs.distanceKm}
              mode={effectiveInputs.mode}
              onDistanceChange={setDistanceKm}
              onModeChange={setMode}
              disabled={viewingPast}
            />
          ) : null}
          {category === "hydration" ? (
            <HydrationCalculator bottles={effectiveInputs.bottles} onBottlesChange={setBottles} disabled={viewingPast} />
          ) : null}
          {category === "travel" ? (
            <TravelCalculator flightKm={effectiveInputs.flightKm} onFlightKmChange={setFlightKm} disabled={viewingPast} />
          ) : null}
          {category === "home" ? (
            <HomeEnergyCalculator kwh={effectiveInputs.homeKwh} onKwhChange={setHomeKwh} disabled={viewingPast} />
          ) : null}
          {category === "food" ? (
            <FoodCalculator
              vegMeals={effectiveInputs.vegMeals}
              meatMeals={effectiveInputs.meatMeals}
              onVegChange={setVegMeals}
              onMeatChange={setMeatMeals}
              disabled={viewingPast}
            />
          ) : null}
          {category === "digital" ? (
            <DigitalCalculator
              hours={effectiveInputs.streamingHours}
              onHoursChange={setStreamingHours}
              disabled={viewingPast}
            />
          ) : null}

          <p className="mt-4 text-center text-xs text-slate-400">
            {viewingPast
              ? "Switch to Today to change numbers. Illustration reflects the day you are viewing."
              : "All six categories feed the same score—switch cards anytime. Today auto-saves after you pause typing."}
          </p>
        </div>

        <div className="mx-auto w-full max-w-[260px] shrink-0 sm:mx-0 sm:max-w-[min(280px,32vw)]">
          <SectionIllustration category={category} inputs={effectiveInputs} ledger={ledger} />
        </div>
      </div>

      <NatureComparison category={category} inputs={effectiveInputs} ledger={ledger} />

      <ImpactHUD ledger={ledger} commuteMode={effectiveInputs.mode} distanceKm={effectiveInputs.distanceKm} />

      <ScoreBreakdown ledger={ledger} />

      <ImpactChart ledger={ledger} />

      <RecoveryPlan ledger={ledger} commuteDistanceKm={effectiveInputs.distanceKm} />
    </div>
  );
}
