import { User } from "lucide-react";
import { useBarbershopData } from "../../../../../../contexts/barbershop-data/barbershop-data-context";
import type { Barber } from "../../../../../types";
import type { ServiceSelection } from "../../../../../types";
import { useStyle } from "../../../../../../contexts/style-context/style-context";

interface BarberGridProps {
  serviceId: string;
  selection?: ServiceSelection;
  onSelect: (barber: Barber) => void;
}

export function BarberGrid({ serviceId, selection, onSelect }: BarberGridProps) {
  const { style } = useStyle();
  const { barbers } = useBarbershopData();
  const eligible = barbers.filter(barber => barber.serviceIds.includes(serviceId));

  if (eligible.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-neutral-400">
        Nenhum profissional disponÃ­vel para este serviÃ§o.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {eligible.map(barber => {
        const isSelected = selection?.barber.id === barber.id;
        return (
          <button
            key={barber.id}
            onClick={() => onSelect(barber)}
            className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-colors ${
              isSelected
                ? "border-transparent"
                : "border-neutral-200 hover:border-neutral-400 dark:border-neutral-800"
            }`}
            style={
              isSelected && style.primary_color
                ? {
                    borderColor: style.primary_color,
                    backgroundColor: style.primary_color + "15",
                  }
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
            <span className="text-center text-xs leading-tight font-medium">
              {barber.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
