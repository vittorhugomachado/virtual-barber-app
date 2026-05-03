import { useMemo, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Plus, Scissors } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useCart } from "../../../hooks/use-cart";
import type { Service } from "../../types";
import { formatPrice } from "@/utils/format-price";
import { formatDuration } from "@/utils/format-duration";
import { useBarbershopData } from "../../../contexts/barbershop-data/barbershop-data-context";
import { useStyle } from "../../../contexts/style-context/style-context";

const SERVICES_PER_PAGE = 10;
const SERVICES_SCROLL_OFFSET = 140;

export function Services() {
  const { services } = useBarbershopData();
  const { addService, removeService, hasService } = useCart();
  const { style } = useStyle();
  const [currentPage, setCurrentPage] = useState(1);
  const servicesTopRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(services.length / SERVICES_PER_PAGE);
  const safeCurrentPage =
    totalPages > 0 ? Math.min(currentPage, totalPages) : 1;

  const paginatedServices = useMemo(() => {
    const start = (safeCurrentPage - 1) * SERVICES_PER_PAGE;
    return services.slice(start, start + SERVICES_PER_PAGE);
  }, [safeCurrentPage, services]);

  if (!services.length) return null;

  function handleToggle(service: Service) {
    if (hasService(service.id)) {
      removeService(service.id);
    } else {
      addService(service);
    }
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);

    if (!servicesTopRef.current) return;

    const top =
      servicesTopRef.current.getBoundingClientRect().top +
      window.scrollY -
      SERVICES_SCROLL_OFFSET;

    window.scrollTo({
      top: Math.max(top, 0),
      behavior: "smooth",
    });
  }

  return (
    <div ref={servicesTopRef} className="flex-1 scroll-mt-36">
      <div className="mb-4 flex items-center justify-center gap-2 lg:justify-start">
        <Scissors size={18} />
        <h2 className="text-2xl font-medium md:text-4xl">Serviços</h2>
      </div>

      <div className="flex flex-col divide-y divide-current/10 overflow-hidden rounded-xl border border-current/10">
        {paginatedServices.map(service => {
          const inCart = hasService(service.id);
          return (
            <div
              key={service.id}
              className="flex items-center justify-between gap-4 px-4 py-4"
            >
              <div className="flex items-center gap-4">
                {service.image_url ? (
                  <img
                    src={service.image_url}
                    alt={service.name}
                    className="h-14 w-14 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-current/20">
                    <Scissors size={20} className="text-current" />
                  </div>
                )}

                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-sm font-medium">{service.name}</span>
                  {service.description && (
                    <span className="line-clamp-1 text-xs text-current/60">
                      {service.description}
                    </span>
                  )}
                  <div className="mt-0.5 flex items-center gap-2">
                    {service.duration_min != null && (
                      <span className="text-xs whitespace-nowrap text-current/60">
                        {formatDuration(service.duration_min)}
                      </span>
                    )}
                    {service.duration_min != null && service.price != null && (
                      <span className="text-xs text-current">
                        |
                      </span>
                    )}
                    {service.price != null && (
                      <span className="text-xs font-medium whitespace-nowrap text-current">
                        {formatPrice(service.price)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <Button
                size="sm"
                className="shrink-0 rounded-full"
                variant={inCart ? "default" : "outline"}
                style={
                  inCart
                    ? { backgroundColor: style.primary_color, color: style.text_button_color }
                    : { border: "1px solid" }
                }
                onClick={() => handleToggle(service)}
              >
                {inCart ? (
                  <>
                    <Check size={14} className="md:mr-1" />
                    <span className="hidden md:block"> Adicionado</span>
                  </>
                ) : (
                  <>
                    <Plus size={14} className="md:mr-1" />
                    <span className="hidden md:block"> Adicionado</span>
                  </>
                )}
              </Button>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <span className="text-sm text-current/60">
            Página {safeCurrentPage} de {totalPages}
          </span>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="icon-sm"
              variant="outline"
              aria-label="Página anterior"
              disabled={safeCurrentPage === 1}
              onClick={() => handlePageChange(Math.max(1, safeCurrentPage - 1))}
            >
              <ChevronLeft size={16} />
            </Button>

            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              const isCurrentPage = page === safeCurrentPage;

              return (
                <Button
                  key={page}
                  type="button"
                  size="sm"
                  variant={isCurrentPage ? "default" : "outline"}
                  aria-current={isCurrentPage ? "page" : undefined}
                  className="min-w-8 rounded-full"
                  style={
                    isCurrentPage
                      ? {
                          backgroundColor: style.primary_color,
                          color: style.text_button_color,
                        }
                      : { border: "1px solid" }
                  }
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              );
            })}

            <Button
              type="button"
              size="icon-sm"
              variant="outline"
              aria-label="Próxima página"
              disabled={safeCurrentPage === totalPages}
              onClick={() =>
                handlePageChange(Math.min(totalPages, safeCurrentPage + 1))
              }
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
