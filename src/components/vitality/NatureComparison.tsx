"use client";

import { motion } from "framer-motion";
import { Fish, Leaf, TreePine } from "lucide-react";

import { formatGrams } from "@/lib/formatCo2";
import { TREE_CO2_G_PER_DAY, TREE_CO2_KG_PER_YEAR, timesTreeDailyUptake } from "@/lib/natureBenchmarks";
import type { VitalityLedger, VitalityInputs } from "@/lib/vitalityMath";
import type { VitalityCategory } from "./CategoryPicker";

type Props = {
  category: VitalityCategory;
  inputs: VitalityInputs;
  ledger: VitalityLedger;
};

function categoryPollutionG(cat: VitalityCategory, ledger: VitalityLedger): number {
  switch (cat) {
    case "commute":
      return ledger.commuteProducedG;
    case "hydration":
      return ledger.hydrationProducedG;
    case "travel":
      return ledger.travelProducedG;
    case "home":
      return ledger.homeProducedG;
    case "food":
      return ledger.foodProducedG;
    case "digital":
      return ledger.digitalProducedG;
    default:
      return 0;
  }
}

function categoryTitle(cat: VitalityCategory): string {
  switch (cat) {
    case "commute":
      return "Commute footprint";
    case "hydration":
      return "Plastic bottle footprint";
    case "travel":
      return "Flight footprint";
    case "home":
      return "Home electricity footprint";
    case "food":
      return "Meal footprint";
    case "digital":
      return "Streaming footprint";
    default:
      return "Footprint";
  }
}

export function NatureComparison({ category, inputs, ledger }: Props) {
  const g = categoryPollutionG(category, ledger);
  const mult = timesTreeDailyUptake(g);
  const treeDay = TREE_CO2_G_PER_DAY;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 28 }}
      className="mx-4 mt-6 max-w-3xl rounded-3xl border border-emerald-vitality/20 bg-gradient-to-br from-white via-mint to-emerald-vitality/[0.06] p-5 shadow-card sm:mx-auto sm:px-7"
    >
      <div className="flex items-center gap-2 border-b border-emerald-vitality/10 pb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-vitality/15 text-emerald-dark">
          <TreePine className="h-5 w-5" strokeWidth={2.2} />
        </div>
        <div>
          <h3 className="text-sm font-bold tracking-wide text-emerald-dark">You vs nature</h3>
          <p className="text-[11px] text-slate-500">Same tree rule as Recovery (≈{TREE_CO2_KG_PER_YEAR} kg CO₂ / tree / year).</p>
        </div>
      </div>

      <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
        <p>
          <span className="font-semibold text-slate-900">{categoryTitle(category)}:</span>{" "}
          <span className="font-mono tabular-nums">{formatGrams(g, 2)}</span> CO₂-e in this model
          {category === "commute" && inputs.distanceKm > 0 ? (
            <span className="text-slate-500">
              {" "}
              ({inputs.distanceKm.toFixed(2)} km, {inputs.mode})
            </span>
          ) : null}
          {category === "hydration" ? (
            <span className="text-slate-500"> ({inputs.bottles} bottle{inputs.bottles === 1 ? "" : "s"})</span>
          ) : null}
          {category === "travel" && inputs.flightKm > 0 ? (
            <span className="text-slate-500"> ({inputs.flightKm.toFixed(1)} km)</span>
          ) : null}
          .
        </p>

        {g > 0 ? (
          <p>
            One rough <strong>backyard-tree</strong> yardstick pulls on the order of{" "}
            <span className="font-mono font-semibold text-emerald-dark">{treeDay.toFixed(1)} g</span> CO₂ from the air{" "}
            <strong>per day</strong> in this app&apos;s teaching model. Your number above is about{" "}
            <span className="font-mono text-lg font-bold text-sunset-vitality">{mult.toFixed(2)}×</span> that daily
            slice—i.e. it would take about <span className="font-mono font-semibold">{mult.toFixed(2)}</span> such
            tree-days of uptake to match this slice alone (order-of-magnitude only).
          </p>
        ) : (
          <p>
            Nothing counted here yet. For scale: one teaching-model tree still represents ~{" "}
            <span className="font-mono font-semibold text-emerald-dark">{treeDay.toFixed(1)} g</span> CO₂/day of uptake
            in the background—forests and oceans do far more in total.
          </p>
        )}

        <div className="flex gap-3 rounded-2xl border border-sky-vitality/15 bg-sky-soft/40 px-3 py-3 text-xs text-slate-600">
          <Leaf className="mt-0.5 h-4 w-4 shrink-0 text-emerald-dark" />
          <p>
            <strong className="text-slate-800">Plants:</strong> grass and moss fix carbon too, but per square metre per
            day it&apos;s usually tiny next to a whole tree&apos;s canopy and roots—so we anchor comparisons on the
            tree/day number instead of a blade of grass.
          </p>
        </div>

        <div className="flex gap-3 rounded-2xl border border-slate-200/80 bg-white/70 px-3 py-3 text-xs text-slate-600">
          <Fish className="mt-0.5 h-4 w-4 shrink-0 text-sky-vitality" />
          <p>
            <strong className="text-slate-800">Ocean life:</strong> phytoplankton and the marine carbon pump move
            gigatonnes globally, but that&apos;s not something a personal log can allocate to you—so we don&apos;t
            convert streaming hours into “plankton seconds.” The tree line keeps the comparison honest and tangible.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
