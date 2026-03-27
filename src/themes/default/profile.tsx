import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Scissors,
  User,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
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
  barbers:
    | { id: string; name: string; avatar_url?: string | null }
    | { id: string; name: string; avatar_url?: string | null }[]
    | null;
  services:
    | {
        id: string;
        name: string;
        price?: number | null;
        duration_min?: number | null;
      }
    | {
        id: string;
        name: string;
        price?: number | null;
        duration_min?: number | null;
      }[]
    | null;
};

type NormalizedAppointment = {
  id: string;
  status: AppointmentStatus;
  starts_at: string;
  ends_at: string;
  notes?: string | null;
  created_at: string;
  barber: { id: string; name: string; avatar_url?: string | null } | null;
  service: {
    id: string;
    name: string;
    price?: number | null;
    duration_min?: number | null;
  } | null;
};

function normalize(raw: AppointmentRow): NormalizedAppointment {
  return {
    ...raw,
    barber: Array.isArray(raw.barbers) ? (raw.barbers[0] ?? null) : raw.barbers,
    service: Array.isArray(raw.services)
      ? (raw.services[0] ?? null)
      : raw.services,
  };
}

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  scheduled: "Agendado",
  completed: "Concluído",
  cancelled_by_customer: "Cancelado",
  cancelled_by_barbershop: "Cancelado",
  no_show: "Não compareceu",
};

const STATUS_CLASS: Record<AppointmentStatus, string> = {
  scheduled: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  completed: "bg-[#299E69] text-[#09090B]",
  cancelled_by_customer:
    "bg-red-50 text-red-500 dark:bg-red-950 dark:text-red-400",
  cancelled_by_barbershop:
    "bg-red-50 text-red-500 dark:bg-red-950 dark:text-red-400",
  no_show:
    "bg-orange-50 text-orange-500 dark:bg-orange-950 dark:text-orange-400",
};

type FilterTab = "all" | "upcoming" | "past";

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "upcoming", label: "Próximos" },
];

function AppointmentCard({ appt }: { appt: NormalizedAppointment }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Scissors size={14} className="mt-0.5 shrink-0 text-neutral-400" />
          <span className="text-sm font-medium">
            {appt.service?.name ?? "Serviço"}
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
          <Clock size={12} />
          <span>{appt.starts_at.slice(11, 16)}</span>
          {appt.service?.duration_min != null && (
            <span className="text-neutral-400">
              · {formatDuration(appt.service.duration_min)}
            </span>
          )}
        </div>
        {appt.barber && (
          <div className="flex items-center gap-1.5">
            <User size={12} />
            <span>{appt.barber.name}</span>
          </div>
        )}
      </div>

      {appt.service?.price != null && (
        <div className="flex items-center justify-between border-t border-neutral-100 pt-2 dark:border-neutral-800">
          <span className="text-xs text-neutral-400">Valor</span>
          <span className="text-sm font-semibold">
            {formatPrice(appt.service.price)}
          </span>
        </div>
      )}
    </div>
  );
}

export default function DefaultProfilePage(props: BarbershopPageProps) {
  const navigate = useNavigate();
  const { isAuthenticated, customer } = useAuthStore();
  const [appointments, setAppointments] = useState<NormalizedAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [ascending, setAscending] = useState(false);

  const primary = props.style.primary_color;
  const textButtonColor = props.style.text_button_color;

  useEffect(() => {
    if (!isAuthenticated) navigate(`/${props.slug}/entrar`);
  }, [isAuthenticated, props.slug, navigate]);

  useEffect(() => {
    if (!customer) return;
    getCustomerAppointments(customer.id, props.id).then(({ data }) => {
      if (data) setAppointments((data as AppointmentRow[]).map(normalize));
      setLoading(false);
    });
  }, [customer, props.id]);

  const filtered = useMemo(() => {
    let list = appointments;
    if (filter === "upcoming")
      list = list.filter(a => a.status === "scheduled");
    if (filter === "past") list = list.filter(a => a.status !== "scheduled");
    return [...list].sort((a, b) => {
      const cmp = a.starts_at.localeCompare(b.starts_at);
      return ascending ? cmp : -cmp;
    });
  }, [appointments, filter, ascending]);

  // Group by date string "YYYY-MM-DD"
  const groups = useMemo(() => {
    const map = new Map<string, NormalizedAppointment[]>();
    for (const appt of filtered) {
      const day = appt.starts_at.slice(0, 10);
      if (!map.has(day)) map.set(day, []);
      map.get(day)!.push(appt);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-nowrap">Meus agendamentos</h1>
          <Button
            className="mx-auto rounded-full px-5 text-sm sm:mr-0 sm:ml-auto"
            style={{ backgroundColor: primary, color: textButtonColor }}
            onClick={() => navigate(`/${props.slug}/agendar`)}
          >
            Novo agendamento
            <ChevronRight size={14} />
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
          <div className="flex gap-1.5">
            {FILTER_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  filter === tab.key
                    ? "text-white"
                    : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                }`}
                style={
                  filter === tab.key
                    ? { backgroundColor: primary, color: textButtonColor }
                    : undefined
                }
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setAscending(v => !v)}
            className="flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-500 transition-colors hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-800"
          >
            <ArrowUpDown size={12} />
            {ascending ? "Mais antigos" : "Mais recentes"}
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-800" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
              <Calendar size={24} className="text-neutral-400" />
            </div>
            {appointments.length === 0 ? (
              <>
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
              </>
            ) : (
              <p className="text-sm text-neutral-400">
                Nenhum agendamento neste filtro.
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col">
            {groups.map(([day, appts], groupIdx) => (
              <div key={day} className="flex gap-2">
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div
                    className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: primary + "20", color: primary }}
                  >
                    <Calendar size={14} />
                  </div>
                  {groupIdx < groups.length - 1 && (
                    <div className="mt-1 w-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col gap-2 pt-1.5 pb-4.5">
                  <p className="mt-1 text-sm font-semibold">
                    {formatDate(day)}
                  </p>
                  {appts.map(appt => (
                    <AppointmentCard key={appt.id} appt={appt} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
