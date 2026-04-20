"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

import { HOME_GRID_G_PER_KWH } from "@/lib/vitalityMath";

type Props = {
  kwh: number;
  onKwhChange: (v: number) => void;
  disabled?: boolean;
};

export function HomeEnergyCalculator({ kwh, onKwhChange, disabled }: Props) {
  const previewG = Math.max(0, kwh) * HOME_GRID_G_PER_KWH;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className={`rounded-2xl border border-white/90 bg-white/90 p-5 shadow-card backdrop-blur-sm ${disabled ? "pointer-events-none opacity-[0.78]" : ""}`}
    >
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100/80 text-amber-700">
          <Zap className="h-4 w-4" strokeWidth={2.2} />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">Home energy</h2>
      </div>
      <p className="mt-1 text-sm text-slate-500">Household electricity today (grid factor {HOME_GRID_G_PER_KWH} g/kWh).</p>

      <label className="mt-5 block">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Kilowatt-hours (kWh)</span>
        <input
          type="number"
          min={0}
          step={0.01}
          value={kwh || ""}
          disabled={disabled}
          onChange={(e) => onKwhChange(parseFloat(e.target.value) || 0)}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-mint/50 px-4 py-3 text-lg font-medium tabular-nums text-slate-800 outline-none ring-amber-400/30 transition-shadow focus:ring-2 disabled:cursor-not-allowed"
          placeholder="0.00"
        />
      </label>
      <p className="mt-3 text-xs tabular-nums text-slate-500">
        ≈ {previewG.toFixed(2)} g CO₂-e at current value
      </p>
    </motion.div>
  );
}
