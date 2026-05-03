import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Check, Scissors } from "lucide-react";
import { useAvailableSlots } from "../../../../../../hooks/use-available-slots";
import { useBarbershopData } from "../../../../../../contexts/barbershop-data/barbershop-data-context";
import { useStyle } from "../../../../../../contexts/style-context/style-context";
import type { Barber } from "../../../../../types";
import { formatDuration } from "@/utils/format-duration";
import { formatPrice } from "@/utils/format-price";
import type { ServiceSlotCardProps } from "../../../../../types";
import { BarberGrid } from "./barber-grid";
import { TimeSlots } from "./time-slots";
import {
  addMinutes,
  getAllSlotsForDay,
  timeToMinutes,
} from "@/utils/format-time";

export function ServiceSlotCard({
  serviceId,
  customerId,
  date,
  selection,
  otherSelections,
  preloadedSlotsByBarber,
  preloadedLoading,
  onSelect,
  autoOpen,
}: ServiceSlotCardProps) {
  const { style } = useStyle();
  const { id: barbershopId, openingHours, services } = useBarbershopData();
  const [open, setOpen] = useState(autoOpen ?? false);
  const [viewBarber, setViewBarber] = useState<Barber | null>(null);
  const service = services.find(currentService => currentService.id === serviceId);
  const duration = service?.duration_min ?? 30;
  const shouldUsePreloadedSlots = preloadedSlotsByBarber !== undefined;

  const { slots, loading } = useAvailableSlots({
    barbershopId,
    barberId: shouldUsePreloadedSlots ? null : viewBarber?.id ?? null,
    customerId: shouldUsePreloadedSlots ? null : customerId,
    date: shouldUsePreloadedSlots ? null : date,
    totalDuration: duration,
    openingHours,
    barberAvailability: viewBarber?.availability,
  });

  const rawSlots = useMemo(() => {
    if (!viewBarber) {
      return [];
    }

    if (shouldUsePreloadedSlots) {
      return preloadedSlotsByBarber?.[viewBarber.id] ?? [];
    }

    return slots;
  }, [preloadedSlotsByBarber, shouldUsePreloadedSlots, slots, viewBarber]);

  const availableSlots = rawSlots.filter(slot => {
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
  const isLoading = shouldUsePreloadedSlots ? !!preloadedLoading : loading;
  const isComplete = !!selection;

  if (!service) return null;

  function handleToggle() {
    if (!open) setViewBarber(selection?.barber ?? null);
    setOpen(current => !current);
  }

  function handleTimeClick(time: string) {
    if (!viewBarber) return;
    onSelect({ barber: viewBarber, time });
    setOpen(false);
    setViewBarber(null);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-current/15">
      <button
        onClick={handleToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-current/10"
      >
        <div className="flex items-center gap-3">
          {service.image_url ? (
            <img
              src={service.image_url}
              alt={service.name}
              className="h-10 w-10 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-current/15">
              <Scissors size={14} className="text-current" />
            </div>
          )}
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">{service.name}</span>
            {isComplete ? (
              <span className="text-xs text-current">
                {selection.barber.name} | {selection.time}
                {service.duration_min
                  ? ` - ${addMinutes(selection.time, service.duration_min)}`
                  : ""}
              </span>
            ) : (
              <span className="text-xs text-current">
                {[
                  service.duration_min != null
                    ? formatDuration(service.duration_min)
                    : null,
                  service.price != null ? formatPrice(service.price) : null,
                ]
                  .filter(Boolean)
                  .join(" | ")}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isComplete ? (
            <div
              className="flex h-5 w-5 items-center justify-center rounded-full"
              style={{ backgroundColor: style.primary_color, color: style.text_button_color }}
            >
              <Check size={10} />
            </div>
          ) : (
            <span className="text-xs text-current">Selecionar</span>
          )}
          {open ? (
            <ChevronUp size={16} className="text-current" />
          ) : (
            <ChevronDown size={16} className="text-current" />
          )}
        </div>
      </button>

      {open && (
        <div className="border-t border-current/15 px-4 pb-4 pt-3">
          {!viewBarber ? (
            <BarberGrid
              serviceId={service.id}
              selection={selection}
              onSelect={setViewBarber}
            />
          ) : (
            <TimeSlots
              viewBarber={viewBarber}
              allSlotsForDay={allSlotsForDay}
              availableSet={availableSet}
              selection={selection}
              loading={isLoading}
              onBack={() => setViewBarber(null)}
              onTimeClick={handleTimeClick}
            />
          )}
        </div>
      )}
    </div>
  );
}
