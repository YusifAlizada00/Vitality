"use client";

import { motion } from "framer-motion";
import { Bike, GlassWater, MonitorPlay, Plane, UtensilsCrossed, Zap, type LucideIcon } from "lucide-react";

export type VitalityCategory = "commute" | "hydration" | "travel" | "home" | "food" | "digital";

const categories: {
  id: VitalityCategory;
  label: string;
  sub: string;
  icon: LucideIcon;
  accent: string;
  ring: string;
}[] = [
  {
    id: "commute",
    label: "COMMUTE",
    sub: "Move smarter",
    icon: Bike,
    accent: "from-emerald-vitality/25 to-sky-vitality/15",
    ring: "ring-emerald-vitality/35",
  },
  {
    id: "hydration",
    label: "HYDRATION",
    sub: "Ditch plastic",
    icon: GlassWater,
    accent: "from-sky-vitality/25 to-emerald-vitality/12",
    ring: "ring-sky-vitality/35",
  },
  {
    id: "travel",
    label: "TRAVEL",
    sub: "Fly aware",
    icon: Plane,
    accent: "from-sunset-vitality/25 to-sky-vitality/12",
    ring: "ring-sunset-vitality/35",
  },
  {
    id: "home",
    label: "HOME",
    sub: "Power use",
    icon: Zap,
    accent: "from-amber-200/90 to-orange-100/80",
    ring: "ring-amber-400/40",
  },
  {
    id: "food",
    label: "FOOD",
    sub: "Meals",
    icon: UtensilsCrossed,
    accent: "from-rose-200/90 to-orange-100/70",
    ring: "ring-rose-400/35",
  },
  {
    id: "digital",
    label: "DIGITAL",
    sub: "Streaming",
    icon: MonitorPlay,
    accent: "from-violet-200/90 to-sky-100/70",
    ring: "ring-violet-400/35",
  },
];

type Props = {
  active: VitalityCategory;
  onSelect: (c: VitalityCategory) => void;
};

export function CategoryPicker({ active, onSelect }: Props) {
  return (
    <section className="px-4 pt-2">
      <p className="mb-3 text-center text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Today I am tracking</p>
      <div className="hide-scrollbar -mx-1 flex gap-2.5 overflow-x-auto pb-2 pl-1 pr-4 sm:mx-auto sm:max-w-3xl sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pr-0">
        {categories.map((c, i) => {
          const Icon = c.icon;
          const isActive = active === c.id;
          return (
            <motion.button
              key={c.id}
              type="button"
              onClick={() => onSelect(c.id)}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 28, delay: i * 0.04 }}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className={`relative min-w-[132px] max-w-[160px] flex-1 rounded-2xl border-2 p-3.5 text-left shadow-card transition-all sm:min-w-[140px] sm:flex-none ${
                isActive
                  ? `border-transparent bg-white shadow-cardHover ring-2 ${c.ring}`
                  : "border-white/80 bg-white/75 hover:border-emerald-vitality/20"
              }`}
            >
              <div
                className={`mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${c.accent} ${
                  isActive ? "text-slate-800" : "text-slate-600"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={2.1} />
              </div>
              <span className="block text-[13px] font-bold tracking-wide text-slate-800">{c.label}</span>
              <span className="mt-0.5 block text-[11px] leading-tight text-slate-500">{c.sub}</span>
              {isActive ? (
                <motion.span
                  layoutId="vitalityCatPill"
                  className="absolute right-2.5 top-2.5 h-2 w-8 rounded-full bg-gradient-to-r from-emerald-vitality to-sky-vitality"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              ) : null}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
