// import { useEffect, useState } from "react";
// import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import { supabase } from "@/app/lib/supabase";
// import { useAuthStore } from "@/app/store/auth-store";
// import { useBarbershop } from "../hooks/use-barbershop";
// import { Button } from "../components/ui/button";
// import { FaGoogle } from "react-icons/fa";

// export function AuthPage() {
//   const navigate = useNavigate();
//   const { setCustomer, setLoading, isLoading } = useAuthStore();
//   const { slug } = useParams<{ slug: string }>();
//   const [searchParams] = useSearchParams();
//   const { data } = useBarbershop(slug ?? "");
//   const [phone, setPhone] = useState("");

//   const from = searchParams.get("from");

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       if (session) {
//         navigate(`/${slug}`, { replace: true });
//       }
//     });
//   }, [slug, navigate]);

//   useEffect(() => {
//     const { data: listener } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         if (event !== "SIGNED_IN" || !session?.user) return;

//         setLoading(true);
//         try {
//           const barbershopId = localStorage.getItem("auth_barbershop_id");

//           const { data: existing } = await supabase
//             .from("customers")
//             .select("id")
//             .eq("auth_user_id", session.user.id)
//             .eq("barbershop_id", barbershopId ?? "")
//             .single();

//           if (!existing && barbershopId) {
//             const { data: newCustomer } = await supabase
//               .from("customers")
//               .insert({
//                 auth_user_id: session.user.id,
//                 barbershop_id: barbershopId,
//                 name:
//                   session.user.user_metadata?.full_name ??
//                   session.user.user_metadata?.name ??
//                   "",
//                 email: session.user.email ?? "",
//                 phone: "",
//               })
//               .select()
//               .single();

//             if (newCustomer) {
//               setCustomer({
//                 id: newCustomer.id,
//                 name: newCustomer.name,
//                 phone: newCustomer.phone,
//                 email: newCustomer.email,
//                 auth_user_id: newCustomer.auth_user_id,
//                 barbershop_id: newCustomer.barbershop_id,
//               });
//             }
//           } else if (existing) {
//             const { data: customer } = await supabase
//               .from("customers")
//               .select("*")
//               .eq("id", existing.id)
//               .single();

//             if (customer) {
//               setCustomer({
//                 id: customer.id,
//                 name: customer.name,
//                 phone: customer.phone,
//                 email: customer.email,
//                 auth_user_id: customer.auth_user_id,
//                 barbershop_id: customer.barbershop_id,
//               });
//             }
//           }

//           localStorage.removeItem("auth_barbershop_id");
//           localStorage.removeItem("auth_redirect");

//           const destination =
//             from === "agendar" ? `/${slug}/agendar` : `/${slug}`;
//           navigate(destination, { replace: true });
//         } finally {
//           setLoading(false);
//         }
//       },
//     );

//     return () => listener.subscription.unsubscribe();
//   }, [slug, navigate, setCustomer, setLoading, from]);

//   function formatPhone(value: string) {
//     const digits = value.replace(/\D/g, "").slice(0, 11);
//     if (digits.length <= 2) return `(${digits}`;
//     if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
//     return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
//   }

//   async function handlePhoneLogin() {
//     // TODO: implementar login por celular
//   }

//   async function handleOAuth() {
//     localStorage.setItem("auth_redirect", `/${slug}`);
//     localStorage.setItem("auth_from", from ?? ""); // ← adiciona isso
//     if (data?.id) {
//       localStorage.setItem("auth_barbershop_id", data.id);
//     }

//     await supabase.auth.signInWithOAuth({
//       provider: "google",
//       options: {
//         redirectTo: `${window.location.origin}/auth/callback`,
//       },
//     });
//   }

//   return (
//     <div className="flex min-h-screen w-screen flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-950">
//       <header className="fixed top-0 z-50 w-screen border-b border-neutral-200 bg-white/90 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/90">
//         <a
//           href={`/${slug}`}
//           className="mx-auto flex h-14 items-center justify-between px-6"
//         >
//           <img
//             src="/logo-light.png"
//             alt="logo"
//             className="h-8 w-auto object-contain dark:hidden"
//           />
//           <img
//             src="/logo-dark.png"
//             alt="logo"
//             className="hidden h-8 w-auto object-contain dark:block"
//           />
//         </a>
//       </header>
//       {data?.name && <h2 className="mb-4 text-3xl font-medium">{data.name}</h2>}
//       <div className="mx-auto w-[90vw] max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
//         <div className="mb-8 text-center">
//           <h1 className="text-2xl font-semibold tracking-tight">Entrar</h1>
//           <p className="mt-1 text-sm text-neutral-500">
//             Para agendar, faça login com sua conta
//           </p>
//         </div>

//         <div className="flex flex-col gap-3">
//           <div className="flex flex-col gap-1.5">
//             <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
//               Celular
//             </label>
//             <input
//               type="tel"
//               inputMode="numeric"
//               placeholder="(00) 00000-0000"
//               value={phone}
//               onChange={e => setPhone(formatPhone(e.target.value))}
//               className="h-11 w-full rounded-xl border border-neutral-200 bg-transparent px-4 text-sm ring-offset-2 transition-colors outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:focus:ring-neutral-100"
//             />
//           </div>
//           <Button
//             className="h-11 w-full rounded-xl"
//             onClick={handlePhoneLogin}
//             disabled={isLoading || phone.replace(/\D/g, "").length < 10}
//           >
//             Entrar
//           </Button>
//         </div>

//         <div className="mt-6 flex items-center gap-3">
//           <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
//           <span className="text-xs text-neutral-400">OU</span>
//           <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
//         </div>

//         <div className="mt-3 flex flex-col gap-3">
//           <Button
//             variant="outline"
//             className="h-11 w-full cursor-pointer gap-3 rounded-xl"
//             onClick={handleOAuth}
//             disabled={isLoading}
//           >
//             <FaGoogle size={16} />
//             Continuar com Google
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
