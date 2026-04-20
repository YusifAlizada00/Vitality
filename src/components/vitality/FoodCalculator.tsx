"use client";

import { motion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";

import { MEAL_MEAT_G, MEAL_VEG_G } from "@/lib/vitalityMath";

type Props = {
  vegMeals: number;
  meatMeals: number;
  onVegChange: (n: number) => void;
  onMeatChange: (n: number) => void;
  disabled?: boolean;
};

export function FoodCalculator({ vegMeals, meatMeals, onVegChange, onMeatChange, disabled }: Props) {
  const produced = vegMeals * MEAL_VEG_G + meatMeals * MEAL_MEAT_G;
  const saved = vegMeals * (MEAL_MEAT_G - MEAL_VEG_G);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className={`rounded-2xl border border-white/90 bg-white/90 p-5 shadow-card backdrop-blur-sm ${disabled ? "pointer-events-none opacity-[0.78]" : ""}`}
    >
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100/80 text-rose-700">
          <UtensilsCrossed className="h-4 w-4" strokeWidth={2.2} />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">Food</h2>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        Meals today — veg {MEAL_VEG_G} g CO₂-e each, meat-heavy {MEAL_MEAT_G} g each. “Good” credits veg slots vs a meat
        baseline.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Plant-based meals</span>
          <input
            type="number"
            min={0}
            step={1}
            value={vegMeals || ""}
            disabled={disabled}
            onChange={(e) => onVegChange(Math.max(0, parseInt(e.target.value, 10) || 0))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-mint/50 px-3 py-2.5 text-center text-lg font-semibold tabular-nums outline-none ring-emerald-vitality/25 focus:ring-2 disabled:cursor-not-allowed"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Meat-forward meals</span>
          <input
            type="number"
            min={0}
            step={1}
            value={meatMeals || ""}
            disabled={disabled}
            onChange={(e) => onMeatChange(Math.max(0, parseInt(e.target.value, 10) || 0))}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-mint/50 px-3 py-2.5 text-center text-lg font-semibold tabular-nums outline-none ring-sunset-vitality/25 focus:ring-2 disabled:cursor-not-allowed"
          />
        </label>
      </div>
      <div className="mt-4 rounded-xl bg-mint-deep/80 px-3 py-2 text-xs tabular-nums text-slate-600">
        <span className="font-medium text-slate-700">Live:</span> produced {produced.toFixed(2)} g · diet “swap” credit{" "}
        {saved.toFixed(2)} g
      </div>
    </motion.div>
  );
}
