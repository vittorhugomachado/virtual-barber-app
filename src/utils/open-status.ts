import type { OpeningHour } from "@/app/themes/types";

export function getOpenStatus(openingHours: OpeningHour[]) {
  const now = new Date();
  const day = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const todayPeriods = openingHours.filter(
    h => h.day_of_week === day && h.is_open,
  );
  for (const period of todayPeriods) {
    const [openH, openM] = period.opens_at.split(":").map(Number);
    const [closeH, closeM] = period.closes_at.split(":").map(Number);
    if (
      currentMinutes >= openH * 60 + openM &&
      currentMinutes < closeH * 60 + closeM
    ) {
      return { open: true, closesAt: period.closes_at.slice(0, 5) };
    }
  }
  return { open: false, closesAt: null };
}

export function getClosedDays(openingHours: OpeningHour[]): Set<number> {
  const closed = new Set<number>();
  for (let d = 0; d <= 6; d++) {
    const hasOpen = openingHours.some(h => h.day_of_week === d && h.is_open);
    if (!hasOpen) closed.add(d);
  }
  return closed;
}