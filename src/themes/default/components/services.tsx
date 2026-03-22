import { Scissors } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { useBookingStore } from "../../../store/booking-store";
import { useAuthStore } from "../../../store/auth-store";
import type { Service } from "../../types";
import { formatPrice } from "../../../utils/format-price";
import { formatDuration } from "../../../utils/format-duration";

interface ServicesProps {
  services: Service[];
  isPreview?: boolean;
}

export function Services({ services, isPreview }: ServicesProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { setService } = useBookingStore();

  if (!services.length) return null;

  function handleAgendar(service: Service) {
    if (isPreview) return;
    setService(service);
    if (isAuthenticated) {
      navigate(`/${slug}/agendar`);
    } else {
      navigate(`/${slug}/entrar?from=agendar`);
    }
  }

  return (
    <section id="servicos" className="max-w-195 mt-8 lg:mt-16">
      <div className="mb-4 flex justify-center lg:justify-start items-center gap-2">
        <Scissors size={18} />
        <h2 className="text-2xl md:text-4xl font-medium">Serviços</h2>
      </div>

      <div className="flex flex-col divide-y divide-zinc-300 overflow-hidden rounded-xl border border-zinc-300 dark:divide-neutral-800 dark:border-neutral-800">
        {services.map(service => (
          <div
            key={service.id}
            className="flex items-center justify-between gap-4 px-4 py-4"
          >
            {/* foto do serviço */}
            <div className="flex items-center gap-4">
              {service.image_url ? (
                <img
                  src={service.image_url}
                  alt={service.name}
                  className="h-14 w-14 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                  <Scissors size={20} className="text-neutral-400" />
                </div>
              )}

              {/* info */}
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="text-sm font-medium">{service.name}</span>
                {service.description && (
                  <span className="line-clamp-1 text-xs text-neutral-400">
                    {service.description}
                  </span>
                )}
                <div className="mt-0.5 flex items-center gap-2">
                  {service.duration_min != null && (
                    <span className="text-xs whitespace-nowrap text-neutral-500">
                      {formatDuration(service.duration_min)}
                    </span>
                  )}
                  {service.duration_min != null && service.price != null && (
                    <span className="text-xs text-neutral-300 dark:text-neutral-600">
                      ·
                    </span>
                  )}
                  {service.price != null && (
                    <span className="text-xs font-medium whitespace-nowrap text-neutral-700 dark:text-neutral-300">
                      {formatPrice(service.price)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* botão */}
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 rounded-full"
              onClick={() => handleAgendar(service)}
              disabled={isPreview}
            >
              Agendar
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
