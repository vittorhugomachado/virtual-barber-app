import { useState } from "react";
import { ChevronDown, ChevronUp, Check, Scissors } from "lucide-react";
import { useAvailableSlots } from "../../../../../../hooks/use-available-slots";
import type { Barber } from "../../../../../types";
import { formatDuration } from "../../../../../../utils/format-duration";
import { formatPrice } from "../../../../../../utils/format-price";
import type { ServiceSlotCardProps } from "../../../../../types";
import { BarberGrid } from "./barber-grid";
import { TimeSlots } from "./time-slots";
import {
  addMinutes,
  getAllSlotsForDay,
  timeToMinutes,
} from "../../../../../../utils/format-time";

export function ServiceSlotCard({
  service,
  barbers,
  barbershopId,
  date,
  openingHours,
  selection,
  otherSelections,
  onSelect,
  primaryColor,
  textButtonColor,
  autoOpen,
}: ServiceSlotCardProps) {
  const [open, setOpen] = useState(autoOpen ?? false);
  const [viewBarber, setViewBarber] = useState<Barber | null>(null);

  const eligible = barbers.filter(b => b.serviceIds.includes(service.id));
  const duration = service.duration_min ?? 30;

  const { slots, loading } = useAvailableSlots({
    barbershopId,
    barberId: viewBarber?.id ?? null,
    date,
    totalDuration: duration,
    openingHours,
  });

  const availableSlots = slots.filter(slot => {
    const start = timeToMinutes(slot);
    const end = start + duration;
    return !otherSelections.some(other => {
      const otherStart = timeToMinutes(other.time);
      const otherEnd = otherStart + other.duration;
      return start < otherEnd && end > otherStart;
    });
  });

  const availableSet = new Set(availableSlots);
  const allSlotsForDay = viewBarber
    ? getAllSlotsForDay(openingHours, date, duration)
    : [];
  const isComplete = !!selection;

  function handleToggle() {
    if (!open) setViewBarber(selection?.barber ?? null);
    setOpen(o => !o);
  }

  function handleTimeClick(time: string) {
    if (!viewBarber) return;
    onSelect({ barber: viewBarber, time });
    setOpen(false);
    setViewBarber(null);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
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
                  service.duration_min != null
                    ? formatDuration(service.duration_min)
                    : null,
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
              style={{ backgroundColor: primaryColor, color: textButtonColor }}
            >
              <Check size={10} />
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

      {open && (
        <div className="border-t border-neutral-100 px-4 pt-3 pb-4 dark:border-neutral-800">
          {!viewBarber ? (
            <BarberGrid
              eligible={eligible}
              selection={selection}
              primaryColor={primaryColor}
              textButtonColor={textButtonColor}
              onSelect={setViewBarber}
            />
          ) : (
            <TimeSlots
              viewBarber={viewBarber}
              allSlotsForDay={allSlotsForDay}
              availableSet={availableSet}
              selection={selection}
              primaryColor={primaryColor}
              textButtonColor={textButtonColor}
              loading={loading}
              onBack={() => setViewBarber(null)}
              onTimeClick={handleTimeClick}
            />
          )}
        </div>
      )}
    </div>
  );
}
