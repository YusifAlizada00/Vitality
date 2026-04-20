"use client";

import { motion } from "framer-motion";

import { COMMUTE_FACTORS, commuteCo2Grams, walkSavingsGrams, type CommuteMode } from "@/lib/vitalityMath";

type Props = {
  distanceKm: number;
  mode: CommuteMode;
  onDistanceChange: (v: number) => void;
  onModeChange: (m: CommuteMode) => void;
  disabled?: boolean;
};

const modes: { id: CommuteMode; label: string }[] = [
  { id: "walk", label: "Walk" },
  { id: "bus", label: "Bus" },
  { id: "car", label: "Car" },
];

export function CommuteCalculator({ distanceKm, mode, onDistanceChange, onModeChange, disabled }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className={`rounded-2xl border border-white/90 bg-white/90 p-5 shadow-card backdrop-blur-sm ${disabled ? "pointer-events-none opacity-[0.78]" : ""}`}
    >
      <h2 className="text-lg font-semibold text-slate-800">Commute</h2>
      <p className="mt-1 text-sm text-slate-500">Distance and how you actually traveled today.</p>

      <label className="mt-5 block">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Distance (km)</span>
        <input
          type="number"
          min={0}
          step={0.1}
          value={distanceKm || ""}
          disabled={disabled}
          onChange={(e) => onDistanceChange(parseFloat(e.target.value) || 0)}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-mint/50 px-4 py-3 text-lg font-medium text-slate-800 outline-none ring-emerald-vitality/30 transition-shadow focus:ring-2 disabled:cursor-not-allowed"
          placeholder="0"
        />
      </label>

      <div className="mt-5">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Mode</span>
        <div className="mt-2 flex rounded-xl bg-mint/80 p-1">
          {modes.map((m) => (
            <button
              key={m.id}
              type="button"
              disabled={disabled}
              onClick={() => onModeChange(m.id)}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                mode === m.id ? "bg-white text-emerald-dark shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-4 rounded-xl bg-mint-deep/80 px-3 py-2 font-mono text-[10px] leading-relaxed text-slate-600">
        Produced: {commuteCo2Grams(distanceKm, mode).toFixed(4)} g = {distanceKm.toFixed(4)} km ×{" "}
        {COMMUTE_FACTORS[mode]} g/km · Credit vs car: {walkSavingsGrams(distanceKm, mode).toFixed(4)} g
      </p>
    </motion.div>
  );
}
