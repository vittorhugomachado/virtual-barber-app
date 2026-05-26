// export function PostMainSkeleton() {
//   return (
//     <main>
//       {/* Breadcrumb */}
//       <nav className="flex w-full items-center gap-2 bg-[#050419] px-3 pt-8 md:px-8">
//         <div className="h-4 w-12 animate-pulse rounded bg-neutral-700" />
//         <div className="h-3 w-3 animate-pulse rounded bg-neutral-700" />
//         <div className="h-4 w-20 animate-pulse rounded bg-neutral-700" />
//       </nav>
// 
//       {/* Hero */}
//       <section className="w-full bg-[#050419]">
//         <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pt-6 pb-12 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-8 lg:py-20">
//           {/* Texto */}
//           <div className="flex flex-1 flex-col gap-6">
//             {/* Badge categoria */}
//             <div className="h-6 w-24 animate-pulse rounded-sm bg-neutral-700" />
// 
//             {/* Título */}
//             <div className="flex flex-col gap-3">
//               <div className="h-8 w-full animate-pulse rounded bg-neutral-700 sm:h-10 lg:h-12" />
//               <div className="h-8 w-4/5 animate-pulse rounded bg-neutral-700 sm:h-10 lg:h-12" />
//               <div className="h-8 w-3/5 animate-pulse rounded bg-neutral-700 sm:h-10 lg:h-12" />
//             </div>
// 
//             {/* Excerpt */}
//             <div className="flex flex-col gap-2">
//               <div className="h-5 w-full animate-pulse rounded bg-neutral-700" />
//               <div className="h-5 w-full animate-pulse rounded bg-neutral-700" />
//               <div className="h-5 w-2/3 animate-pulse rounded bg-neutral-700" />
//             </div>
// 
//             {/* Data */}
//             <div className="h-4 w-32 animate-pulse rounded bg-neutral-700" />
//           </div>
// 
//           {/* Imagem */}
//           <div className="w-full lg:w-120 lg:shrink-0">
//             <div className="h-64 w-full animate-pulse rounded-xl bg-neutral-700 sm:h-80 lg:h-90" />
//           </div>
//         </div>
//       </section>
// 
//       {/* Conteúdo */}
//       <section className="w-full bg-neutral-100">
//         <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
//           <div className="flex flex-col gap-3">
//             {Array.from({ length: 12 }).map((_, i) => (
//               <div
//                 key={i}
//                 className="h-4 animate-pulse rounded bg-neutral-300"
//                 style={{ width: i % 4 === 3 ? "60%" : "100%" }}
//               />
//             ))}
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }
