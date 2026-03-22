import { User } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import type { Barber, Service } from "../../../types";

interface StepBarberProps {
  barbers: Barber[];
  selectedServices: Service[];
  selected: Barber | null;
  onSelect: (barber: Barber) => void;
  onContinue: () => void;
  primaryColor?: string;
}

export function StepBarber({
  barbers,
  selectedServices,
  selected,
  onSelect,
  onContinue,
  primaryColor,
}: StepBarberProps) {
  const serviceIds = selectedServices.map(s => s.id);

  const eligible = barbers.filter(
    b => serviceIds.length === 0 || serviceIds.some(id => b.serviceIds.includes(id)),
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {eligible.map(barber => {
          const isSelected = selected?.id === barber.id;
          return (
            <button
              key={barber.id}
              onClick={() => onSelect(barber)}
              className={`flex flex-col items-center gap-3 rounded-2xl border p-4 transition-colors ${
                isSelected
                  ? "border-transparent"
                  : "border-neutral-200 hover:border-neutral-400 dark:border-neutral-800"
              }`}
              style={isSelected && primaryColor ? { borderColor: primaryColor, backgroundColor: primaryColor + "15" } : undefined}
            >
              {barber.avatar_url ? (
                <img
                  src={barber.avatar_url}
                  alt={barber.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                  <User size={24} className="text-neutral-400" />
                </div>
              )}
              <span className="text-center text-sm font-medium leading-tight">{barber.name}</span>
            </button>
          );
        })}
      </div>

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
