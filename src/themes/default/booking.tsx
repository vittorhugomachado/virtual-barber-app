import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useAuthStore } from "../../store/auth-store";
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
  const { primaryColor, textButtonColor } = useStyle();
  const { isAuthenticated, customer } = useAuthStore();
  const { items, clearCart } = useCart();

  const [step, setStep] = useState(0);
  const [date, setDate] = useState<string | null>(null);
  const [serviceSelections, setServiceSelections] = useState<
    Record<string, ServiceSelection>
  >({});
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate(`/${props.slug}/entrar?from=agendar`);
  }, [isAuthenticated, props.slug, navigate]);

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
    if (step === 0) return;
    setStep(current => current - 1);
  }

  const allSelected =
    items.length > 0 && items.every(s => !!serviceSelections[s.id]);

  if (done) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar isPreview={false} />
        <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-20">
          <CheckCircle size={56} style={{ color: primaryColor }} />
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Agendamento confirmado!</h1>
            <p className="mt-2 text-sm text-neutral-500">
              Seu horário foi reservado com sucesso.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant="outline"
              className="rounded-full px-5 py-1"
              onClick={() => navigate(`/${props.slug}/perfil`)}
            >
              Meus agendamentos
            </Button>
            <Button
              className="rounded-full px-5 py-1"
              style={{ backgroundColor: primaryColor, color: textButtonColor }}
              onClick={() => navigate(`/${props.slug}`)}
            >
              Voltar à loja
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar isPreview={false} />

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-8">
        <h2 className="mb-8 text-center text-3xl font-bold">Agendar</h2>

        {/* Progress */}
        <div className="relative mx-auto mb-8 max-w-86 md:max-w-126">
          <div className="mb-3 flex items-center justify-between">
            {STEPS.map((label, i) => (
              <div
                key={label}
                className="flex w-20 flex-col items-center gap-1"
              >
                <div
                  className={`sm:text-md flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors sm:h-9 sm:w-9 ${
                    i <= step
                      ? ""
                      : "bg-neutral-100 text-neutral-400 dark:bg-neutral-800"
                  }`}
                  style={
                    i <= step
                      ? {
                          backgroundColor: primaryColor,
                          color: textButtonColor,
                        }
                      : undefined
                  }
                >
                  {i < step ? "✓" : i + 1}
                </div>
                <span
                  className={`hidden text-[13px] sm:block ${
                    i === step ? "font-medium" : "text-neutral-400"
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
              className="inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              <ArrowLeft size={16} />
              Voltar
            </button>
          </div>
        )}

        {/* Step title */}
        <h1 className="mb-6 text-center text-2xl font-semibold">
          {STEPS[step]}
        </h1>

        {/* Steps */}
        {step === 0 && (
          <StepServices
            services={props.services}
            onContinue={() => setStep(1)}
          />
        )}

        {step === 1 && (
          <StepDate
            selected={date}
            openingHours={props.openingHours}
            onSelect={handleDateSelect}
            onContinue={() => setStep(2)}
          />
        )}

        {step === 2 && date && customer && (
          <StepBarberTime
            services={items}
            barbers={props.barbers}
            barbershopId={props.id}
            customerId={customer.id}
            date={date}
            openingHours={props.openingHours}
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
