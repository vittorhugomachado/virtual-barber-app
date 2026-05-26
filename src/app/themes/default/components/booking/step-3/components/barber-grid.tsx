// import { User } from "lucide-react";
// import { useStyle } from "../../../../../../contexts/style-context/style-context";
// import type { BarberSlots } from "../../../../../types";
// 
// interface BarberGridProps {
//   barbers: BarberSlots[];
//   selectedBarberId?: string;
//   loading: boolean;
//   onSelect: (barber: BarberSlots) => void;
// }
// 
// export function BarberGrid({
//   barbers,
//   selectedBarberId,
//   loading,
//   onSelect,
// }: BarberGridProps) {
//   const { style } = useStyle();
// 
//   if (loading) {
//     return (
//       <div className="flex justify-center py-6">
//         <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
//       </div>
//     );
//   }
// 
//   if (barbers.length === 0) {
//     return (
//       <p className="py-4 text-center text-sm text-current">
//         Nenhum profissional disponivel para este servico.
//       </p>
//     );
//   }
// 
//   return (
//     <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
//       {barbers.map(barber => {
//         const isSelected = selectedBarberId === barber.barber_id;
// 
//         return (
//           <button
//             key={barber.barber_id}
//             onClick={() => onSelect(barber)}
//             className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-colors ${
//               isSelected
//                 ? "border-transparent"
//                 : "border-current/15 hover:border-current/50"
//             }`}
//             style={
//               isSelected && style.primary_color
//                 ? {
//                     borderColor: style.primary_color,
//                     backgroundColor: style.primary_color + "15",
//                   }
//                 : undefined
//             }
//           >
//             {barber.avatar_url ? (
//               <img
//                 src={barber.avatar_url}
//                 alt={barber.name}
//                 className="h-12 w-12 rounded-full object-cover"
//               />
//             ) : (
//               <div className="flex h-12 w-12 items-center justify-center rounded-full bg-current/15">
//                 <User size={20} className="text-current" />
//               </div>
//             )}
//             <span className="text-center text-xs leading-tight font-medium">
//               {barber.name}
//             </span>
//           </button>
//         );
//       })}
//     </div>
//   );
// }
