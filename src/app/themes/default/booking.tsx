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
  const { isAuthenticated, isLoading, customer } = useAuthStore();
  const { items, clearCart } = useCart();

  const [step, setStep] = useState(0);
  const [date, setDate] = useState<string | null>(null);
  const [serviceSelections, setServiceSelections] = useState<
    Record<string, ServiceSelection>
  >({});
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(`/${props.slug}/entrar?from=agendar`);
    }
  }, [isAuthenticated, isLoading, navigate, props.slug]);

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
              className="rounded-full border-current bg-transparent px-5 py-1 hover:bg-current/10 hover:text-current"
              onClick={() => navigate(`/${props.slug}/perfil`)}
            >
              Meus agendamentos
            </Button>
            <Button
              className="rounded-full px-5 py-1"
              style={{
                backgroundColor: style.primary_color,
                color: style.text_button_color,
              }}
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

  if (isLoading || !customer) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
        </main>
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
              <div
                key={label}
                className="flex w-20 flex-col items-center gap-1"
              >
                <div
                  className={`sm:text-md flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors sm:h-9 sm:w-9 ${
                    index <= step ? "" : "bg-current/15 text-current"
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

        <h1 className="mb-6 text-center text-2xl font-semibold">
          {STEPS[step]}
        </h1>

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
