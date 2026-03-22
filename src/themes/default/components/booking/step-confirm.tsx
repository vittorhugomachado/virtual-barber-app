import { useState } from "react";
import { User, Calendar, Clock, Scissors } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { createAppointments } from "../../../../lib/booking-queries";
import type { Barber, Service } from "../../../types";
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
  barber: Barber;
  date: string;
  time: string;
  primaryColor?: string;
  onSuccess: () => void;
  onBack: () => void;
}

export function StepConfirm({
  barbershopId,
  customerId,
  services,
  barber,
  date,
  time,
  primaryColor,
  onSuccess,
  onBack,
}: StepConfirmProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = services.reduce((sum, s) => sum + (s.price ?? 0), 0);
  const totalDuration = services.reduce((sum, s) => sum + (s.duration_min ?? 0), 0);
  const endsAt = addMinutes(time, totalDuration);

  async function handleConfirm() {
    setLoading(true);
    setError(null);

    let currentTime = time;
    const appointments = services.map(service => {
      const starts = `${date}T${currentTime}:00`;
      const duration = service.duration_min ?? 30;
      currentTime = addMinutes(currentTime, duration);
      const ends = `${date}T${currentTime}:00`;
      return {
        barbershop_id: barbershopId,
        barber_id: barber.id,
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
        {/* Barber */}
        <div className="flex items-center gap-3">
          {barber.avatar_url ? (
            <img src={barber.avatar_url} alt={barber.name} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
              <User size={18} className="text-neutral-400" />
            </div>
          )}
          <div>
            <p className="text-xs text-neutral-400">Profissional</p>
            <p className="text-sm font-medium">{barber.name}</p>
          </div>
        </div>

        <div className="border-t border-neutral-100 dark:border-neutral-800" />

        {/* Date + Time */}
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-neutral-400" />
            <div>
              <p className="text-xs text-neutral-400">Data</p>
              <p className="text-sm font-medium">{formatDate(date)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-neutral-400" />
            <div>
              <p className="text-xs text-neutral-400">Horário</p>
              <p className="text-sm font-medium">{time} – {endsAt}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-100 dark:border-neutral-800" />

        {/* Services */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Scissors size={16} className="text-neutral-400" />
            <p className="text-xs text-neutral-400">Serviços</p>
          </div>
          {services.map(s => (
            <div key={s.id} className="flex items-center justify-between">
              <span className="text-sm">{s.name}</span>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                {s.duration_min != null && <span>{formatDuration(s.duration_min)}</span>}
                {s.price != null && <span className="font-medium text-neutral-700 dark:text-neutral-300">{formatPrice(s.price)}</span>}
              </div>
            </div>
          ))}
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
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950">{error}</p>
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
