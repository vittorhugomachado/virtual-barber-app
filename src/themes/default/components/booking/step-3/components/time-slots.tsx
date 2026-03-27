import { ArrowLeft, User } from "lucide-react";
import type { Barber } from "../../../../../types";
import type { ServiceSelection } from "../../../../../types";
import { getTimePeriod } from "../../../../../../utils/format-time";
import { PERIOD_LABELS } from "../../../../../types";
import { useStyle } from "../../../../../../contexts/style-context";

interface SlotWithStatus {
  time: string;
  available: boolean;
}

interface TimeSlotsProps {
  viewBarber: Barber;
  allSlotsForDay: string[];
  availableSet: Set<string>;
  selection?: ServiceSelection;
  loading: boolean;
  onBack: () => void;
  onTimeClick: (time: string) => void;
}

export function TimeSlots({
  viewBarber,
  allSlotsForDay,
  availableSet,
  selection,
  loading,
  onBack,
  onTimeClick,
}: TimeSlotsProps) {
  const { primaryColor, textButtonColor } = useStyle();
  const allSlotsWithStatus: SlotWithStatus[] = allSlotsForDay.map(time => ({
    time,
    available: availableSet.has(time),
  }));
  const periods = [
    {
      key: "manha" as const,
      slots: allSlotsWithStatus.filter(s => getTimePeriod(s.time) === "manha"),
    },
    {
      key: "tarde" as const,
      slots: allSlotsWithStatus.filter(s => getTimePeriod(s.time) === "tarde"),
    },
    {
      key: "noite" as const,
      slots: allSlotsWithStatus.filter(s => getTimePeriod(s.time) === "noite"),
    },
  ].filter(p => p.slots.length > 0);

  return (
    <>
      <div className="mb-4 flex items-center gap-2">
        <button
          onClick={onBack}
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
      ) : allSlotsForDay.length === 0 ? (
        <p className="py-6 text-center text-sm text-neutral-400">
          Nenhum horário disponível neste dia.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {periods.map(({ key, slots: periodSlots }) => (
            <div key={key}>
              <p className="mb-2 text-xs font-semibold tracking-wide text-neutral-400 uppercase">
                {PERIOD_LABELS[key]}
              </p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {periodSlots.map(({ time: slot, available }) => {
                  const isSelected =
                    selection?.barber.id === viewBarber.id &&
                    selection.time === slot;
                  return (
                    <button
                      key={slot}
                      onClick={() => available && onTimeClick(slot)}
                      disabled={!available}
                      className={`rounded-xl border py-2 text-sm font-medium transition-colors ${
                        isSelected
                          ? "border-transparent"
                          : available
                            ? "border-neutral-200 hover:border-neutral-400 dark:border-neutral-800"
                            : "cursor-not-allowed border-neutral-200 opacity-35 dark:border-neutral-800"
                      }`}
                      style={
                        isSelected && primaryColor
                          ? { backgroundColor: primaryColor, color: textButtonColor }
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
  );
}
