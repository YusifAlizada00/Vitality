"use client";

import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatGrams } from "@/lib/formatCo2";
import type { VitalityLedger } from "@/lib/vitalityMath";

type Props = {
  ledger: VitalityLedger;
};

const COLORS = {
  saved: "#2ECC71",
  commute: "#27AE60",
  hydration: "#3498DB",
  travel: "#E67E22",
  home: "#F39C12",
  food: "#E74C3C",
  digital: "#9B59B6",
};

export function ImpactChart({ ledger }: Props) {
  const empty = ledger.activitySumG <= 0;

  const row = {
    name: "Today (g CO₂-e)",
    saved: Number(ledger.totalGoodG.toFixed(4)),
    commute: Number(ledger.commuteProducedG.toFixed(4)),
    hydration: Number(ledger.hydrationProducedG.toFixed(4)),
    travel: Number(ledger.travelProducedG.toFixed(4)),
    home: Number(ledger.homeProducedG.toFixed(4)),
    food: Number(ledger.foodProducedG.toFixed(4)),
    digital: Number(ledger.digitalProducedG.toFixed(4)),
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28, delay: 0.05 }}
      className="mx-4 mt-5 rounded-3xl border border-white/90 bg-white/92 p-5 shadow-card backdrop-blur-sm"
    >
      <h3 className="text-sm font-bold text-slate-800">Impact stack</h3>
      <p className="mt-0.5 text-xs text-slate-500">
        One horizontal bar: green = all &quot;good&quot; credits, warm tones = each pollution source (exact gram values
        in tooltip).
      </p>
      <div className="mt-4 h-56 w-full sm:h-52">
        {empty ? (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-mint/80 text-sm text-slate-400">
            Log any category to populate the stack.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={[row]} margin={{ top: 4, right: 8, left: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 6" stroke="#E2E8E0" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(2)}k` : `${v}`)}
              />
              <YAxis type="category" dataKey="name" width={108} tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value: number, name: string) => [formatGrams(value, 4), name]}
                contentStyle={{
                  borderRadius: "14px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              <Bar dataKey="saved" stackId="a" fill={COLORS.saved} name="Saved / credit" />
              <Bar dataKey="commute" stackId="a" fill={COLORS.commute} name="Commute" />
              <Bar dataKey="hydration" stackId="a" fill={COLORS.hydration} name="Hydration" />
              <Bar dataKey="travel" stackId="a" fill={COLORS.travel} name="Travel" />
              <Bar dataKey="home" stackId="a" fill={COLORS.home} name="Home" />
              <Bar dataKey="food" stackId="a" fill={COLORS.food} name="Food" />
              <Bar dataKey="digital" stackId="a" fill={COLORS.digital} name="Digital" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.section>
  );
}
