// import { Users } from "lucide-react";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "../../../components/ui/avatar";
// import { useBarbershopData } from "../../../contexts/barbershop-data/barbershop-data-context";
// import { useStyle } from "@/app/contexts/style-context/style-context";
// import { darkenColor } from "@/utils/darken-color";
// 
// function getInitials(name: string): string {
//   return name
//     .split(" ")
//     .slice(0, 2)
//     .map(n => n[0])
//     .join("")
//     .toUpperCase();
// }
// 
// export function Team() {
//   const { style } = useStyle();
//   const { barbers } = useBarbershopData();
// 
//   if (!barbers.length) return null;
// 
//   return (
//     <section id="equipe" className="mt-16">
//       <div className="mb-4 flex items-center justify-center gap-2">
//         <Users size={18} />
//         <h2 className="text-2xl font-medium md:text-4xl">Nossa equipe</h2>
//       </div>
// 
//       <div className="flex flex-wrap justify-center gap-6">
//         {barbers.map(barber => (
//           <div key={barber.id} className="flex flex-col items-center gap-2">
//             <Avatar className="h-16 w-16 ring-2 ring-current/20 md:h-23 md:w-23">
//               <AvatarImage
//                 src={barber.avatar_url ?? undefined}
//                 alt={barber.name}
//                 className="object-cover"
//               />
//               <AvatarFallback
//                 className="text-base font-medium"
//                 style={{
//                   backgroundColor: darkenColor(style.background_color, 0.15),
//                   color: style.text_color,
//                 }}
//               >
//                 {getInitials(barber.name)}
//               </AvatarFallback>
//             </Avatar>
//             <span className="max-w-20 text-center text-sm leading-tight font-medium">
//               {barber.name}
//             </span>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }
