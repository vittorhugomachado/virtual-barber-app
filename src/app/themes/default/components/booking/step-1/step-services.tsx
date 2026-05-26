import { Check, Clock, DollarSign, Plus, Scissors } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { useCart } from "../../../../../hooks/use-cart";
import { useStyle } from "../../../../../contexts/style-context/style-context";
import type { Service } from "../../../../types";
import { formatPrice } from "@/utils/format-price";
import { formatDuration } from "@/utils/format-duration";
import { useBarbershopData } from "../../../../../contexts/barbershop-data/barbershop-data-context";
import { darkenColor } from "@/utils/darken-color";

interface StepServicesProps {
  onContinue: () => void;
}

export function StepServices({ onContinue }: StepServicesProps) {
  const { services } = useBarbershopData();
  const { style } = useStyle();
  const { items, addService, removeService, hasService, total, totalDuration } =
    useCart();

  function handleToggle(service: Service) {
    if (hasService(service.id)) {
      removeService(service.id);
      return;
    }

    addService(service);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col divide-y divide-current/15 overflow-hidden rounded-xl border border-current/15">
        {services.map(service => {
          const inCart = hasService(service.id);

          return (
            <div
              key={service.id}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                {service.image_url ? (
                  <img
                    src={service.image_url}
                    alt={service.name}
                    className="h-12 w-12 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-current/20">
                    <Scissors size={16} className="text-current" />
                  </div>
                )}
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{service.name}</span>
                  <div className="flex items-center gap-2 text-xs text-current/80">
                    {service.duration_min != null && (
                      <span>{formatDuration(service.duration_min)}</span>
                    )}
                    {service.price != null && (
                      <span>{formatPrice(service.price)}</span>
                    )}
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant={inCart ? "default" : "outline"}
                className="shrink-0 rounded-full bg-transparent hover:bg-current/50 hover:text-current"
                style={
                  inCart
                    ? { backgroundColor: "green", color: "white" }
                    : { border: "1px solid", borderColor: style.text_color }
                }
                onClick={() => handleToggle(service)}
              >
                {inCart ? <Check size={14} /> : <Plus size={14} />}
              </Button>
            </div>
          );
        })}
      </div>

      <div
        className="flex items-center justify-center gap-1.5 rounded-xl border border-current/20 px-3.5 py-2.5 text-sm"
        style={{ backgroundColor: darkenColor(style.background_color, 0.15) }}
      >
        <Scissors className="hidden h-3.5 w-3.5 text-current sm:block" />
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
        <span className="font-medium text-current">{formatPrice(total)}</span>
      </div>

      <Button
        className="h-11 w-full rounded-full"
        style={{
          backgroundColor: style.primary_color,
          color: style.text_button_color,
        }}
        disabled={items.length === 0}
        onClick={onContinue}
      >
        Continuar
      </Button>
    </div>
  );
}
