import { useState } from "react";
import { User, ChevronDown, ChevronUp, Check, ArrowLeft, Scissors } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { useAvailableSlots } from "../../../../hooks/use-available-slots";
import type { Barber, Service, OpeningHour } from "../../../types";
import { formatDuration } from "../../../../utils/format-duration";
import { formatPrice } from "../../../../utils/format-price";

export interface ServiceSelection {
  barber: Barber;
  time: string;
}

function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function getTimePeriod(time: string): "manha" | "tarde" | "noite" {
  const [h, m] = time.split(":").map(Number);
  const min = h * 60 + m;
  if (min > 240 && min <= 780) return "manha";
  if (min > 780 && min <= 1080) return "tarde";
  return "noite";
}

function addMinutes(time: string, minutes: number) {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

const PERIOD_LABELS: Record<"manha" | "tarde" | "noite", string> = {
  manha: "Manhã",
  tarde: "Tarde",
  noite: "Noite",
};

interface OtherSelection {
  time: string;
  duration: number;
}

interface ServiceSlotCardProps {
  service: Service;
  barbers: Barber[];
  barbershopId: string;
  date: string;
  openingHours: OpeningHour[];
  selection?: ServiceSelection;
  otherSelections: OtherSelection[];
  onSelect: (sel: ServiceSelection) => void;
  primaryColor?: string;
  autoOpen?: boolean;
}

function ServiceSlotCard({
  service,
  barbers,
  barbershopId,
  date,
  openingHours,
  selection,
  otherSelections,
  onSelect,
  primaryColor,
  autoOpen,
}: ServiceSlotCardProps) {
  const [open, setOpen] = useState(autoOpen ?? false);
  const [viewBarber, setViewBarber] = useState<Barber | null>(null);

  const eligible = barbers.filter(b => b.serviceIds.includes(service.id));

  const { slots, loading } = useAvailableSlots({
    barbershopId,
    barberId: viewBarber?.id ?? null,
    date,
    totalDuration: service.duration_min ?? 30,
    openingHours,
  });

  // Filter out slots that would overlap with other already-selected services.
  // A customer cannot be in two places at the same time, and a barber cannot
  // serve two clients simultaneously.
  const duration = service.duration_min ?? 30;
  const availableSlots = slots.filter(slot => {
    const start = timeToMinutes(slot);
    const end = start + duration;
    return !otherSelections.some(other => {
      const otherStart = timeToMinutes(other.time);
      const otherEnd = otherStart + other.duration;
      return start < otherEnd && end > otherStart;
    });
  });

  const manha = availableSlots.filter(s => getTimePeriod(s) === "manha");
  const tarde = availableSlots.filter(s => getTimePeriod(s) === "tarde");
  const noite = availableSlots.filter(s => getTimePeriod(s) === "noite");
  const periods: { key: "manha" | "tarde" | "noite"; slots: string[] }[] = [
    { key: "manha", slots: manha },
    { key: "tarde", slots: tarde },
    { key: "noite", slots: noite },
  ].filter(p => p.slots.length > 0);

  function handleToggle() {
    if (!open) {
      setViewBarber(selection?.barber ?? null);
    }
    setOpen(o => !o);
  }

  function handleTimeClick(time: string) {
    if (!viewBarber) return;
    onSelect({ barber: viewBarber, time });
    setOpen(false);
    setViewBarber(null);
  }

  const isComplete = !!selection;

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
      {/* Header */}
      <button
        onClick={handleToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
      >
        <div className="flex items-center gap-3">
          {service.image_url ? (
            <img
              src={service.image_url}
              alt={service.name}
              className="h-10 w-10 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
              <Scissors size={14} className="text-neutral-400" />
            </div>
          )}
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">{service.name}</span>
            {isComplete ? (
              <span className="text-xs text-neutral-400">
                {selection.barber.name} · {selection.time}
                {service.duration_min
                  ? ` – ${addMinutes(selection.time, service.duration_min)}`
                  : ""}
              </span>
            ) : (
              <span className="text-xs text-neutral-400">
                {[
                  service.duration_min != null ? formatDuration(service.duration_min) : null,
                  service.price != null ? formatPrice(service.price) : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isComplete ? (
            <div
              className="flex h-5 w-5 items-center justify-center rounded-full"
              style={{ backgroundColor: primaryColor }}
            >
              <Check size={10} className="text-white" />
            </div>
          ) : (
            <span className="text-xs text-neutral-400">Selecionar</span>
          )}
          {open ? (
            <ChevronUp size={16} className="text-neutral-400" />
          ) : (
            <ChevronDown size={16} className="text-neutral-400" />
          )}
        </div>
      </button>

      {/* Expandable body */}
      {open && (
        <div className="border-t border-neutral-100 px-4 pb-4 pt-3 dark:border-neutral-800">
          {!viewBarber ? (
            /* Barber grid */
            eligible.length === 0 ? (
              <p className="py-4 text-center text-sm text-neutral-400">
                Nenhum profissional disponível para este serviço.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {eligible.map(barber => {
                  const isSelected = selection?.barber.id === barber.id;
                  return (
                    <button
                      key={barber.id}
                      onClick={() => setViewBarber(barber)}
                      className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-colors ${
                        isSelected
                          ? "border-transparent"
                          : "border-neutral-200 hover:border-neutral-400 dark:border-neutral-800"
                      }`}
                      style={
                        isSelected && primaryColor
                          ? { borderColor: primaryColor, backgroundColor: primaryColor + "15" }
                          : undefined
                      }
                    >
                      {barber.avatar_url ? (
                        <img
                          src={barber.avatar_url}
                          alt={barber.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                          <User size={20} className="text-neutral-400" />
                        </div>
                      )}
                      <span className="text-center text-xs font-medium leading-tight">
                        {barber.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )
          ) : (
            /* Time slots for selected barber */
            <>
              {/* Barber header + back */}
              <div className="mb-4 flex items-center gap-2">
                <button
                  onClick={() => setViewBarber(null)}
                  className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <ArrowLeft size={16} />
                </button>
                {viewBarber.avatar_url ? (
                  <img
                    src={viewBarber.avatar_url}
                    alt={viewBarber.name}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                    <User size={14} className="text-neutral-400" />
                  </div>
                )}
                <span className="text-sm font-medium">{viewBarber.name}</span>
              </div>

              {loading ? (
                <div className="flex justify-center py-6">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-800" />
                </div>
              ) : availableSlots.length === 0 ? (
                <p className="py-6 text-center text-sm text-neutral-400">
                  Nenhum horário disponível neste dia.
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {periods.map(({ key, slots: periodSlots }) => (
                    <div key={key}>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                        {PERIOD_LABELS[key]}
                      </p>
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {periodSlots.map(slot => {
                          const isSelected =
                            selection?.barber.id === viewBarber.id && selection.time === slot;
                          return (
                            <button
                              key={slot}
                              onClick={() => handleTimeClick(slot)}
                              className={`rounded-xl border py-2 text-sm font-medium transition-colors ${
                                isSelected
                                  ? "border-transparent text-white"
                                  : "border-neutral-200 hover:border-neutral-400 dark:border-neutral-800"
                              }`}
                              style={
                                isSelected && primaryColor
                                  ? { backgroundColor: primaryColor }
                                  : undefined
                              }
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

interface StepBarberTimeProps {
  services: Service[];
  barbers: Barber[];
  barbershopId: string;
  date: string;
  openingHours: OpeningHour[];
  selections: Record<string, ServiceSelection>;
  onSelectionsChange: (selections: Record<string, ServiceSelection>) => void;
  onContinue: () => void;
  primaryColor?: string;
}

export function StepBarberTime({
  services,
  barbers,
  barbershopId,
  date,
  openingHours,
  selections,
  onSelectionsChange,
  onContinue,
  primaryColor,
}: StepBarberTimeProps) {
  function handleSelect(serviceId: string, sel: ServiceSelection) {
    onSelectionsChange({ ...selections, [serviceId]: sel });
  }

  const allSelected = services.every(s => !!selections[s.id]);

  return (
    <div className="flex flex-col gap-4">
      {services.map((service, index) => {
        const otherSelections = services
          .filter(s => s.id !== service.id && !!selections[s.id])
          .map(s => ({
            time: selections[s.id].time,
            duration: s.duration_min ?? 30,
          }));

        return (
          <ServiceSlotCard
            key={service.id}
            service={service}
            barbers={barbers}
            barbershopId={barbershopId}
            date={date}
            openingHours={openingHours}
            selection={selections[service.id]}
            otherSelections={otherSelections}
            onSelect={sel => handleSelect(service.id, sel)}
            primaryColor={primaryColor}
            autoOpen={index === 0 && !selections[service.id]}
          />
        );
      })}

      <Button
        className="h-11 w-full rounded-full text-white"
        style={primaryColor ? { backgroundColor: primaryColor } : undefined}
        disabled={!allSelected}
        onClick={onContinue}
      >
        Continuar
      </Button>
    </div>
  );
}
