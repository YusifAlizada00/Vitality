"use client";

import { motion } from "framer-motion";
import { MonitorPlay } from "lucide-react";

import { STREAMING_G_PER_HOUR } from "@/lib/vitalityMath";

type Props = {
  hours: number;
  onHoursChange: (v: number) => void;
  disabled?: boolean;
};

export function DigitalCalculator({ hours, onHoursChange, disabled }: Props) {
  const g = Math.max(0, hours) * STREAMING_G_PER_HOUR;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className={`rounded-2xl border border-white/90 bg-white/90 p-5 shadow-card backdrop-blur-sm ${disabled ? "pointer-events-none opacity-[0.78]" : ""}`}
    >
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100/80 text-violet-700">
          <MonitorPlay className="h-4 w-4" strokeWidth={2.2} />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">Digital</h2>
      </div>
      <p className="mt-1 text-sm text-slate-500">HD-style streaming hours ({STREAMING_G_PER_HOUR} g CO₂-e / h).</p>

      <label className="mt-5 block">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Hours streamed</span>
        <input
          type="number"
          min={0}
          step={0.1}
          value={hours || ""}
          disabled={disabled}
          onChange={(e) => onHoursChange(parseFloat(e.target.value) || 0)}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-mint/50 px-4 py-3 text-lg font-medium tabular-nums text-slate-800 outline-none ring-violet-400/30 focus:ring-2 disabled:cursor-not-allowed"
          placeholder="0.0"
        />
      </label>
      <p className="mt-3 text-xs tabular-nums text-slate-500">≈ {g.toFixed(2)} g CO₂-e</p>
    </motion.div>
  );
}
