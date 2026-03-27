import { useState } from "react";
import { User, Calendar, Clock, Scissors } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { supabase } from "../../../../../lib/supabase";
import {
  createAppointments,
  getAppointmentErrorMessage,
} from "../../../../../lib/booking-queries";
import { useAuthStore } from "../../../../../store/auth-store";
import type { Service } from "../../../../types";
import type { ServiceSelection } from "../../../../types";
import { formatPrice } from "../../../../../utils/format-price";
import { formatDuration } from "../../../../../utils/format-duration";
import { addMinutes, formatDate } from "../../../../../utils/format-time";

interface StepConfirmProps {
  barbershopId: string;
  customerId: string;
  services: Service[];
  date: string;
  serviceSelections: Record<string, ServiceSelection>;
  primaryColor?: string;
  textButtonColor?: string;
  onSuccess: () => void;
  onBack: () => void;
}

export function StepConfirm({
  barbershopId,
  customerId,
  services,
  date,
  serviceSelections,
  primaryColor,
  textButtonColor,
  onSuccess,
  onBack,
}: StepConfirmProps) {
  const { customer, setCustomer } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState(customer?.name?.trim() ?? "");

  const total = services.reduce((sum, s) => sum + (s.price ?? 0), 0);
  const normalizedStoredName = customer?.name?.trim() ?? "";
  const requiresName = normalizedStoredName.length < 2;
  const hasNameValidationError =
    requiresName && error === "Informe como podemos te chamar.";

  function hasValidName(value: string) {
    return value.trim().length >= 2;
  }

  async function handleConfirm() {
    setLoading(true);
    setError(null);
    try {
      const normalizedDisplayName = displayName.trim();

      if (requiresName && !hasValidName(normalizedDisplayName)) {
        setError("Informe um nome com pelo menos 2 letras.");
        return;
      }

      if (requiresName) {
        const { error: customerError } = await supabase
          .from("customers_auth")
          .update({ name: normalizedDisplayName })
          .eq("id", customerId);

        if (customerError) {
          setError("Não foi possível salvar seu nome. Tente novamente.");
          return;
        }

        if (customer) {
          setCustomer({ ...customer, name: normalizedDisplayName });
        }
      }

      const appointments = services.map(service => {
        const sel = serviceSelections[service.id];
        const duration = service.duration_min ?? 30;
        const starts = `${date}T${sel.time}:00`;
        const ends = `${date}T${addMinutes(sel.time, duration)}:00`;
        return {
          barbershop_id: barbershopId,
          barber_id: sel.barber.id,
          service_id: service.id,
          customer_id: customerId,
          starts_at: starts,
          ends_at: ends,
        };
      });

      const { error: err } = await createAppointments(appointments);
      if (err) {
        console.error("Erro ao confirmar agendamento", {
          message: err.message,
          details: err.details,
          hint: err.hint,
          code: err.code,
          appointments,
        });
        setError(getAppointmentErrorMessage(err));
        return;
      }

      onSuccess();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
        {requiresName && (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Como podemos te chamar?
              </label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Digite seu nome"
                className={`h-11 w-full rounded-xl bg-transparent px-4 text-sm ring-offset-2 transition-colors outline-none placeholder:text-neutral-400 focus:ring-2 ${
                  hasNameValidationError
                    ? "border border-red-500 focus:ring-red-500 dark:border-red-500"
                    : "border border-neutral-200 focus:ring-neutral-900 dark:border-neutral-700 dark:focus:ring-neutral-100"
                }`}
              />
              <p className="text-xs text-neutral-500">
                Precisamos de um nome para confirmar o agendamento.
              </p>
            </div>
            <div className="border-t border-neutral-100 dark:border-neutral-800" />
          </>
        )}

        {/* Date */}
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-neutral-400" />
          <div>
            <p className="text-xs text-neutral-400">Data</p>
            <p className="text-sm font-medium">{formatDate(date)}</p>
          </div>
        </div>

        <div className="border-t border-neutral-100 dark:border-neutral-800" />

        {/* Services with individual barber + time */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Scissors size={16} className="text-neutral-400" />
            <p className="text-xs text-neutral-400">Serviços</p>
          </div>

          {services.map((service, index) => {
            const sel = serviceSelections[service.id];
            const duration = service.duration_min ?? 30;
            const endsAt = addMinutes(sel.time, duration);
            return (
              <div key={service.id}>
                {index > 0 && (
                  <div className="mb-4 border-t border-neutral-100 dark:border-neutral-800" />
                )}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">{service.name}</span>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                      {service.duration_min != null && (
                        <span>{formatDuration(service.duration_min)}</span>
                      )}
                      {service.price != null && (
                        <>
                          <span>·</span>
                          <span className="font-medium text-neutral-700 dark:text-neutral-300">
                            {formatPrice(service.price)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Barber + time for this service */}
                <div className="mt-2 flex items-center gap-4 rounded-xl bg-neutral-50 px-3 py-2 dark:bg-neutral-900">
                  <div className="flex items-center gap-2">
                    {sel.barber.avatar_url ? (
                      <img
                        src={sel.barber.avatar_url}
                        alt={sel.barber.name}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700">
                        <User size={12} className="text-neutral-400" />
                      </div>
                    )}
                    <span className="text-xs font-medium">
                      {sel.barber.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <Clock size={12} />
                    <span>
                      {sel.time} – {endsAt}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {total > 0 && (
          <>
            <div className="border-t border-neutral-100 dark:border-neutral-800" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-500">Total</span>
              <span className="text-sm font-semibold">
                {formatPrice(total)}
              </span>
            </div>
          </>
        )}
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="h-11 flex-1 rounded-full"
          onClick={onBack}
        >
          Voltar
        </Button>
        <Button
          className="h-11 flex-1 rounded-full"
          style={{ backgroundColor: primaryColor, color: textButtonColor }}
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? "Confirmando..." : "Confirmar"}
        </Button>
      </div>
    </div>
  );
}
