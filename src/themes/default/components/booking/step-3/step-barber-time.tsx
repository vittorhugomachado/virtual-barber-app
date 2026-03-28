import { FileText, Clock, DollarSign } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { useBarbershopData } from "../../../../../contexts/barbershop-data/barbershop-data-context";
import { useCart } from "../../../../../hooks/use-cart";
import { ServiceSlotCard } from "./components/service-slot-card";
import { useStyle } from "../../../../../contexts/style-context/style-context";
import type { ServiceSelection } from "../../../../types";
import { formatDuration } from "../../../../../utils/format-duration";
import { formatPrice } from "../../../../../utils/format-price";

interface StepBarberTimeProps {
  customerId: string;
  date: string;
  selections: Record<string, ServiceSelection>;
  onSelectionsChange: (selections: Record<string, ServiceSelection>) => void;
  onContinue: () => void;
}

export function StepBarberTime({
  customerId,
  date,
  selections, // ARRAY DE OBJETOS DE BARBEIRO (BARBER) E HORÁRIO (TIME) SELECIONADOS
  onSelectionsChange,
  onContinue,
}: StepBarberTimeProps) {
  const { primaryColor, textButtonColor } = useStyle();
  const { items, total } = useCart();
  const { services: allServices } = useBarbershopData();
  const allSelected =
    items.length > 0 && items.every(s => !!selections[s.id]);
  const totalDuration = items.reduce(
    (acc, s) => acc + (s.duration_min ?? 0),
    0,
  );
  console.log(selections)
  // const total = services.reduce((acc, s) => acc + (s.price ?? 0), 0);
  return (
    <div className="flex flex-col gap-4">
      {items.map((service, index) => (
        <ServiceSlotCard
          key={service.id}
          serviceId={service.id}
          customerId={customerId}
          date={date}
          selection={selections[service.id]}
          otherSelections={allServices
            .filter(s => s.id !== service.id && !!selections[s.id])
            .map(s => ({
              time: selections[s.id].time,
              duration: s.duration_min ?? 30,
            }))}
          onSelect={sel =>
            onSelectionsChange({ ...selections, [service.id]: sel })
          }
          autoOpen={index === 0}
        />
      ))}

      <div className="flex items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-100 px-3.5 py-2.5 text-sm dark:border-neutral-800 dark:bg-neutral-900">
        <FileText className="hidden sm:block h-3.5 w-3.5 text-neutral-400" />
        <span className="font-medium text-neutral-700 dark:text-neutral-200">
          {items.length} serviço{items.length > 1 && "s"}
        </span>
        <span className="mx-1 text-neutral-400">|</span>
        <Clock className="hidden sm:block h-3.5 w-3.5 text-neutral-400" />
        <span className="font-medium text-neutral-700 dark:text-neutral-200">
          {formatDuration(totalDuration)}
        </span>
        <span className="mx-1 text-neutral-400">|</span>
        <DollarSign className="hidden sm:block h-3.5 w-3.5 text-neutral-400" />
        <span className="font-medium text-neutral-700 dark:text-neutral-200">
          {formatPrice(total)}
        </span>
      </div>

      <Button
        className="h-11 w-full rounded-full"
        style={{ backgroundColor: primaryColor, color: textButtonColor }}
        disabled={!allSelected}
        onClick={onContinue}
      >
        Continuar
      </Button>
    </div>
  );
}
