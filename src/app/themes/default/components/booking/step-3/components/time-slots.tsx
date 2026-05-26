// import { ArrowLeft, User } from "lucide-react";
// import type { BarberSlots, ServiceSelection, Slot } from "../../../../../types";
// import { getTimePeriod } from "@/utils/format-time";
// import { PERIOD_LABELS } from "../../../../../types";
// import { useStyle } from "../../../../../../contexts/style-context/style-context";
// 
// interface TimeSlotsProps {
//   viewBarber: BarberSlots;
//   slots: Slot[];
//   selection?: ServiceSelection;
//   loading: boolean;
//   onBack: () => void;
//   onTimeClick: (time: string) => void;
// }
// 
// export function TimeSlots({
//   viewBarber,
//   slots,
//   selection,
//   loading,
//   onBack,
//   onTimeClick,
// }: TimeSlotsProps) {
//   const { style } = useStyle();
//   const periods = [
//     {
//       key: "manha" as const,
//       slots: slots.filter(slot => getTimePeriod(slot.time) === "manha"),
//     },
//     {
//       key: "tarde" as const,
//       slots: slots.filter(slot => getTimePeriod(slot.time) === "tarde"),
//     },
//     {
//       key: "noite" as const,
//       slots: slots.filter(slot => getTimePeriod(slot.time) === "noite"),
//     },
//   ].filter(period => period.slots.length > 0);
// 
//   return (
//     <>
//       <div className="mb-4 flex items-center gap-2">
//         <button
//           onClick={onBack}
//           className="rounded-full p-1 text-current hover:bg-current/20"
//         >
//           <ArrowLeft size={16} />
//         </button>
//         {viewBarber.avatar_url ? (
//           <img
//             src={viewBarber.avatar_url}
//             alt={viewBarber.name}
//             className="h-7 w-7 rounded-full object-cover"
//           />
//         ) : (
//           <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100">
//             <User size={14} className="text-neutral-400" />
//           </div>
//         )}
//         <span className="text-sm font-medium">{viewBarber.name}</span>
//       </div>
// 
//       {loading ? (
//         <div className="flex justify-center py-6">
//           <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
//         </div>
//       ) : slots.length === 0 ? (
//         <p className="py-6 text-center text-sm text-current">
//           Nenhum horario disponivel neste dia.
//         </p>
//       ) : (
//         <div className="flex flex-col gap-4">
//           {periods.map(({ key, slots: periodSlots }) => (
//             <div key={key}>
//               <p className="mb-2 text-xs font-semibold tracking-wide text-current uppercase">
//                 {PERIOD_LABELS[key]}
//               </p>
//               <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
//                 {periodSlots.map(({ time, available }) => {
//                   const isSelected =
//                     selection?.barber.id === viewBarber.barber_id &&
//                     selection.time === time;
// 
//                   return (
//                     <button
//                       key={time}
//                       onClick={() => available && onTimeClick(time)}
//                       disabled={!available}
//                       className={`rounded-xl border py-2 text-sm font-medium transition-colors ${
//                         isSelected
//                           ? "border-transparent"
//                           : available
//                             ? "border-current hover:bg-current/10"
//                             : "cursor-not-allowed border-current opacity-35"
//                       }`}
//                       style={
//                         isSelected && style.primary_color
//                           ? {
//                               backgroundColor: style.primary_color,
//                               color: style.text_button_color,
//                             }
//                           : undefined
//                       }
//                     >
//                       {time}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </>
//   );
// }
