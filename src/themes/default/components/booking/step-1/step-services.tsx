import { Check, Clock, DollarSign, Plus, Scissors } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { useCart } from "../../../../../hooks/use-cart";
import { useStyle } from "../../../../../contexts/style-context/style-context";
import type { Service } from "../../../../types";
import { formatPrice } from "../../../../../utils/format-price";
import { formatDuration } from "../../../../../utils/format-duration";
import { useBarbershopData } from "../../../../../contexts/barbershop-data/barbershop-data-context";

interface StepServicesProps {
  onContinue: () => void;
}

export function StepServices({ onContinue }: StepServicesProps) {
  const { services } = useBarbershopData();
  const { primaryColor, textButtonColor } = useStyle();
  const { items, addService, removeService, hasService, total, totalDuration } =
    useCart();

  function handleToggle(service: Service) {
    if (hasService(service.id)) removeService(service.id);
    else addService(service);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col divide-y divide-zinc-200 overflow-hidden rounded-xl border border-zinc-200 dark:divide-neutral-800 dark:border-neutral-800">
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
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                    <Scissors size={16} className="text-neutral-400" />
                  </div>
                )}
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{service.name}</span>
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
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
                className="shrink-0 rounded-full"
                style={
                  inCart
                    ? { backgroundColor: "#299E69", color: "#09090B" }
                    : undefined
                }
                onClick={() => handleToggle(service)}
              >
                {inCart ? <Check size={14} /> : <Plus size={14} />}
              </Button>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-sm">
        <Scissors className="hidden sm:block h-3.5 w-3.5 text-neutral-400" />
        <span className="font-medium text-neutral-200">
          {items.length} serviço{items.length > 1 && "s"}
        </span>

        <span className="mx-1 text-neutral-600">|</span>

        <Clock className="hidden sm:block h-3.5 w-3.5 text-neutral-400" />
        <span className="font-medium text-neutral-200">
          {formatDuration(totalDuration)}
        </span>

        <span className="mx-1 text-neutral-600">|</span>

        <DollarSign className="hidden sm:block h-3.5 w-3.5 text-neutral-400" />
        <span className="font-medium text-neutral-200">
          {formatPrice(total)}
        </span>
      </div>
      <Button
        className="h-11 w-full rounded-full"
        style={{ backgroundColor: primaryColor, color: textButtonColor }}
        disabled={items.length === 0}
        onClick={onContinue}
      >
        Continuar
      </Button>
    </div>
  );
}
