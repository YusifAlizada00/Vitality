"use client";

import { motion } from "framer-motion";

import { FLIGHT_G_PER_KM, flightCo2Grams } from "@/lib/vitalityMath";

type Props = {
  flightKm: number;
  onFlightKmChange: (v: number) => void;
  disabled?: boolean;
};

export function TravelCalculator({ flightKm, onFlightKmChange, disabled }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className={`rounded-2xl border border-white/90 bg-white/90 p-5 shadow-card backdrop-blur-sm ${disabled ? "pointer-events-none opacity-[0.78]" : ""}`}
    >
      <h2 className="text-lg font-semibold text-slate-800">Travel</h2>
      <p className="mt-1 text-sm text-slate-500">Rough flight footprint (economy, local estimate—no live data).</p>

      <label className="mt-5 block">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Flight distance (km)</span>
        <input
          type="number"
          min={0}
          step={10}
          value={flightKm || ""}
          disabled={disabled}
          onChange={(e) => onFlightKmChange(parseFloat(e.target.value) || 0)}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-mint/50 px-4 py-3 text-lg font-medium text-slate-800 outline-none ring-sky-vitality/30 transition-shadow focus:ring-2 disabled:cursor-not-allowed"
          placeholder="0"
        />
      </label>
      <p className="mt-3 font-mono text-[10px] text-slate-500">
        {flightKm.toFixed(4)} km × {FLIGHT_G_PER_KM} g/km = {flightCo2Grams(flightKm).toFixed(4)} g CO₂-e
      </p>
    </motion.div>
  );
}
