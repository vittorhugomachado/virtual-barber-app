import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Scissors,
  User,
  ChevronRight,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useAuthStore } from "@/app/store/auth-store";
import { useStyle } from "../../contexts/style-context/style-context";
import {
  getCustomerAppointments,
  updateCustomerAppointmentStatus,
} from "@/app/lib/booking-queries";
import { Navbar } from "./components/nav-bar";
import { Footer } from "../../components/footer";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { CustomerProfileCard } from "./components/customer-profile-card";
import { formatDate } from "@/utils/format-time";
import { formatPrice } from "@/utils/format-price";
import { formatDuration } from "@/utils/format-duration";
import type { AppointmentStatus, BarbershopPageProps } from "../types";
import { darkenColor } from "@/utils/darken-color";

type AppointmentRow = {
  id: string;
  service_name: string | null;
  service_price: string | number | null;
  service_duration: number | null;
  service_duration_min: number | null;
  customer_name: string | null;
  barber_name: string | null;
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
  service_name: string | null;
  service_price: number | null;
  service_duration_min: number | null;
  barber_name: string | null;
  customer_name: string | null;
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
    service_price: raw.service_price != null ? Number(raw.service_price) : null,
    service_duration_min:
      raw.service_duration ?? raw.service_duration_min ?? null,
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
  scheduled: "bg-blue-600 text-white",
  completed:
    "bg-green-600 text-white",
  cancelled_by_customer:
    "bg-red-500 text-white",
  cancelled_by_barbershop:
    "bg-red-500 text-white",
  no_show:
    "bg-gray-400 text-black",
};

type FilterTab =
  | "all"
  | "scheduled"
  | "cancelled"
  | "no_show"
  | "completed";

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "scheduled", label: "Agendados" },
  { key: "cancelled", label: "Cancelados" },
  { key: "no_show", label: "Não compareceu" },
  { key: "completed", label: "Concluidos" },
];

const FILTER_CLASS: Record<FilterTab, string> = {
  all: "border border-current/30 bg-transparent text-current",
  scheduled: "bg-blue-600 text-white",
  cancelled: "bg-red-500 text-white",
  no_show: "bg-gray-400 text-black",
  completed: "bg-green-600 text-white",
};

