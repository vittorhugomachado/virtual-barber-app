import { FileText, Clock, DollarSign } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { ServiceSlotCard } from "./components/service-slot-card";
import type { Service, Barber, OpeningHour } from "../../../../types";
import type { ServiceSelection } from "../../../../types";
import { formatDuration } from "../../../../../utils/format-duration";
import { formatPrice } from "../../../../../utils/format-price";

interface StepBarberTimeProps {
  services: Service[];
  barbers: Barber[];
  barbershopId: string;
  customerId: string;
  date: string;
  openingHours: OpeningHour[];
  selections: Record<string, ServiceSelection>;
  onSelectionsChange: (selections: Record<string, ServiceSelection>) => void;
  onContinue: () => void;
  primaryColor?: string;
  textButtonColor?: string;
}

export function StepBarberTime({
  services,
  barbers,
  barbershopId,
  customerId,
  date,
  openingHours,
  selections,
  onSelectionsChange,
  onContinue,
  primaryColor,
  textButtonColor,
}: StepBarberTimeProps) {
  const allSelected = services.length > 0 && services.every(s => !!selections[s.id]);
  const totalDuration = services.reduce((acc, s) => acc + (s.duration_min ?? 0), 0);
  const total = services.reduce((acc, s) => acc + (s.price ?? 0), 0);
  return (
    <div className="flex flex-col gap-4">
      {services.map((service, index) => (
        <ServiceSlotCard
          key={service.id}
          service={service}
          barbers={barbers}
          barbershopId={barbershopId}
          customerId={customerId}
          date={date}
          openingHours={openingHours}
          selection={selections[service.id]}
          otherSelections={services
            .filter(s => s.id !== service.id && !!selections[s.id])
            .map(s => ({
              time: selections[s.id].time,
              duration: s.duration_min ?? 30,
            }))}
          onSelect={sel =>
            onSelectionsChange({ ...selections, [service.id]: sel })
          }
          primaryColor={primaryColor}
          textButtonColor={textButtonColor}
          autoOpen={index === 0}
        />
      ))}

      <div className="flex items-center justify-end gap-1.5 px-3.5 py-2.5 bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 text-sm">
        <FileText className="h-3.5 w-3.5 text-neutral-400" />
        <span className="font-medium text-neutral-700 dark:text-neutral-200">
          {services.length} serviço{services.length > 1 && "s"}
        </span>
        <span className="text-neutral-400 mx-1">|</span>
        <Clock className="h-3.5 w-3.5 text-neutral-400" />
        <span className="font-medium text-neutral-700 dark:text-neutral-200">
          {formatDuration(totalDuration)}
        </span>
        <span className="text-neutral-400 mx-1">|</span>
        <DollarSign className="h-3.5 w-3.5 text-neutral-400" />
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
