import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/app/store/auth-store";
import { useCart } from "../../hooks/use-cart";
import { useStyle } from "../../contexts/style-context/style-context";
import { Navbar } from "./components/nav-bar";
import { Footer } from "../../components/footer";
import { StepServices } from "./components/booking/step-1/step-services";
import { StepDate } from "./components/booking/step-2/step-date";
import { StepConfirm } from "./components/booking/step-4/step-confirm";
import type { ServiceSelection } from "../types";
import type { BarbershopPageProps } from "../types";
import { Button } from "../../components/ui/button";
import { StepBarberTime } from "./components/booking/step-3/step-barber-time";

const STEPS = ["Serviços", "Data", "Profissional", "Confirmação"];

export default function DefaultBookingPage(props: BarbershopPageProps) {
  const navigate = useNavigate();
  const { style } = useStyle();
  const { isAuthenticated, customer } = useAuthStore();
  const { items, clearCart } = useCart();

  const [step, setStep] = useState(0);
  const [date, setDate] = useState<string | null>(null);
  const [serviceSelections, setServiceSelections] = useState<
    Record<string, ServiceSelection>
  >({});
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/${props.slug}/entrar?from=agendar`);
    }
  }, [isAuthenticated, navigate, props.slug]);

  function handleDateSelect(newDate: string) {
    if (newDate !== date) {
      setServiceSelections({});
    }

    setDate(newDate);
  }

  function handleSuccess() {
    clearCart();
    setDone(true);
  }

  function handleBack() {
    if (step === 0) {
      return;
    }

    setStep(current => current - 1);
  }

  const allSelected =
    items.length > 0 && items.every(service => !!serviceSelections[service.id]);

  if (done) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-20">
          <CheckCircle size={56} style={{ color: "green" }} />
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Agendamento confirmado!</h1>
            <p className="mt-2 text-sm text-current">
              Seu agendamento foi reservado com sucesso.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant="outline"
              className="border-current rounded-full px-5 py-1 bg-transparent hover:bg-current/10 hover:text-current"
              onClick={() => navigate(`/${props.slug}/perfil`)}
            >
              Meus agendamentos
            </Button>
            <Button
              className="rounded-full px-5 py-1"
              style={{ backgroundColor: style.primary_color, color: style.text_button_color }}
              onClick={() => navigate(`/${props.slug}`)}
            >
              Voltar a loja
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-8">
        <h2 className="mb-8 text-center text-3xl font-bold">Agendar</h2>

        <div className="relative mx-auto mb-8 max-w-86 md:max-w-126">
          <div className="mb-3 flex items-center justify-between">
            {STEPS.map((label, index) => (
              <div key={label} className="flex w-20 flex-col items-center gap-1">
                <div
                  className={`sm:text-md flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors sm:h-9 sm:w-9 ${
                    index <= step
                      ? ""
                      : "bg-current/15 text-current"
                  }`}
                  style={
                    index <= step
                      ? {
                          backgroundColor: "green",
                          color: "white",
                        }
                      : undefined
                  }
                >
                  {index < step ? <Check className="w-5" /> : index + 1}
                </div>
                <span
                  className={`hidden text-[13px] sm:block ${
                    index === step ? "font-medium" : "text-current/50"
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {step > 0 && (
          <div className="mb-4">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-sm text-current transition-colors hover:text-current/70"
            >
              <ArrowLeft size={16} />
              Voltar
            </button>
          </div>
        )}

        <h1 className="mb-6 text-center text-2xl font-semibold">{STEPS[step]}</h1>

        {step === 0 && <StepServices onContinue={() => setStep(1)} />}

        {step === 1 && (
          <StepDate
            selected={date}
            onSelect={handleDateSelect}
            onContinue={() => setStep(2)}
          />
        )}

        {step === 2 && date && customer && (
          <StepBarberTime
            customerId={customer.id}
            date={date}
            selections={serviceSelections}
            onSelectionsChange={setServiceSelections}
            onContinue={() => setStep(3)}
          />
        )}

        {step === 3 && date && allSelected && customer && (
          <StepConfirm
            barbershopId={props.id}
            customerId={customer.id}
            services={items}
            date={date}
            serviceSelections={serviceSelections}
            onSuccess={handleSuccess}
            onBack={() => setStep(2)}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { ArrowLeft, Check, CheckCircle } from "lucide-react";
// import { useAuthStore } from "@/app/store/auth-store";
// import { useCart } from "../../hooks/use-cart";
// import { useStyle } from "../../contexts/style-context/style-context";
// import { Navbar } from "./components/nav-bar";
// import { Footer } from "../../components/footer";
// import { StepServices } from "./components/booking/step-1/step-services";
// import { StepDate } from "./components/booking/step-2/step-date";
// import { StepConfirm } from "./components/booking/step-4/step-confirm";
// import type { ServiceSelection } from "../types";
// import type { BarbershopPageProps } from "../types";
// import { Button } from "../../components/ui/button";
// import { StepBarberTime } from "./components/booking/step-3/step-barber-time";

// const STEPS = ["Serviços", "Data", "Profissional", "Confirmação"];

// export default function DefaultBookingPage(props: BarbershopPageProps) {
//   const navigate = useNavigate();
//   const { style } = useStyle();
//   const { isAuthenticated, customer } = useAuthStore();
//   const { items, clearCart } = useCart();

//   const [step, setStep] = useState(0);
//   const [date, setDate] = useState<string | null>(null);
//   const [serviceSelections, setServiceSelections] = useState<
//     Record<string, ServiceSelection>
//   >({});
//   const [done, setDone] = useState(false);

//   // ==================== CONSOLE LOG DE DEBUG ====================
  
//   // 1. Dados iniciais da página
//   console.group('📋 [BookingPage] Dados Iniciais');
//   console.log('Props (slug, id):', { slug: props.slug, id: props.id });
//   console.log('Style:', { primary_color: style.primary_color, text_button_color: style.text_button_color });
//   console.log('Autenticado:', isAuthenticated);
//   console.log('Cliente:', customer);
//   console.groupEnd();

//   // 2. Carrinho e serviços
//   console.group('🛒 [BookingPage] Carrinho');
//   console.log('Itens no carrinho:', items);
//   console.log('Total de itens:', items.length);
//   console.log('Seleções de serviços:', serviceSelections);
//   const allSelected = items.length > 0 && items.every(service => !!serviceSelections[service.id]);
//   console.log('Todos selecionados:', allSelected);
//   console.groupEnd();

//   // 3. Estado do agendamento
//   console.group('📅 [BookingPage] Estado do Agendamento');
//   console.log('Step atual:', step, `(${STEPS[step]})`);
//   console.log('Data selecionada:', date);
//   console.log('Etapa concluída (done):', done);
//   console.groupEnd();

//   useEffect(() => {
//     console.log('🔐 [useEffect] Verificando autenticação...');
//     if (!isAuthenticated) {
//       console.warn('🔐 [useEffect] Usuário NÃO autenticado! Redirecionando para login...');
//       console.log('🔐 Redirect para:', `/${props.slug}/entrar?from=agendar`);
//       navigate(`/${props.slug}/entrar?from=agendar`);
//     } else {
//       console.log('✅ [useEffect] Usuário autenticado com sucesso (CUSTOMER_ID):', customer?.id);
//     }
//   }, [isAuthenticated, navigate, props.slug]);

//   function handleDateSelect(newDate: string) {
//     console.log('📆 [handleDateSelect] Data selecionada:', newDate);
//     console.log('📆 [handleDateSelect] Data anterior:', date);
    
//     if (newDate !== date) {
//       console.warn('⚠️ [handleDateSelect] Data diferente, resetando seleções de serviços');
//       setServiceSelections({});
//     }
    
//     setDate(newDate);
//   }

//   function handleSuccess() {
//     console.log('✅ [handleSuccess] Agendamento concluído com sucesso!');
//     console.log('🧹 [handleSuccess] Limpando carrinho...');
//     console.log('📊 Dados finais do agendamento:', {
//       barbershopId: props.id,
//       customerId: customer?.id,
//       services: items,
//       date: date,
//       serviceSelections: serviceSelections
//     });
//     clearCart();
//     setDone(true);
//   }

//   function handleBack() {
//     console.log('⬅️ [handleBack] Voltando do step:', step, `(${STEPS[step]})`);
//     if (step === 0) {
//       console.log('🚫 [handleBack] Já está no primeiro step, não pode voltar');
//       return;
//     }
    
//     setStep(current => {
//       const newStep = current - 1;
//       console.log('🔄 [handleBack] Step alterado:', current, '→', newStep);
//       return newStep;
//     });
//   }

//   // Monitoramento de mudanças de estado
//   useEffect(() => {
//     console.log('🔄 [useEffect] Step mudou para:', step, `(${STEPS[step] || 'N/A'})`);
//   }, [step]);

//   useEffect(() => {
//     console.log('🔄 [useEffect] Data mudou para:', date);
//   }, [date]);

//   useEffect(() => {
//     console.log('🔄 [useEffect] ServiceSelections atualizado:', serviceSelections);
//     const totalSelecionados = Object.keys(serviceSelections).length;
//     console.log('📊 Total de serviços selecionados:', totalSelecionados);
//   }, [serviceSelections]);

//   useEffect(() => {
//     console.log('🔄 [useEffect] Items do carrinho alterado:', items);
//     console.log('📊 Total de serviços no carrinho:', items.length);
//     const allSelectedNow = items.length > 0 && items.every(service => !!serviceSelections[service.id]);
//     console.log('✅ Todos serviços selecionados?', allSelectedNow);
//   }, [items, serviceSelections]);

//   // Log ao finalizar agendamento
//   if (done) {
//     console.group('🎉 [BookingPage] AGENDAMENTO FINALIZADO 🎉');
//     console.log('Status:', 'CONCLUÍDO');
//     console.log('Data:', date);
//     console.log('Serviços:', items);
//     console.log('Seleções:', serviceSelections);
//     console.log('Cliente:', customer);
//     console.groupEnd();
//   }

//   if (done) {
//     return (
//       <div className="flex min-h-screen flex-col">
//         <Navbar />
//         <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-20">
//           <CheckCircle size={56} style={{ color: "green" }} />
//           <div className="text-center">
//             <h1 className="text-2xl font-semibold">Agendamento confirmado!</h1>
//             <p className="mt-2 text-sm text-current">
//               Seu agendamento foi reservado com sucesso.
//             </p>
//           </div>
//           <div className="flex flex-wrap justify-center gap-3">
//             <Button
//               variant="outline"
//               className="border-current rounded-full px-5 py-1 bg-transparent hover:bg-current/10 hover:text-current"
//               onClick={() => navigate(`/${props.slug}/perfil`)}
//             >
//               Meus agendamentos
//             </Button>
//             <Button
//               className="rounded-full px-5 py-1"
//               style={{ backgroundColor: style.primary_color, color: style.text_button_color }}
//               onClick={() => navigate(`/${props.slug}`)}
//             >
//               Voltar a loja
//             </Button>
//           </div>
//         </main>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen flex-col">
//       <Navbar />

//       <main className="mx-auto w-full max-w-lg flex-1 px-4 py-8">
//         <h2 className="mb-8 text-center text-3xl font-bold">Agendar</h2>

//         <div className="relative mx-auto mb-8 max-w-86 md:max-w-126">
//           <div className="mb-3 flex items-center justify-between">
//             {STEPS.map((label, index) => (
//               <div key={label} className="flex w-20 flex-col items-center gap-1">
//                 <div
//                   className={`sm:text-md flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors sm:h-9 sm:w-9 ${
//                     index <= step
//                       ? ""
//                       : "bg-current/15 text-current"
//                   }`}
//                   style={
//                     index <= step
//                       ? {
//                           backgroundColor: "green",
//                           color: "white",
//                         }
//                       : undefined
//                   }
//                 >
//                   {index < step ? <Check className="w-5" /> : index + 1}
//                 </div>
//                 <span
//                   className={`hidden text-[13px] sm:block ${
//                     index === step ? "font-medium" : "text-current/50"
//                   }`}
//                 >
//                   {label}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {step > 0 && (
//           <div className="mb-4">
//             <button
//               type="button"
//               onClick={handleBack}
//               className="inline-flex items-center gap-2 text-sm text-current transition-colors hover:text-current/70"
//             >
//               <ArrowLeft size={16} />
//               Voltar
//             </button>
//           </div>
//         )}

//         <h1 className="mb-6 text-center text-2xl font-semibold">{STEPS[step]}</h1>

//         {step === 0 && <StepServices onContinue={() => {
//           console.log('➡️ [StepServices] Continuando para etapa 1 (Data)');
//           setStep(1);
//         }} />}

//         {step === 1 && (
//           <StepDate
//             selected={date}
//             onSelect={handleDateSelect}
//             onContinue={() => {
//               console.log('➡️ [StepDate] Continuando para etapa 2 (Profissional)');
//               setStep(2);
//             }}
//           />
//         )}

//         {step === 2 && date && customer && (
//           <StepBarberTime
//             customerId={customer.id}
//             date={date}
//             selections={serviceSelections}
//             onSelectionsChange={setServiceSelections}
//             onContinue={() => {
//               console.log('➡️ [StepBarberTime] Continuando para etapa 3 (Confirmação)');
//               setStep(3);
//             }}
//           />
//         )}

//         {step === 3 && date && allSelected && customer && (
//           <StepConfirm
//             barbershopId={props.id}
//             customerId={customer.id}
//             services={items}
//             date={date}
//             serviceSelections={serviceSelections}
//             onSuccess={handleSuccess}
//             onBack={() => {
//               console.log('⬅️ [StepConfirm] Voltando para etapa 2 (Profissional)');
//               setStep(2);
//             }}
//           />
//         )}
//       </main>

//       <Footer />
//     </div>
//   );
// }