function AppointmentStatusBadge({
  appt,
}: {
  appt: NormalizedAppointment;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASS[appt.status]}`}
    >
      {STATUS_LABEL[appt.status]}
    </span>
  );
}

function AppointmentCard({
  appt,
  customerId,
  barbershopId,
  onStatusChange,
}: {
  appt: NormalizedAppointment;
  customerId: string;
  barbershopId: string;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
}) {
  const serviceName = appt.service_name ?? appt.service?.name ?? "Servico";
  const durationMin =
    appt.service_duration_min ?? appt.service?.duration_min ?? null;
  const barberName = appt.barber_name ?? appt.barber?.name ?? null;
  const price = appt.service_price ?? appt.service?.price ?? null;
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  async function handleCancelAppointment() {
    setCancelLoading(true);
    setCancelError(null);

    const { error } = await updateCustomerAppointmentStatus(
      appt.id,
      customerId,
      barbershopId,
      "cancelled_by_customer",
    );

    if (error) {
      setCancelError("Nao foi possivel cancelar o agendamento.");
      setCancelLoading(false);
      return;
    }

    onStatusChange(appt.id, "cancelled_by_customer");
    setCancelLoading(false);
    setCancelDialogOpen(false);
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-current/20 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Scissors size={14} className="mt-0.5 shrink-0 text-current" />
          <span className="text-sm font-medium">{serviceName}</span>
        </div>
        <AppointmentStatusBadge appt={appt} />
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-current/80">
        <div className="flex items-center gap-1.5">
          <Clock size={12} />
          <span>{appt.starts_at.slice(11, 16)}</span>
          {durationMin != null && (
            <span className="text-current/80">
              | {formatDuration(durationMin)}
            </span>
          )}
        </div>
        {barberName && (
          <div className="flex items-center gap-1.5">
            <User size={12} />
            <span>{barberName}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-current/20 pt-2">
        <span className="text-xs text-current">Valor</span>
        <span className="text-sm font-semibold">
          {price != null ? formatPrice(price) : "A combinar"}
        </span>
      </div>

      {appt.status === "scheduled" && (
        <div className="mx-auto">
          <Button
            type="button"
            variant="outline"
            style={{backgroundColor: "red"}}
            className="w-full max-w-56 rounded-full border border-white bg-red-600 text-white hover:text-white/80"
            onClick={() => {
              setCancelError(null);
              setCancelDialogOpen(true);
            }}
          >
            Cancelar agendamento
          </Button>
        </div>
      )}

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="mx-auto w-[90vw] max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Cancelar agendamento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar este agendamento?
            </DialogDescription>
          </DialogHeader>
          {cancelError && <p className="text-sm text-red-500">{cancelError}</p>}
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setCancelDialogOpen(false)}
              disabled={cancelLoading}
            >
              Voltar
            </Button>
            <Button
              className="rounded-xl bg-rose-600 text-white hover:bg-rose-700"
              onClick={() => void handleCancelAppointment()}
              disabled={cancelLoading}
            >
              {cancelLoading ? "Cancelando..." : "Confirmar cancelamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function DefaultProfilePage(props: BarbershopPageProps) {
  const navigate = useNavigate();
  const { isAuthenticated, customer } = useAuthStore();
  const { style } = useStyle();
  const [appointments, setAppointments] = useState<NormalizedAppointment[]>([]);
  const [loading, setLoading] = useState(() => Boolean(customer));
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [ascending, setAscending] = useState(false);
  const lastLoadedKeyRef = useRef<string | null>(null);

  const customerId = customer?.id ?? null;
  const visibleAppointments = useMemo(
    () => (customerId ? appointments : []),
    [customerId, appointments],
  );
  const isLoadingAppointments = customerId ? loading : false;
  const visibleError = customerId ? error : null;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/${props.slug}/entrar`);
    }
  }, [isAuthenticated, props.slug, navigate]);

  useEffect(() => {
    if (!customerId) {
      lastLoadedKeyRef.current = null;
      return;
    }

    const resolvedCustomerId = customerId;
    const requestKey = `${props.id}:${resolvedCustomerId}`;

    if (lastLoadedKeyRef.current === requestKey) return;

    async function loadAppointments() {
      setLoading(true);
      setError(null);

      const { data, error } = await getCustomerAppointments(
        resolvedCustomerId,
        props.id,
      );

      if (error) {
        setError("Nao foi possivel carregar seus agendamentos.");
        setAppointments([]);
        setLoading(false);
        return;
      }

      setAppointments((data as AppointmentRow[]).map(normalize));
      lastLoadedKeyRef.current = requestKey;
      setLoading(false);
    }

    void loadAppointments();
  }, [customerId, props.id]);

  const filtered = useMemo(() => {
    let list = visibleAppointments;

    if (filter === "scheduled") {
      list = list.filter(a => a.status === "scheduled");
    }

    if (filter === "cancelled") {
      list = list.filter(
        a =>
          a.status === "cancelled_by_customer" ||
          a.status === "cancelled_by_barbershop",
      );
    }

    if (filter === "no_show") {
      list = list.filter(a => a.status === "no_show");
    }

    if (filter === "completed") {
      list = list.filter(a => a.status === "completed");
    }

    return [...list].sort((a, b) => {
      const cmp = a.starts_at.localeCompare(b.starts_at);
      return ascending ? cmp : -cmp;
    });
  }, [visibleAppointments, filter, ascending]);

  const filterCounts = useMemo(
    () => ({
      all: visibleAppointments.length,
      scheduled: visibleAppointments.filter(a => a.status === "scheduled").length,
      cancelled: visibleAppointments.filter(
        a =>
          a.status === "cancelled_by_customer" ||
          a.status === "cancelled_by_barbershop",
      ).length,
      no_show: visibleAppointments.filter(a => a.status === "no_show").length,
      completed: visibleAppointments.filter(a => a.status === "completed").length,
    }),
    [visibleAppointments],
  );

  const groups = useMemo(() => {
    const map = new Map<string, NormalizedAppointment[]>();
    for (const appt of filtered) {
      const day = appt.starts_at.slice(0, 10);
      if (!map.has(day)) map.set(day, []);
      map.get(day)!.push(appt);
    }
    return Array.from(map.entries());
  }, [filtered]);

  function handleAppointmentStatusChange(
    appointmentId: string,
    status: AppointmentStatus,
  ) {
    setAppointments(current =>
      current.map(appt =>
        appt.id === appointmentId ? { ...appt, status } : appt,
      ),
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <CustomerProfileCard />

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-nowrap">Meus agendamentos</h1>
          <Button
            className="mx-auto rounded-full px-5 text-sm sm:mr-0 sm:ml-auto"
            style={{
              backgroundColor: style.primary_color,
              color: style.text_button_color,
            }}
            onClick={() => navigate(`/${props.slug}/agendar`)}
          >
            Novo agendamento
            <ChevronRight size={14} />
          </Button>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
          <div className="flex flex-wrap gap-1.5">
            {FILTER_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  filter === tab.key
                    ? `${FILTER_CLASS[tab.key]} shadow-sm`
                    : `${FILTER_CLASS[tab.key]} opacity-70 hover:opacity-100`
                }`}
              >
                {tab.label} ({filterCounts[tab.key]})
              </button>
            ))}
          </div>
          <button
            onClick={() => setAscending(v => !v)}
            className="flex items-center gap-1.5 border-l border-current px-1 py-1.5 text-xs font-medium text-current"
          >
            {ascending ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {ascending ? "Mais antigos" : "Mais recentes"}
          </button>
        </div>

        {isLoadingAppointments ? (
          <div className="flex justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
          </div>
        ) : visibleError ? (
          <div className="py-20 text-center">
            <p className="text-sm text-red-500">{visibleError}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-current/10">
              <Calendar size={24} className="text-current" />
            </div>
            {visibleAppointments.length === 0 ? (
              <>
                <div>
                  <p className="font-medium">Nenhum agendamento ainda</p>
                  <p className="mt-1 text-sm text-current/80">
                    Que tal agendar seu proximo corte?
                  </p>
                </div>
                <Button
                  className="mt-2 rounded-full px-6"
                  style={{
                    backgroundColor: style.primary_color,
                    color: style.text_button_color,
                  }}
                  onClick={() => navigate(`/${props.slug}/agendar`)}
                >
                  Agendar agora
                </Button>
              </>
            ) : (
              <p className="text-sm text-current/80">
                Nenhum agendamento neste filtro.
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col">
            {groups.map(([day, appts], groupIdx) => (
              <div key={day} className="flex gap-2">
                <div className="flex flex-col items-center">
                  <div
                    className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: darkenColor(style.background_color, 0.15),
                      color: style.text_color,
                    }}
                  >
                    <Calendar size={14} />
                  </div>
                  {groupIdx < groups.length - 1 && (
                    <div className="mt-1 w-px flex-1 bg-current/20" />
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-2 pt-1.5 pb-4.5">
                  <p className="mt-1 text-sm font-semibold">
                    {formatDate(day)}
                  </p>
                  {appts.map(appt => (
                    <AppointmentCard
                      key={appt.id}
                      appt={appt}
                      customerId={customerId!}
                      barbershopId={props.id}
                      onStatusChange={handleAppointmentStatusChange}
                    />
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
