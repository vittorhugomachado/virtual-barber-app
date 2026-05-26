// import { Clock } from "lucide-react";
// import { formatTime } from "@/utils/format-time";
// import { DAYS_FULL } from "../../types";
// import { groupByDay } from "@/utils/group-bay-day";
// import { useBarbershopData } from "../../../contexts/barbershop-data/barbershop-data-context";
// import { darkenColor } from "@/utils/darken-color";
// import { useStyle } from "@/app/contexts/style-context/style-context";
// 
// export function BarberShopHours() {
//   const { style } = useStyle();
//   const { openingHours } = useBarbershopData();
//   const byDay = groupByDay(openingHours);
//   const today = new Date().getDay();
// 
//   return (
//     <section id="horarios" className="mt-18 flex flex-col items-center">
//       <div className="mb-4 flex items-center gap-2">
//         <Clock size={18} />
//         <h2 className="text-2xl font-medium md:text-4xl">Horários</h2>
//       </div>
// 
//       <div className="w-full max-w-156 divide-y divide-current/10 overflow-hidden rounded-xl border border-current/10">
//         {Array.from({ length: 7 }, (_, i) => {
//           const periods = byDay[i];
//           const isToday = i === today;
//           const hasPeriods = periods?.some(p => p.is_open);
// 
//           return (
//             <div
//               key={i}
//               className={`flex items-center justify-between px-4 py-3 ${isToday ? "" : ""}`}
//               style={{
//                 backgroundColor: isToday
//                   ? darkenColor(style.background_color, 0.15)
//                   : "transparent",
//               }}
//             >
//               <div className="flex items-center gap-2">
//                 <span
//                   className={`h-2 w-2 rounded-full ${hasPeriods ? "bg-green-500" : "bg-red-500"}`}
//                 />
//                 <span
//                   className={`text-sm ${isToday ? "font-semibold" : "font-light text-current"}`}
//                 >
//                   {DAYS_FULL[i]}
//                   {isToday && (
//                     <span className="ml-2 text-xs font-normal">hoje</span>
//                   )}
//                 </span>
//               </div>
// 
//               <div className="flex flex-col items-end gap-0.5">
//                 {hasPeriods ? (
//                   periods
//                     .filter(p => p.is_open)
//                     .sort((a, b) => a.period_order - b.period_order)
//                     .map(p => (
//                       <span
//                         key={p.id}
//                         className="text-sm whitespace-nowrap text-current/60"
//                       >
//                         {formatTime(p.opens_at)} – {formatTime(p.closes_at)}
//                       </span>
//                     ))
//                 ) : (
//                   <span className="text-sm text-current/20">Fechado</span>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </section>
//   );
// }
