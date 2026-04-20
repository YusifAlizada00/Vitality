"use client";

import { motion } from "framer-motion";
import { Leaf, TrendingUp } from "lucide-react";

import { formatGrams, formatKgFromG } from "@/lib/formatCo2";
import { treesToOffsetKg, twoYearBusSavingsKg, type VitalityLedger } from "@/lib/vitalityMath";

type Props = {
  ledger: VitalityLedger;
  commuteDistanceKm: number;
};

export function RecoveryPlan({ ledger, commuteDistanceKm }: Props) {
  const pollutionKg = ledger.totalPollutionG / 1000;
  const trees = treesToOffsetKg(pollutionKg);
  const busKm = commuteDistanceKm > 0 ? commuteDistanceKm : 8;
  const savedKg = twoYearBusSavingsKg(busKm);
  const yearEnd = new Date().getFullYear() + 2;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28, delay: 0.08 }}
      className="mx-4 mt-5 mb-10 rounded-3xl border border-emerald-vitality/20 bg-gradient-to-br from-white via-mint to-sky-soft/30 p-6 shadow-card"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-vitality/15 text-emerald-dark">
          <Leaf className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-dark">Recovery plan</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Today&apos;s total pollution from the ledger is{" "}
            <span className="font-mono font-semibold text-slate-900">{formatGrams(ledger.totalPollutionG, 4)}</span>{" "}
            (<span className="font-mono">{formatKgFromG(ledger.totalPollutionG, 6)}</span> CO₂-e). To offset that in
            one year with the 21 kg/tree rule-of-thumb, plant about{" "}
            <span className="font-mono font-bold text-emerald-dark">{trees.toFixed(4)}</span> mature trees.
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-white/60 bg-white/85 p-4 shadow-sm backdrop-blur-sm">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-vitality/15 text-sky-vitality">
          <TrendingUp className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500">2-year outlook</h4>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            If you switch to <span className="font-semibold text-slate-900">Bus 3× per week</span> for your{" "}
            <span className="font-mono font-semibold">{busKm.toFixed(4)} km</span> one-way commute (round trip each day),
            modeled savings vs solo car are{" "}
            <span className="font-mono font-bold text-sky-vitality">{savedKg.toFixed(4)} kg</span> CO₂-e by{" "}
            <span className="font-semibold">{yearEnd}</span> (exact formula: 2 × 52 × 3 × 2 × km × (185 − 90) g/km ÷
            1000).
          </p>
        </div>
      </div>
    </motion.section>
  );
}
