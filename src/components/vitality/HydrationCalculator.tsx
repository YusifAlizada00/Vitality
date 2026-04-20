"use client";

import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";

import { hydrationCo2Grams, PLASTIC_BOTTLE_G_CO2 } from "@/lib/vitalityMath";

type Props = {
  bottles: number;
  onBottlesChange: (n: number) => void;
  disabled?: boolean;
};

export function HydrationCalculator({ bottles, onBottlesChange, disabled }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className={`rounded-2xl border border-white/90 bg-white/90 p-5 shadow-card backdrop-blur-sm ${disabled ? "pointer-events-none opacity-[0.78]" : ""}`}
    >
      <h2 className="text-lg font-semibold text-slate-800">Hydration</h2>
      <p className="mt-1 text-sm text-slate-500">Single-use plastic bottles today (manufacturing footprint).</p>

      <div className="mt-8 flex items-center justify-center gap-6">
        <motion.button
          type="button"
          disabled={disabled}
          whileTap={{ scale: 0.92 }}
          onClick={() => onBottlesChange(Math.max(0, bottles - 1))}
          className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm"
          aria-label="Decrease bottles"
        >
          <Minus className="h-6 w-6" />
        </motion.button>
        <div className="min-w-[4rem] text-center">
          <span className="text-4xl font-bold tabular-nums text-slate-800">{bottles}</span>
          <span className="mt-1 block text-xs uppercase tracking-wide text-slate-400">bottles</span>
        </div>
        <motion.button
          type="button"
          disabled={disabled}
          whileTap={{ scale: 0.92 }}
          onClick={() => onBottlesChange(bottles + 1)}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-vitality to-emerald-dark text-white shadow-lg shadow-emerald-vitality/30"
          aria-label="Increase bottles"
        >
          <Plus className="h-6 w-6" />
        </motion.button>
      </div>
      <p className="mt-6 text-center font-mono text-[10px] text-slate-500">
        {bottles} × {PLASTIC_BOTTLE_G_CO2} g = {hydrationCo2Grams(bottles).toFixed(4)} g CO₂-e
      </p>
    </motion.div>
  );
}
