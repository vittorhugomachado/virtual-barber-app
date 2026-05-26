// import { useEffect, useRef, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { supabase } from "@/app/lib/supabase";
// import { useAuthStore } from "@/app/store/auth-store";
// import { type BarbershopPageProps } from "../types";
// import type { Customer } from "../types";
// import { Navbar } from "./components/nav-bar";
// import { Gallery } from "./components/gallery";
// import { Team } from "./components/team";
// import { Services } from "./components/services";
// import { Location } from "./components/location";
// import { BarberShopHours } from "./components/barbershop-hours";
// import { Footer } from "../../components/footer";
// import { SectionNav } from "./components/section-nav";
// import { CartPanel } from "./components/cart-panel";
// import { ExpiredLoginLinkModal } from "./components/expired-login-link-modal";
// 
// interface ConsumeWhatsAppLoginTokenResponse {
//   success: boolean;
//   customer: Customer;
//   session?: {
//     access_token: string;
//     refresh_token: string;
//   };
//   userId?: string;
//   expiresInDays: number;
// }
// 
// export default function DefaultTheme(props: BarbershopPageProps) {
//   const navigate = useNavigate();
// 
//   const [searchParams] = useSearchParams();
//   const { isAuthenticated, setCustomer, setLoading } = useAuthStore();
//   const loginToken = searchParams.get("token");
//   const consumedTokenRef = useRef<string | null>(null);
//   const [showExpiredTokenModal, setShowExpiredTokenModal] = useState(false);
// 
//   function continueWithoutLogin() {
//     setShowExpiredTokenModal(false);
//     navigate(`/${props.slug}`, { replace: true });
//   }
// 
//   useEffect(() => {
//     if (!loginToken) return;
// 
//     if (isAuthenticated) {
//       navigate(`/${props.slug}`, { replace: true });
//       return;
//     }
// 
//     if (consumedTokenRef.current === loginToken) return;
// 
//     consumedTokenRef.current = loginToken;
// 
//     setLoading(true);
// 
//     supabase.functions
//       .invoke<ConsumeWhatsAppLoginTokenResponse>(
//         "consume-whatsapp-login-token",
//         {
//           body: { token: loginToken },
//         },
//       )
//       .then(async ({ data, error }) => {
//         // ← Adicione "async"
//         if (error || !data?.success || !data.customer) {
//           console.error("Nao foi possivel consumir token WhatsApp", error);
//           setShowExpiredTokenModal(true);
//           return;
//         }
// 
//         // 🔑 CRIA A SESSÃO COM OS TOKENS RECEBIDOS
//         if (data.session?.access_token && data.session?.refresh_token) {
//           const { error: sessionError } = await supabase.auth.setSession({
//             access_token: data.session.access_token,
//             refresh_token: data.session.refresh_token,
//           });
// 
//           if (sessionError) {
//             console.error("Erro ao criar sessão:", sessionError);
//             setShowExpiredTokenModal(true);
//             return;
//           }
//         }
// 
//         setCustomer(data.customer);
//         navigate(`/${props.slug}`, { replace: true });
//       })
//       .catch(error => {
//         console.error("Erro na requisição:", error);
//         setShowExpiredTokenModal(true);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, [
//     isAuthenticated,
//     loginToken,
//     navigate,
//     props.slug,
//     setCustomer,
//     setLoading,
//   ]);
// 
//   const activeBarber =
//     props.barbers?.filter(barber => barber.is_active === true) || [];
// 
//   const hasMultipleBarbers = activeBarber.length > 1;
// 
//   const sections = [
//     { id: "servicos", label: "Serviços" },
//     ...(hasMultipleBarbers ? [{ id: "equipe", label: "Equipe" }] : []),
//     { id: "horarios", label: "Horários" },
//     { id: "localizacao", label: "Localização" },
//   ];
// 
//   return (
//     <div className="relative min-h-screen text-(--store-text)">
//       <Navbar />
//       <SectionNav sections={sections} />
//       <main className="mx-auto max-w-6xl px-4 pt-14 pb-10">
//         <Gallery />
//         <section
//           id="servicos"
//           className="mt-8 flex flex-col gap-6 lg:mt-16 lg:flex-row lg:items-start"
//         >
//           <Services />
//           <CartPanel />
//         </section>
//         {hasMultipleBarbers && <Team />}
//         <BarberShopHours />
//         <Location />
//       </main>
//       <Footer />
//       <ExpiredLoginLinkModal
//         open={showExpiredTokenModal}
//         onContinueWithoutLogin={continueWithoutLogin}
//         onEnter={() => navigate(`/${props.slug}/entrar`, { replace: true })}
//       />
//     </div>
//   );
// }
