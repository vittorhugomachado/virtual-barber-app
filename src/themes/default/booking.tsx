import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useAuthStore } from "../../store/auth-store";
import { useCart } from "../../hooks/use-cart";
import { Navbar } from "./components/nav-bar";
import { Footer } from "../../components/footer";
import { StepServices } from "./components/booking/step-services";
import { StepBarber } from "./components/booking/step-barber";
import { StepDate } from "./components/booking/step-date";
import { StepTime } from "./components/booking/step-time";
import { StepConfirm } from "./components/booking/step-confirm";
import type { BarbershopPageProps, Barber } from "../types";
import { Button } from "../../components/ui/button";

const STEPS = ["Serviços", "Profissional", "Data", "Horário", "Confirmação"];

export default function DefaultBookingPage(props: BarbershopPageProps) {
  const navigate = useNavigate();
  const { isAuthenticated, customer } = useAuthStore();
  const { items, clearCart } = useCart();

  const [step, setStep] = useState(0);
  const [barber, setBarber] = useState<Barber | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate(`/${props.slug}/entrar?from=agendar`);
  }, [isAuthenticated, props.slug, navigate]);

  const totalDuration = items.reduce(
    (sum, s) => sum + (s.duration_min ?? 0),
    0,
  );
  const primary = props.style.primary_color;

  function handleSuccess() {
    clearCart();
    setDone(true);
  }

  if (done) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar
          isPreview={false}
          primaryColor={primary}
          barbershopName={props.name}
          openingHours={props.openingHours}
        />
        <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-20">
          <CheckCircle size={56} style={{ color: primary }} />
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Agendamento confirmado!</h1>
            <p className="mt-2 text-sm text-neutral-500">
              Seu horário foi reservado com sucesso.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => navigate(`/${props.slug}/perfil`)}
            >
              Meus agendamentos
            </Button>
            <Button
              className="rounded-full text-white"
              style={{ backgroundColor: primary }}
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
      <Navbar
        isPreview={false}
        primaryColor={primary}
        barbershopName={props.name}
        openingHours={props.openingHours}
      />

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8">Agendar</h2>
        {/* Progress */}
        <div className="max-w-86 md:max-w-126 mb-8 relative mx-auto">
          <div className="mb-3 flex items-center justify-between">
            {STEPS.map((label, i) => (
            <>
              <div key={label} className="w-20 flex flex-col items-center gap-1">
                <div
                  className={`flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full text-xs sm:text-md font-bold transition-colors ${
                    i < step
                      ? "text-white"
                      : i === step
                        ? "text-white"
                        : "bg-neutral-100 text-neutral-400 dark:bg-neutral-800"
                  }`}
                  style={i <= step ? { backgroundColor: primary } : undefined}
                >
                  {i < step ? "✓" : i + 1}
                </div>
                <span
                  className={`hidden text-[13px] sm:block ${i === step ? "font-medium" : "text-neutral-400"}`}
                >
                  {label}
                </span>
              </div>
            </>
            ))}
          </div>
        </div>

        {/* Step title */}
        <h1 className="mb-6 text-center text-2xl font-semibold">{STEPS[step]}</h1>

        {/* Steps */}
        {step === 0 && (
          <StepServices
            services={props.services}
            primaryColor={primary}
            onContinue={() => setStep(1)}
          />
        )}

        {step === 1 && (
          <StepBarber
            barbers={props.barbers}
            selectedServices={items}
            selected={barber}
            onSelect={setBarber}
            onContinue={() => setStep(2)}
            primaryColor={primary}
          />
        )}

        {step === 2 && (
          <StepDate
            selected={date}
            openingHours={props.openingHours}
            onSelect={setDate}
            onContinue={() => setStep(3)}
            primaryColor={primary}
          />
        )}

        {step === 3 && barber && date && (
          <StepTime
            barbershopId={props.id}
            barberId={barber.id}
            date={date}
            totalDuration={totalDuration}
            openingHours={props.openingHours}
            selected={time}
            onSelect={setTime}
            onContinue={() => setStep(4)}
            primaryColor={primary}
          />
        )}

        {step === 4 && barber && date && time && customer && (
          <StepConfirm
            barbershopId={props.id}
            customerId={customer.id}
            services={items}
            barber={barber}
            date={date}
            time={time}
            primaryColor={primary}
            onSuccess={handleSuccess}
            onBack={() => setStep(3)}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
