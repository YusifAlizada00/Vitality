import type { VitalityInputs } from "@/lib/vitalityMath";

export const HISTORY_STORAGE_KEY = "vitality-history-v1";

export type HistoryRecord = {
  inputs: VitalityInputs;
  updatedAt: number;
};

export type HistoryStore = Record<string, HistoryRecord>;

export function localDateKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function shiftLocalDateKey(key: string, deltaDays: number): string {
  const [y, mo, da] = key.split("-").map(Number);
  const dt = new Date(y, mo - 1, da);
  dt.setDate(dt.getDate() + deltaDays);
  return localDateKey(dt);
}

export function loadHistoryStore(): HistoryStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as HistoryStore;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveHistoryEntry(dateKey: string, inputs: VitalityInputs): void {
  if (typeof window === "undefined") return;
  try {
    const prev = loadHistoryStore();
    prev[dateKey] = { inputs: { ...inputs }, updatedAt: Date.now() };
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(prev));
  } catch {
    /* quota or private mode */
  }
}

export function historyLabelForKey(key: string, todayKey: string): string {
  if (key === todayKey) return "Today";
  const yest = shiftLocalDateKey(todayKey, -1);
  if (key === yest) return "Yesterday";
  const two = shiftLocalDateKey(todayKey, -2);
  if (key === two) return "2 days ago";
  const three = shiftLocalDateKey(todayKey, -3);
  if (key === three) return "3 days ago";
  const [Y, M, D] = key.split("-").map(Number);
  const dt = new Date(Y, M - 1, D);
  return dt.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

export function lastNDayKeys(todayKey: string, n: number): string[] {
  const keys: string[] = [];
  for (let i = 0; i < n; i++) {
    keys.push(shiftLocalDateKey(todayKey, -i));
  }
  return keys;
}
