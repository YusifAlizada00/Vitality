"use client";

import { motion } from "framer-motion";

import { formatGrams, formatPercent, formatScore } from "@/lib/formatCo2";
import { balloonAnalogy, pollutionGapGrams, type CommuteMode, type VitalityLedger } from "@/lib/vitalityMath";

type Props = {
  ledger: VitalityLedger;
  commuteMode: CommuteMode;
  distanceKm: number;
};

export function ImpactHUD({ ledger, commuteMode, distanceKm }: Props) {
  const { totalGoodG, totalPollutionG, goodSharePct, pollutionSharePct, vitalityScoreClamped, vitalityScoreRaw } =
    ledger;

  const gapCar = pollutionGapGrams(distanceKm, commuteMode);
  const vsWalkG = commuteMode === "walk" ? 0 : ledger.commuteProducedG;
  const analogy = balloonAnalogy(totalPollutionG + totalGoodG * 0.05);

  const arcLen = 251.2;
  const dashOffset = arcLen - (arcLen * vitalityScoreClamped) / 100;

  const scoreStr = formatScore(vitalityScoreClamped, 2);
  const rawStr = formatScore(vitalityScoreRaw, 4);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className="relative mx-4 mt-6 overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/70 p-1 shadow-card backdrop-blur-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-vitality/[0.07] via-transparent to-sky-vitality/[0.08]" />
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sunset-vitality/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-emerald-vitality/10 blur-3xl" />

      <div className="relative rounded-[1.55rem] border border-white/80 bg-white/85 px-5 pb-6 pt-7 sm:px-8">
        <div className="flex flex-col items-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">Vitality balance index</p>
          <div className="relative mt-1 h-[9.5rem] w-[17rem] sm:h-40 sm:w-[18rem]">
            <svg viewBox="0 0 200 118" className="h-full w-full drop-shadow-sm" aria-hidden>
              <defs>
                <linearGradient id="gaugeGradVitality" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3498DB" />
                  <stop offset="45%" stopColor="#2ECC71" />
                  <stop offset="100%" stopColor="#E67E22" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M 22 98 A 78 78 0 0 1 178 98"
                fill="none"
                stroke="#E2EDE2"
                strokeWidth="15"
                strokeLinecap="round"
              />
              <motion.path
                d="M 22 98 A 78 78 0 0 1 178 98"
                fill="none"
                stroke="url(#gaugeGradVitality)"
                strokeWidth="15"
                strokeLinecap="round"
                strokeDasharray={arcLen}
                filter="url(#glow)"
                initial={{ strokeDashoffset: arcLen }}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ type: "spring", stiffness: 70, damping: 16 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-0 sm:pb-1">
              <motion.div
                key={scoreStr}
                initial={{ scale: 0.92, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="text-center"
              >
                <span className="block bg-gradient-to-r from-emerald-dark via-emerald-vitality to-sky-vitality bg-clip-text text-5xl font-black tabular-nums tracking-tight text-transparent sm:text-[3.25rem]">
                  {scoreStr}
                </span>
                <span className="mt-0.5 block text-xs font-semibold text-slate-400">/ 100.00</span>
              </motion.div>
            </div>
          </div>
          <p className="mt-1 text-center font-mono text-[10px] leading-relaxed text-slate-400">
            Raw: {rawStr} · clamped to [0, 100] for the dial
          </p>
        </div>

        <div className="mt-7 grid gap-5">
          <div>
            <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2 text-xs">
              <span className="font-bold uppercase tracking-wide text-emerald-dark">Good done</span>
              <span className="font-mono tabular-nums text-slate-700">
                {formatGrams(totalGoodG, 4)}{" "}
                <span className="text-slate-400">({formatPercent(goodSharePct, 4)} of pool)</span>
              </span>
            </div>
            <div className="relative h-4 overflow-hidden rounded-full bg-mint-deep shadow-inner">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-vitality via-emerald-vitality to-emerald-dark shadow-sm"
                initial={{ width: "0%" }}
                animate={{ width: `${goodSharePct}%` }}
                transition={{ type: "spring", stiffness: 180, damping: 22 }}
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-end pr-2 text-[9px] font-bold text-white/90 mix-blend-difference">
                {goodSharePct >= 8 ? formatPercent(goodSharePct, 2) : ""}
              </div>
            </div>
          </div>
          <div>
            <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2 text-xs">
              <span className="font-bold uppercase tracking-wide text-sunset-vitality">Pollution</span>
              <span className="font-mono tabular-nums text-slate-700">
                {formatGrams(totalPollutionG, 4)}{" "}
                <span className="text-slate-400">({formatPercent(pollutionSharePct, 4)} of pool)</span>
              </span>
            </div>
            <div className="relative h-4 overflow-hidden rounded-full bg-sunset-soft/50 shadow-inner">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-sunset-vitality to-orange-600 shadow-sm"
                initial={{ width: "0%" }}
                animate={{ width: `${pollutionSharePct}%` }}
                transition={{ type: "spring", stiffness: 180, damping: 22 }}
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-end pr-2 text-[9px] font-bold text-white/95 mix-blend-difference">
                {pollutionSharePct >= 8 ? formatPercent(pollutionSharePct, 2) : ""}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-sky-vitality/15 bg-gradient-to-br from-sky-soft/80 to-mint/60 px-4 py-3">
          <p className="text-center text-sm leading-relaxed text-slate-700">{analogy}</p>
        </div>

        <details className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2 text-left">
          <summary className="cursor-pointer select-none text-xs font-semibold text-slate-600">Show score formula</summary>
          <p className="mt-2 font-mono text-[10px] leading-relaxed text-slate-500">{ledger.scoreFormula}</p>
        </details>

        {distanceKm > 0 && commuteMode !== "walk" ? (
          <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-500">
            <span className="font-semibold text-sunset-vitality">Vs walking:</span>{" "}
            <span className="font-mono">{formatGrams(vsWalkG, 4)}</span> CO₂ for this{" "}
            <span className="font-mono">{distanceKm.toFixed(4)}</span> km trip.
            {gapCar > 0 ? (
              <>
                {" "}
                <span className="font-semibold text-emerald-dark">Solo car gap avoided:</span>{" "}
                <span className="font-mono">{formatGrams(gapCar, 4)}</span>.
              </>
            ) : null}
          </p>
        ) : null}
      </div>
    </motion.section>
  );
}
