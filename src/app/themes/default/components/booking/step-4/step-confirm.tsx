import { useState } from "react";
import { User, Calendar, Clock, Scissors } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { useStyle } from "../../../../../contexts/style-context/style-context";
import { getAppointmentErrorMessage } from "@/app/lib/booking-queries";
import { useAuthStore } from "@/app/store/auth-store";
import { supabase } from "@/app/lib/supabase";
import type { Service } from "../../../../types";
import type { ServiceSelection } from "../../../../types";
import { formatPrice } from "@/utils/format-price";
import { formatDuration } from "@/utils/format-duration";
import { addMinutes, formatDate, timeToMinutes } from "@/utils/format-time";
import { darkenColor } from "@/utils/darken-color";
import { localDateTimeToIso } from "@/utils/date-time";

interface StepConfirmProps {
  barbershopId: string;
  customerId: string;
  services: Service[];
  date: string;
  serviceSelections: Record<string, ServiceSelection>;
  onSuccess: () => void;
  onBack: () => void;
}

function hasSelectionConflicts(
  services: Service[],
  serviceSelections: Record<string, ServiceSelection>,
) {
  const ranges = services
    .map(service => {
      const selection = serviceSelections[service.id];

      if (!selection) {
        return null;
      }

      const start = timeToMinutes(selection.time);
      const end = start + (service.duration_min ?? 30);

      return {
        serviceName: service.name,
        start,
        end,
      };
    })
    .filter(
      (range): range is { serviceName: string; start: number; end: number } =>
        range !== null,
    )
    .sort((left, right) => left.start - right.start);

  for (let index = 1; index < ranges.length; index += 1) {
    const previous = ranges[index - 1];
    const current = ranges[index];

    if (current.start < previous.end) {
      return {
        hasConflict: true,
        services: [previous.serviceName, current.serviceName],
      };
    }
  }

  return { hasConflict: false as const };
}

