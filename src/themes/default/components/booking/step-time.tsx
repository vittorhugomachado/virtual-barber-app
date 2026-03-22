import { Button } from "../../../../components/ui/button";
import { useAvailableSlots } from "../../../../hooks/use-available-slots";
import type { OpeningHour } from "../../../types";

interface StepTimeProps {
  barbershopId: string;
  barberId: string;
  date: string;
  totalDuration: number;
  openingHours: OpeningHour[];
  selected: string | null;
  onSelect: (time: string) => void;
  onContinue: () => void;
  primaryColor?: string;
}

export function StepTime({
  barbershopId,
  barberId,
  date,
  totalDuration,
  openingHours,
  selected,
  onSelect,
  onContinue,
  primaryColor,
}: StepTimeProps) {
  const { slots, loading } = useAvailableSlots({
    barbershopId,
    barberId,
    date,
    totalDuration,
    openingHours,
  });

  return (
    <div className="flex flex-col gap-6">
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-800" />
        </div>
      ) : slots.length === 0 ? (
        <p className="py-10 text-center text-sm text-neutral-400">
          Nenhum horário disponível neste dia.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {slots.map(slot => {
            const isSelected = selected === slot;
            return (
              <button
                key={slot}
                onClick={() => onSelect(slot)}
                className={`rounded-xl border py-2.5 text-sm font-medium transition-colors ${
                  isSelected
                    ? "border-transparent text-white"
                    : "border-neutral-200 hover:border-neutral-400 dark:border-neutral-800"
                }`}
                style={isSelected && primaryColor ? { backgroundColor: primaryColor } : undefined}
              >
                {slot}
              </button>
            );
          })}
        </div>
      )}

      <Button
        className="h-11 w-full rounded-full text-white"
        style={primaryColor ? { backgroundColor: primaryColor } : undefined}
        disabled={!selected}
        onClick={onContinue}
      >
        Continuar
      </Button>
    </div>
  );
}
