// // src/hooks/useBarbershop.ts
// 
// import { useEffect } from "react";
// import { getBarbershopBySlug } from "@/app/lib/queries";
// import { useBarbershopStore } from "@/app/store/barbershop-store";
// 
// export function useBarbershop(slug: string) {
//   const { data, isLoading, error, setData, setLoading, setError } =
//     useBarbershopStore();
// 
//   useEffect(() => {
//     if (!slug) return;
// 
//     // se já tem os dados da mesma barbearia, não rebusca
//     if (data?.slug === slug) return;
// 
//     async function fetch() {
//       setLoading(true);
//       setError(null);
// 
//       const result = await getBarbershopBySlug(slug);
// 
//       if (!result) {
//         setError("Barbearia não encontrada");
//       } else {
//         setData(result);
//       }
// 
//       setLoading(false);
//     }
// 
//     fetch();
//   }, [slug, data?.slug, setData, setLoading, setError]);
// 
//   return { data, isLoading, error };
// }
