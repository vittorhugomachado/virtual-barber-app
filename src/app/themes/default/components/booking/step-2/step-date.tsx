// import { useState } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { Button } from "../../../../../components/ui/button";
// import { useStyle } from "../../../../../contexts/style-context/style-context";
// import { DAYS_SHORT, MONTHS_FULL } from "../../../../types";
// import { getClosedDays } from "@/utils/open-status";
// import { useBarbershopData } from "../../../../../contexts/barbershop-data/barbershop-data-context";
// 
// interface StepDateProps {
//   selected: string | null;
//   onSelect: (date: string) => void;
//   onContinue: () => void;
// }
// 
// export function StepDate({ selected, onSelect, onContinue }: StepDateProps) {
//   const { openingHours } = useBarbershopData();
//   const { style } = useStyle();
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
// 
//   const [viewYear, setViewYear] = useState(today.getFullYear());
//   const [viewMonth, setViewMonth] = useState(today.getMonth());
// 
//   const closedDays = getClosedDays(openingHours);
//   const maxDate = new Date(today);
//   maxDate.setDate(today.getDate() + 60);
// 
//   function prevMonth() {
//     if (viewMonth === 0) {
//       setViewMonth(11);
//       setViewYear(y => y - 1);
//     } else setViewMonth(m => m - 1);
//   }
// 
//   function nextMonth() {
//     if (viewMonth === 11) {
//       setViewMonth(0);
//       setViewYear(y => y + 1);
//     } else setViewMonth(m => m + 1);
//   }
// 
//   const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
//   const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
// 
//   const cells: (number | null)[] = [
//     ...Array(firstDayOfMonth).fill(null),
//     ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
//   ];
// 
//   function toDateStr(day: number) {
//     return `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
//   }
// 
//   function isDisabled(day: number) {
//     const d = new Date(viewYear, viewMonth, day);
//     d.setHours(0, 0, 0, 0);
//     return d < today || d > maxDate || closedDays.has(d.getDay());
//   }
// 
//   const isPrevDisabled =
//     viewYear < today.getFullYear() ||
//     (viewYear === today.getFullYear() && viewMonth <= today.getMonth());
// 
//   const isNextDisabled =
//     viewYear > maxDate.getFullYear() ||
//     (viewYear === maxDate.getFullYear() && viewMonth >= maxDate.getMonth());
// 
//   return (
//     <div className="flex flex-col gap-6">
//       <div className="rounded-2xl border border-current">
//         {/* Header */}
//         <div className="mb-4 flex items-center justify-between">
//           <button
//             onClick={prevMonth}
//             disabled={isPrevDisabled}
//             className="rounded-full p-1.5 text-current disabled:opacity-30"
//           >
//             <ChevronLeft size={18} />
//           </button>
//           <span className="text-sm font-semibold">
//             {MONTHS_FULL[viewMonth]} {viewYear}
//           </span>
//           <button
//             onClick={nextMonth}
//             disabled={isNextDisabled}
//             className="disabled:text-opacity-30 rounded-full p-1.5 text-current"
//           >
//             <ChevronRight size={18} />
//           </button>
//         </div>
// 
//         {/* Day headers */}
//         <div className="mb-2 grid grid-cols-7">
//           {DAYS_SHORT.map(d => (
//             <div
//               key={d}
//               className="current py-1 text-center text-xs font-medium"
//             >
//               {d}
//             </div>
//           ))}
//         </div>
// 
//         {/* Day cells */}
//         <div className="grid grid-cols-7 gap-y-1">
//           {cells.map((day, idx) => {
//             if (!day) return <div key={idx} />;
//             const dateStr = toDateStr(day);
//             const disabled = isDisabled(day);
//             const isSelected = selected === dateStr;
// 
//             return (
//               <button
//                 key={idx}
//                 onClick={() => !disabled && onSelect(dateStr)}
//                 disabled={disabled}
//                 className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors ${
//                   isSelected
//                     ? ""
//                     : disabled
//                       ? "cursor-not-allowed text-current/20"
//                       : "text-current hover:bg-current/10"
//                 }`}
//                 style={
//                   isSelected && style.primary_color
//                     ? {
//                         backgroundColor: style.primary_color,
//                         color: style.text_button_color,
//                       }
//                     : undefined
//                 }
//               >
//                 {day}
//               </button>
//             );
//           })}
//         </div>
//       </div>
// 
//       <Button
//         className="h-11 w-full rounded-full"
//         style={{
//           backgroundColor: style.primary_color,
//           color: style.text_button_color,
//         }}
//         disabled={!selected}
//         onClick={onContinue}
//       >
//         Continuar
//       </Button>
//     </div>
//   );
// }
