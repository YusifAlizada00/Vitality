"use client";

import { motion } from "framer-motion";

import { formatScore } from "@/lib/formatCo2";
import { computeVitalityLedger, EMPTY_VITALITY_INPUTS, type VitalityInputs } from "@/lib/vitalityMath";
import { historyLabelForKey, lastNDayKeys, type HistoryStore } from "@/lib/vitalityHistoryStorage";

type Props = {
  todayKey: string;
  store: HistoryStore;
  /** Live today inputs (for Today chip preview when not yet persisted). */
  liveTodayInputs: VitalityInputs;
  selectedKey: string | null;
  onSelect: (dateKey: string | null) => void;
  days?: number;
};

export function HistoryStrip({ todayKey, store, liveTodayInputs, selectedKey, onSelect, days = 14 }: Props) {
  const keys = lastNDayKeys(todayKey, days);

  return (
    <section className="mt-6 px-4">
      <div className="mx-auto max-w-2xl">
        <p className="mb-2 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">History</p>
        <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1 pt-0.5">
          {keys.map((key, i) => {
            const isToday = key === todayKey;
            const isSelected = selectedKey === null ? isToday : selectedKey === key;
            const record = store[key];
            const inputsForScore: VitalityInputs = isToday
              ? liveTodayInputs
              : record?.inputs ?? EMPTY_VITALITY_INPUTS;
            const score = computeVitalityLedger(inputsForScore).vitalityScoreClamped;
            const hasData = isToday || !!record;

            return (
              <motion.button
                key={key}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30, delay: i * 0.02 }}
                onClick={() => onSelect(isToday ? null : key)}
                className={`shrink-0 rounded-2xl border-2 px-3.5 py-2.5 text-left shadow-sm transition-all ${
                  isSelected
                    ? "border-emerald-vitality/60 bg-white shadow-cardHover ring-2 ring-emerald-vitality/20"
                    : "border-white/70 bg-white/70 hover:border-sky-vitality/30"
                } ${!hasData && !isToday ? "opacity-55" : ""}`}
              >
                <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  {historyLabelForKey(key, todayKey)}
                </span>
                <span className="mt-0.5 block font-mono text-lg font-bold tabular-nums text-slate-800">
                  {hasData || isToday ? formatScore(score, 1) : "—"}
                </span>
                <span className="block font-mono text-[9px] text-slate-400">{key}</span>
              </motion.button>
            );
          })}
        </div>
        <p className="mt-2 text-center text-[10px] text-slate-400">
          Saved on this device only. Tap a day to view; only <span className="font-semibold text-slate-600">Today</span>{" "}
          is editable.
        </p>
      </div>
    </section>
  );
}
