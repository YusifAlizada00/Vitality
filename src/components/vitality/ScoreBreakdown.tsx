"use client";

import { motion } from "framer-motion";

import { formatGrams, formatPercent } from "@/lib/formatCo2";
import type { VitalityLedger } from "@/lib/vitalityMath";

type Props = { ledger: VitalityLedger };

export function ScoreBreakdown({ ledger }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28, delay: 0.04 }}
      className="mx-4 mt-5 rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-card backdrop-blur-sm"
    >
      <div className="flex items-end justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold tracking-wide text-slate-800">Ledger</h3>
          <p className="text-xs text-slate-500">Every line uses the same factors as your score.</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Activity sum</p>
          <p className="text-sm font-bold tabular-nums text-slate-800">{formatGrams(ledger.activitySumG, 4)}</p>
        </div>
      </div>

      <div className="mt-3 overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full min-w-[320px] text-left text-xs">
          <thead>
            <tr className="bg-mint-deep/90 text-[10px] font-bold uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2 text-right tabular-nums">Produced</th>
              <th className="px-3 py-2 text-right tabular-nums">Saved / credit</th>
            </tr>
          </thead>
          <tbody>
            {ledger.lines.map((row, idx) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="border-t border-slate-100/80 odd:bg-white/60"
              >
                <td className="px-3 py-2.5">
                  <span className="font-semibold text-slate-800">{row.label}</span>
                  <p className="mt-0.5 max-w-[220px] font-mono text-[10px] leading-snug text-slate-400">{row.detail}</p>
                </td>
                <td className="px-3 py-2.5 text-right font-mono tabular-nums text-sunset-vitality">
                  {formatGrams(row.producedG, 4)}
                </td>
                <td className="px-3 py-2.5 text-right font-mono tabular-nums text-emerald-dark">
                  {formatGrams(row.savedG, 4)}
                </td>
              </motion.tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-200 bg-mint/90 font-bold">
              <td className="px-3 py-2.5 text-slate-800">Totals</td>
              <td className="px-3 py-2.5 text-right font-mono tabular-nums text-sunset-vitality">
                {formatGrams(ledger.totalPollutionG, 4)}
              </td>
              <td className="px-3 py-2.5 text-right font-mono tabular-nums text-emerald-dark">
                {formatGrams(ledger.totalGoodG, 4)}
              </td>
            </tr>
            <tr className="bg-slate-50/90 text-[10px] text-slate-500">
              <td className="px-3 py-2" colSpan={3}>
                Pool shares:{" "}
                <span className="font-mono font-semibold text-emerald-dark">{formatPercent(ledger.goodSharePct, 4)}</span>{" "}
                good ·{" "}
                <span className="font-mono font-semibold text-sunset-vitality">
                  {formatPercent(ledger.pollutionSharePct, 4)}
                </span>{" "}
                pollution <span className="text-slate-400">(of produced + saved)</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </motion.section>
  );
}
