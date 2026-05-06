import { FileText, Clock, DollarSign } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { useBarbershopData } from "../../../../../contexts/barbershop-data/barbershop-data-context";
import { useCart } from "../../../../../hooks/use-cart";
import { useAggregatedBookingData } from "../../../../../hooks/use-aggregated-booking-data";
import { ServiceSlotCard } from "./components/service-slot-card";
import { useStyle } from "../../../../../contexts/style-context/style-context";
import type { ServiceSelection } from "../../../../types";
import { formatDuration } from "@/utils/format-duration";
import { formatPrice } from "@/utils/format-price";
import { darkenColor } from "@/utils/darken-color";

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
  selections,
  onSelectionsChange,
  onContinue,
}: StepBarberTimeProps) {
  const { style } = useStyle();
  const { items, total } = useCart();
  const { id: barbershopId, barbers, openingHours } = useBarbershopData();

  const allSelected =
    items.length > 0 && items.every(service => !!selections[service.id]);
  const totalDuration = items.reduce(
    (acc, service) => acc + (service.duration_min ?? 0),
    0,
  );

  const { slotsByService, loading } = useAggregatedBookingData({
    barbershopId,
    customerId,
    date,
    services: items,
    barbers,
    openingHours,
  });

  return (
    <div className="flex flex-col gap-4">
      {items.map((service, index) => (
        <ServiceSlotCard
          key={service.id}
          serviceId={service.id}
          customerId={customerId}
          date={date}
          selection={selections[service.id]}
          otherSelections={items
            .filter(
              currentService =>
                currentService.id !== service.id &&
                !!selections[currentService.id],
            )
            .map(currentService => ({
              time: selections[currentService.id].time,
              duration: currentService.duration_min ?? 30,
            }))}
          preloadedSlotsByBarber={slotsByService[service.id] ?? {}}
          preloadedLoading={loading}
          onSelect={selection =>
            onSelectionsChange({ ...selections, [service.id]: selection })
          }
          autoOpen={index === 0}
        />
      ))}

      <div className="flex items-center justify-center gap-1.5 rounded-xl border border-current/20 px-3.5 py-2.5 text-sm" style={{ backgroundColor: darkenColor(style.background_color, 0.15) }}>
        <FileText className="hidden h-3.5 w-3.5 text-current sm:block" />
        <span className="font-medium text-current">
          {items.length} serviço{items.length > 1 ? "s" : ""}
        </span>
        <span className="mx-1 text-current">|</span>
        <Clock className="hidden h-3.5 w-3.5 text-current sm:block" />
        <span className="font-medium text-current">
          {formatDuration(totalDuration)}
        </span>
        <span className="mx-1 text-current">|</span>
        <DollarSign className="hidden h-3.5 w-3.5 text-current sm:block" />
        <span className="font-medium text-current">
          {formatPrice(total)}
        </span>
      </div>

      <Button
        className="h-11 w-full rounded-full"
        style={{ backgroundColor: style.primary_color, color: style.text_button_color }}
        disabled={!allSelected}
        onClick={onContinue}
      >
        Continuar
      </Button>
    </div>
  );
}
