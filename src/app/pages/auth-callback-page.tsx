// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "@/app/lib/supabase";
// import { useAuthStore } from "@/app/store/auth-store";
// import type { Customer } from "@/app/themes/types";
// import { getPostAuthRedirectPath } from "@/app/lib/auth";
// 
// function getPhoneVariants(phone?: string | null) {
//   const digits = phone?.replace(/\D/g, "") ?? "";
//   if (!digits) return [];
// 
//   const normalized = digits.startsWith("55") ? digits : `55${digits}`;
//   const variants = new Set([normalized]);
// 
//   if (normalized.startsWith("55") && normalized.length === 13) {
//     variants.add(`${normalized.slice(0, 4)}${normalized.slice(5)}`);
//   }
// 
//   if (normalized.startsWith("55") && normalized.length === 12) {
//     variants.add(`${normalized.slice(0, 4)}9${normalized.slice(4)}`);
//   }
// 
//   variants.add(normalized.replace(/^55/, ""));
// 
//   return Array.from(variants);
// }
// 
// export function AuthCallbackPage() {
//   const navigate = useNavigate();
//   const { setCustomer } = useAuthStore();
//   const [customer, setLocalCustomer] = useState<Customer | null>(null);
//   const [error, setError] = useState<string | null>(null);
// 
//   useEffect(() => {
//     const meta = document.createElement("meta");
//     meta.name = "robots";
//     meta.content = "noindex, nofollow";
//     document.head.appendChild(meta);
// 
//     return () => {
//       document.head.removeChild(meta);
//     };
//   }, []);
// 
//   useEffect(() => {
//     let handled = false;
// 
//     async function handleSession(user: {
//       id: string;
//       email?: string;
//       phone?: string;
//       user_metadata?: Record<string, string>;
//     }) {
//       if (handled) return;
//       handled = true;
// 
//       const name =
//         user.user_metadata?.full_name ?? user.user_metadata?.name ?? "";
//       const phoneVariants = getPhoneVariants(user.phone);
// 
//       const existingQuery = supabase
//         .from("customers")
//         .select("id, name, phone, barbershop_id, auth")
//         .eq("auth", true)
//         .order("created_at", { ascending: false })
//         .limit(1);
// 
//       const { data: existingCustomer, error: selectError } =
//         phoneVariants.length
//           ? await existingQuery.in("phone", phoneVariants).maybeSingle()
//           : await existingQuery.maybeSingle();
// 
//       if (selectError) {
//         setError("Nao foi possivel concluir a autenticacao. Tente novamente.");
//         return;
//       }
// 
//       const normalizedPhone = phoneVariants[0] ?? null;
//       const { data: customerData, error: writeError } = existingCustomer
//         ? await supabase
//             .from("customers")
//             .update({
//               auth: true,
//               name: existingCustomer.name || name,
//               phone: existingCustomer.phone ?? normalizedPhone,
//               updated_at: new Date().toISOString(),
//             })
//             .eq("id", existingCustomer.id)
//             .eq("auth", true)
//             .select("id, name, phone, barbershop_id, auth")
//             .single()
//         : await supabase
//             .from("customers")
//             .insert({
//               name,
//               phone: normalizedPhone,
//               auth: true,
//             })
//             .select("id, name, phone, barbershop_id, auth")
//             .single();
// 
//       if (writeError || !customerData) {
//         setError("Nao foi possivel concluir a autenticacao. Tente novamente.");
//         return;
//       }
// 
//       const c: Customer = {
//         id: customerData.id,
//         name: customerData.name ?? "",
//         phone: customerData.phone ?? "",
//         barbershop_id: customerData.barbershop_id,
//         auth: customerData.auth === true,
//       };
//       setCustomer(c);
//       setLocalCustomer(c);
// 
//       const redirect = localStorage.getItem("auth_redirect") ?? "/";
//       const from = localStorage.getItem("auth_from");
//       localStorage.removeItem("auth_redirect");
//       localStorage.removeItem("auth_from");
// 
//       const slug = redirect.startsWith("/") ? redirect.slice(1) : redirect;
// 
//       navigate(redirect === "/" ? "/" : getPostAuthRedirectPath(slug, from), {
//         replace: true,
//       });
//     }
// 
//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((event, session) => {
//       if (
//         (event === "SIGNED_IN" || event === "INITIAL_SESSION") &&
//         session?.user
//       ) {
//         subscription.unsubscribe();
//         handleSession(session.user);
//       }
//     });
// 
//     return () => subscription.unsubscribe();
//   }, [navigate, setCustomer]);
// 
//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center gap-4">
//       <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-800" />
//       {error ? (
//         <p className="text-sm text-red-500">{error}</p>
//       ) : customer ? (
//         <div className="text-center">
//           <p className="text-lg font-semibold">{customer.name}</p>
//           {customer.phone && (
//             <p className="text-sm text-neutral-500">{customer.phone}</p>
//           )}
//         </div>
//       ) : (
//         <p className="text-sm text-neutral-500">Autenticando...</p>
//       )}
//     </div>
//   );
// }
