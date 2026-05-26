// //FUNÇÃO QUE ORGANIZA OS DIAS E PERIODOS DE ABERTURA DA BARBEARIA
// 
// import type { OpeningHour } from "@/app/themes/types";
// 
// export function groupByDay(openingHours: OpeningHour[]) {
//   const map: Record<number, OpeningHour[]> = {};
//   for (const h of openingHours) {
//     if (!map[h.day_of_week]) map[h.day_of_week] = [];
//     map[h.day_of_week].push(h);
//   }
//   return map;
// }
