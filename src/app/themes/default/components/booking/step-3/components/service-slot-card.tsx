// import { useMemo, useState } from "react";
// import { ChevronDown, ChevronUp, Check, Scissors } from "lucide-react";
// import type { BarberSlots, ServiceSlotCardProps } from "../../../../../types";
// import { formatDuration } from "@/utils/format-duration";
// import { formatPrice } from "@/utils/format-price";
// import { BarberGrid } from "./barber-grid";
// import { TimeSlots } from "./time-slots";
// import { addMinutes, timeToMinutes } from "@/utils/format-time";
// 
// export function ServiceSlotCard({
//   service,
//   selection,
//   otherSelections,
//   loading,
//   onSelect,
//   autoOpen,
// }: ServiceSlotCardProps) {
//   const [open, setOpen] = useState(autoOpen ?? false);
//   const [viewBarber, setViewBarber] = useState<BarberSlots | null>(null);
// 
//   const isComplete = !!selection;
//   const duration = service?.duration_min ?? 30;
// 
//   function handleToggle() {
//     if (!open && selection) {
//       const selectedBarber = service?.barbers.find(
//         barber => barber.barber_id === selection.barber.id,
//       );
//       setViewBarber(selectedBarber ?? null);
//     }
//     setOpen(current => !current);
//   }
// 
//   function handleTimeClick(time: string) {
//     if (!viewBarber) return;
//     onSelect({
//       barber: {
//         id: viewBarber.barber_id,
//         name: viewBarber.name,
//         avatar_url: viewBarber.avatar_url,
//       },
//       time,
//     });
//     setOpen(false);
//     setViewBarber(null);
//   }
// 
//   const filteredSlots = useMemo(() => {
//     if (!viewBarber) return [];
// 
//     return viewBarber.slots.map(slot => {
//       const start = timeToMinutes(slot.time);
//       const end = start + duration;
// 
//       const hasLocalConflict = otherSelections.some(other => {
//         const otherStart = timeToMinutes(other.time);
//         const otherEnd = otherStart + other.duration;
//         return start < otherEnd && end > otherStart;
//       });
// 
//       return {
//         ...slot,
//         available: slot.available && !hasLocalConflict,
//       };
//     });
//   }, [duration, otherSelections, viewBarber]);
// 
//   if (!service) return null;
// 
//   return (
//     <div className="overflow-hidden rounded-2xl border border-current/15">
//       <button
//         onClick={handleToggle}
//         className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-current/10"
//       >
//         <div className="flex items-center gap-3">
//           {service.image_url ? (
//             <img
//               src={service.image_url}
//               alt={service.service_name}
//               className="h-10 w-10 shrink-0 rounded-lg object-cover"
//             />
//           ) : (
//             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-current/15">
//               <Scissors size={14} className="text-current" />
//             </div>
//           )}
//           <div className="flex flex-col gap-0.5">
//             <span className="text-sm font-medium">{service.service_name}</span>
//             {isComplete ? (
//               <span className="text-xs text-current">
//                 {selection.barber.name} | {selection.time}
//                 {duration ? ` - ${addMinutes(selection.time, duration)}` : ""}
//               </span>
//             ) : (
//               <span className="text-xs text-current">
//                 {[
//                   service.duration_min != null
//                     ? formatDuration(service.duration_min)
//                     : null,
//                   service.price != null ? formatPrice(service.price) : null,
//                 ]
//                   .filter(Boolean)
//                   .join(" | ")}
//               </span>
//             )}
//           </div>
//         </div>
// 
//         <div className="flex shrink-0 items-center gap-2">
//           {isComplete ? (
//             <div
//               className="flex h-5 w-5 items-center justify-center rounded-full"
//               style={{ backgroundColor: "green", color: "white" }}
//             >
//               <Check size={10} />
//             </div>
//           ) : (
//             <span className="text-xs text-current">Selecionar</span>
//           )}
//           {open ? (
//             <ChevronUp size={16} className="text-current" />
//           ) : (
//             <ChevronDown size={16} className="text-current" />
//           )}
//         </div>
//       </button>
// 
//       {open && (
//         <div className="border-t border-current/15 px-4 pt-3 pb-4">
//           {!viewBarber ? (
//             <BarberGrid
//               barbers={service.barbers}
//               selectedBarberId={selection?.barber.id}
//               loading={loading}
//               onSelect={setViewBarber}
//             />
//           ) : (
//             <TimeSlots
//               viewBarber={viewBarber}
//               slots={filteredSlots}
//               selection={selection}
//               loading={loading}
//               onBack={() => setViewBarber(null)}
//               onTimeClick={handleTimeClick}
//             />
//           )}
//         </div>
//       )}
//     </div>
//   );
// }
