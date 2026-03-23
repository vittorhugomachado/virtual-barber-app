import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Scissors, User, ChevronRight } from "lucide-react";
import { useAuthStore } from "../../store/auth-store";
import { getCustomerAppointments } from "../../lib/booking-queries";
import { Navbar } from "./components/nav-bar";
import { Footer } from "../../components/footer";
import { Button } from "../../components/ui/button";
import { formatDate } from "../../utils/format-time";
import { formatPrice } from "../../utils/format-price";
import { formatDuration } from "../../utils/format-duration";
import type { BarbershopPageProps, AppointmentStatus } from "../types";

type AppointmentRow = {
  id: string;
  status: AppointmentStatus;
  starts_at: string;
  ends_at: string;
  notes?: string | null;
  created_at: string;
  barbers: { id: string; name: string; avatar_url?: string | null } | null;
  services: { id: string; name: string; price?: number | null; duration_min?: number | null } | null;
};

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  scheduled: "Agendado",
  completed: "Concluído",
  cancelled_by_customer: "Cancelado",
  cancelled_by_barbershop: "Cancelado",
  no_show: "Não compareceu",
};

const STATUS_CLASS: Record<AppointmentStatus, string> = {
  scheduled: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  completed: "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",
  cancelled_by_customer: "bg-red-50 text-red-500 dark:bg-red-950 dark:text-red-400",
  cancelled_by_barbershop: "bg-red-50 text-red-500 dark:bg-red-950 dark:text-red-400",
  no_show: "bg-orange-50 text-orange-500 dark:bg-orange-950 dark:text-orange-400",
};

export default function DefaultProfilePage(props: BarbershopPageProps) {
  const navigate = useNavigate();
  const { isAuthenticated, customer } = useAuthStore();
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [loading, setLoading] = useState(true);

  const primary = props.style.primary_color;
  const textButtonColor = props.style.text_button_color;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/${props.slug}/entrar`);
    }
  }, [isAuthenticated, props.slug, navigate]);

  useEffect(() => {
    if (!customer) return;
    getCustomerAppointments(customer.id).then(({ data }) => {
      if (data) setAppointments(data as AppointmentRow[]);
      setLoading(false);
    });
  }, [customer]);

  const upcoming = appointments.filter(a => a.status === "scheduled");
  const past = appointments.filter(a => a.status !== "scheduled");

  function formatStartTime(starts_at: string) {
    return new Date(starts_at).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatDateFromISO(starts_at: string) {
    return formatDate(starts_at.slice(0, 10));
  }

  function AppointmentCard({ appt }: { appt: AppointmentRow }) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Scissors size={14} className="mt-0.5 shrink-0 text-neutral-400" />
            <span className="text-sm font-medium">
              {appt.services?.name ?? "Serviço"}
            </span>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASS[appt.status]}`}
          >
            {STATUS_LABEL[appt.status]}
          </span>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-neutral-500">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} />
            <span>{formatDateFromISO(appt.starts_at)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={12} />
            <span>{formatStartTime(appt.starts_at)}</span>
            {appt.services?.duration_min != null && (
              <span className="text-neutral-400">
                · {formatDuration(appt.services.duration_min)}
              </span>
            )}
          </div>
          {appt.barbers && (
            <div className="flex items-center gap-1.5">
              <User size={12} />
              <span>{appt.barbers.name}</span>
            </div>
          )}
        </div>

        {appt.services?.price != null && (
          <div className="flex items-center justify-between border-t border-neutral-100 pt-2 dark:border-neutral-800">
            <span className="text-xs text-neutral-400">Valor</span>
            <span className="text-sm font-semibold">
              {formatPrice(appt.services.price)}
            </span>
          </div>
        )}
      </div>
    );
  }

  function Section({
    title,
    items,
  }: {
    title: string;
    items: AppointmentRow[];
  }) {
    if (items.length === 0) return null;
    return (
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
          {title}
        </h2>
        {items.map(a => (
          <AppointmentCard key={a.id} appt={a} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        isPreview={false}
        primaryColor={primary}
        textButtonColor={textButtonColor}
        barbershopName={props.name}
        openingHours={props.openingHours}
      />

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Meus agendamentos</h1>
          <Button
            className="rounded-full px-5 text-sm"
            style={{ backgroundColor: primary, color: textButtonColor }}
            onClick={() => navigate(`/${props.slug}/agendar`)}
          >
            Novo
            <ChevronRight size={14} />
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-800" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
              <Calendar size={24} className="text-neutral-400" />
            </div>
            <div>
              <p className="font-medium">Nenhum agendamento ainda</p>
              <p className="mt-1 text-sm text-neutral-400">
                Que tal agendar seu próximo corte?
              </p>
            </div>
            <Button
              className="mt-2 rounded-full px-6"
              style={{ backgroundColor: primary, color: textButtonColor }}
              onClick={() => navigate(`/${props.slug}/agendar`)}
            >
              Agendar agora
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <Section title="Próximos" items={upcoming} />
            <Section title="Histórico" items={past} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
