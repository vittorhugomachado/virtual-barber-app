import { useState } from "react";
import { User, Calendar, Clock, Scissors } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { createAppointments } from "../../../../lib/booking-queries";
import type { Service } from "../../../types";
import type { ServiceSelection } from "./step-barber-time";
import { formatPrice } from "../../../../utils/format-price";
import { formatDuration } from "../../../../utils/format-duration";

const DAYS_FULL = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const MONTHS_SHORT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return `${DAYS_FULL[d.getDay()]}, ${d.getDate()} de ${MONTHS_SHORT[d.getMonth()]}`;
}

function addMinutes(time: string, minutes: number) {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  return `${Math.floor(total / 60).toString().padStart(2, "0")}:${(total % 60).toString().padStart(2, "0")}`;
}

interface StepConfirmProps {
  barbershopId: string;
  customerId: string;
  services: Service[];
  date: string;
  serviceSelections: Record<string, ServiceSelection>;
  primaryColor?: string;
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
  onSuccess,
  onBack,
}: StepConfirmProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = services.reduce((sum, s) => sum + (s.price ?? 0), 0);

  async function handleConfirm() {
    setLoading(true);
    setError(null);

    const appointments = services.map(service => {
      const sel = serviceSelections[service.id];
      const duration = service.duration_min ?? 30;
      const starts = new Date(`${date}T${sel.time}:00`).toISOString();
      const ends = new Date(`${date}T${addMinutes(sel.time, duration)}:00`).toISOString();
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
      setError("Erro ao confirmar agendamento. Tente novamente.");
      setLoading(false);
      return;
    }

    setLoading(false);
    onSuccess();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
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
                    <span className="text-xs font-medium">{sel.barber.name}</span>
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
              <span className="text-sm font-semibold">{formatPrice(total)}</span>
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
        <Button variant="outline" className="h-11 flex-1 rounded-full" onClick={onBack}>
          Voltar
        </Button>
        <Button
          className="h-11 flex-1 rounded-full text-white"
          style={primaryColor ? { backgroundColor: primaryColor } : undefined}
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? "Confirmando..." : "Confirmar"}
        </Button>
      </div>
    </div>
  );
}