export function StepConfirm({
  barbershopId,
  services,
  date,
  serviceSelections,
  onSuccess,
  onBack,
}: StepConfirmProps) {
  const { style } = useStyle();
  const { customer, setCustomer } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState(customer?.name?.trim() ?? "");

  const total = services.reduce(
    (sum, service) => sum + (service.price ?? 0),
    0,
  );
  const normalizedStoredName = customer?.name?.trim() ?? "";
  const requiresName = normalizedStoredName.length < 2;
  const nameValidationMessage = "Informe um nome com pelo menos 2 letras.";
  const hasNameValidationError =
    requiresName && error === nameValidationMessage;

  function hasValidName(value: string) {
    return value.trim().length >= 2;
  }

  async function handleConfirm() {
    setLoading(true);
    setError(null);

    try {
      const normalizedDisplayName = displayName.trim();

      if (requiresName && !hasValidName(normalizedDisplayName)) {
        setError(nameValidationMessage);
        return;
      }

      const conflictCheck = hasSelectionConflicts(services, serviceSelections);
      if (conflictCheck.hasConflict) {
        setError(
          `Os horarios escolhidos para ${conflictCheck.services.join(" e ")} se sobrepoem. Ajuste os horarios antes de confirmar.`,
        );
        return;
      }

      if (requiresName) {
        const { error: customerError } = await supabase.rpc(
          "vb_update_customer_profile",
          {
            p_name: normalizedDisplayName,
          },
        );

        if (customerError) {
          setError("Nao foi possivel salvar seu nome. Tente novamente.");
          return;
        }

        if (customer) {
          await supabase.auth.updateUser({
            data: {
              name: normalizedDisplayName,
              full_name: normalizedDisplayName,
            },
          });

          setCustomer({ ...customer, name: normalizedDisplayName });
        }
      }

      const appointments = services.map(service => {
        const selection = serviceSelections[service.id];
        const duration = service.duration_min ?? 30;
        const startsAt = new Date(localDateTimeToIso(date, selection.time));
        const endsAt = new Date(startsAt.getTime() + duration * 60 * 1000);

        return {
          barber_id: selection.barber.id,
          service_id: service.id,
          starts_at: startsAt.toISOString(),
          ends_at: endsAt.toISOString(),
        };
      });

      const { error: appointmentError } = await supabase.rpc(
        "vb_create_appointments",
        {
          p_barbershop_id: barbershopId,
          p_appointments: appointments,
        },
      );
      if (appointmentError) {
        console.error("Erro ao confirmar agendamento", {
          message: appointmentError.message,
          details: appointmentError.details,
          hint: appointmentError.hint,
          code: appointmentError.code,
          appointments,
        });
        setError(getAppointmentErrorMessage(appointmentError));
        return;
      }

      onSuccess();
    } catch (caughtError) {
      console.error("Falha inesperada ao confirmar agendamento", caughtError);
      setError("Ocorreu um erro inesperado ao confirmar o agendamento.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-current/15 p-5">
        {requiresName && (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-current">
                Como podemos te chamar?
              </label>
              <input
                type="text"
                value={displayName}
                onChange={event => setDisplayName(event.target.value)}
                placeholder="Digite seu nome"
                className={`h-11 w-full rounded-xl bg-transparent px-4 text-sm ring-offset-2 transition-colors outline-none placeholder:text-current focus:ring-2 ${
                  hasNameValidationError
                    ? "border border-red-500 focus:ring-red-500"
                    : "border border-current focus:ring-current"
                }`}
              />
              <p className="text-xs text-current">
                Precisamos de um nome para confirmar o agendamento.
              </p>
            </div>
            <div className="border-t border-current" />
          </>
        )}

        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-current" />
          <div>
            <p className="text-xs text-current">Data</p>
            <p className="text-sm font-medium">{formatDate(date)}</p>
          </div>
        </div>

        <div className="border-t border-current/15" />

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Scissors size={16} className="text-current" />
            <p className="text-xs text-current">Serviços</p>
          </div>

          {services.map((service, index) => {
            const selection = serviceSelections[service.id];
            const duration = service.duration_min ?? 30;
            const endsAt = addMinutes(selection.time, duration);

            return (
              <div key={service.id}>
                {index > 0 && (
                  <div className="mb-4 border-t border-current/15" />
                )}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">{service.name}</span>
                    <div className="flex items-center gap-1.5 text-xs text-current/80">
                      {service.duration_min != null && (
                        <span>{formatDuration(service.duration_min)}</span>
                      )}
                      {service.price != null && (
                        <>
                          <span>|</span>
                          <span className="font-medium text-current">
                            {formatPrice(service.price)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className="mt-2 flex items-center gap-4 rounded-md border border-current/15 px-3 py-2"
                  style={{
                    backgroundColor: darkenColor(style.background_color, 0.15),
                  }}
                >
                  <div className="flex items-center gap-2">
                    {selection.barber.avatar_url ? (
                      <img
                        src={selection.barber.avatar_url}
                        alt={selection.barber.name}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-current">
                        <User size={12} className="text-current" />
                      </div>
                    )}
                    <span className="text-xs font-medium">
                      {selection.barber.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-current">
                    <Clock size={12} />
                    <span>
                      {selection.time} - {endsAt}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {total > 0 && (
          <>
            <div className="border-t border-current/15" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-current">Total</span>
              <span className="text-sm font-semibold">
                {formatPrice(total)}
              </span>
            </div>
          </>
        )}
      </div>

      {error && (
        <p className="rounded-xl bg-red-500 px-4 py-3 text-sm text-white">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="h-11 flex-1 rounded-full border-current bg-transparent text-current hover:bg-current/10 hover:text-current"
          onClick={onBack}
        >
          Voltar
        </Button>
        <Button
          className="h-11 flex-1 rounded-full"
          style={{
            backgroundColor: style.primary_color,
            color: style.text_button_color,
          }}
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? "Confirmando..." : "Confirmar"}
        </Button>
      </div>
    </div>
  );
}
