// import {
//   DAYS_FULL,
//   MONTHS_SHORT,
//   type BarberAvailability,
//   type OpeningHour,
// } from "@/app/themes/types";
// 
// export function formatTime(time: string) {
//   return time.slice(0, 5);
// }
// 
// export function timeToMinutes(time: string) {
//   const [h, m] = time.split(":").map(Number);
//   return h * 60 + m;
// }
// 
// export function minutesToTime(minutes: number) {
//   return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
// }
// 
// export function addMinutes(time: string, minutes: number) {
//   const [h, m] = time.split(":").map(Number);
//   const total = h * 60 + m + minutes;
//   return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
// }
// 
// export function formatDate(dateStr: string) {
//   const d = new Date(dateStr + "T12:00:00");
//   return `${DAYS_FULL[d.getDay()]}, ${d.getDate()} de ${MONTHS_SHORT[d.getMonth()]}`;
// }
// 
// export function getTimePeriod(time: string): "manha" | "tarde" | "noite" {
//   const [h, m] = time.split(":").map(Number);
//   const min = h * 60 + m;
// 
//   const manha = { start: 4 * 60, end: 13 * 60 - 1 };
//   const tarde = { start: 13 * 60, end: 18 * 60 - 1 };
// 
//   if (min >= manha.start && min <= manha.end) return "manha";
//   if (min >= tarde.start && min <= tarde.end) return "tarde";
//   return "noite";
// }
// 
// export function getEffectivePeriodsForDay(
//   dayOfWeek: number,
//   openingHours: OpeningHour[],
//   barberAvailability: BarberAvailability[],
// ): { opens_at: string; closes_at: string }[] {
//   const dayRecords = barberAvailability.filter(
//     a => a.day_of_week === dayOfWeek,
//   );
//   const explicitAvailability = dayRecords
//     .filter(a => a.starts_at && a.ends_at && !a.is_day_off)
//     .sort((x, y) => x.period_order - y.period_order)
//     .map(a => ({ opens_at: a.starts_at!, closes_at: a.ends_at! }));
// 
//   if (dayRecords.length === 0) {
//     return openingHours
//       .filter(h => h.day_of_week === dayOfWeek && h.is_open)
//       .map(h => ({ opens_at: h.opens_at, closes_at: h.closes_at }));
//   }
// 
//   if (dayRecords.some(a => a.is_day_off)) return [];
// 
//   if (explicitAvailability.length > 0) {
//     return explicitAvailability;
//   }
// 
//   return openingHours
//     .filter(h => h.day_of_week === dayOfWeek && h.is_open)
//     .map(h => ({ opens_at: h.opens_at, closes_at: h.closes_at }));
// }
// 
// export function getAllSlotsForDay(
//   openingHours: OpeningHour[],
//   date: string,
//   duration: number,
//   barberAvailability?: BarberAvailability[],
// ): string[] {
//   const dayOfWeek = new Date(date + "T12:00:00").getDay();
//   const periods =
//     barberAvailability && barberAvailability.length > 0
//       ? getEffectivePeriodsForDay(dayOfWeek, openingHours, barberAvailability)
//       : openingHours
//           .filter(h => h.day_of_week === dayOfWeek && h.is_open)
//           .map(h => ({ opens_at: h.opens_at, closes_at: h.closes_at }));
// 
//   const all: string[] = [];
//   for (const period of periods) {
//     const openMin = timeToMinutes(period.opens_at.slice(0, 5));
//     const closeMin = timeToMinutes(period.closes_at.slice(0, 5));
//     let cur = openMin;
//     while (cur + duration <= closeMin) {
//       all.push(minutesToTime(cur));
//       cur += 30;
//     }
//   }
//   return all;
// }
