import { ShoppingCart, X, Clock } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { useCart } from "../../../hooks/use-cart";
import { useAuthStore } from "@/app/store/auth-store";
import { useStyle } from "../../../contexts/style-context/style-context";
import { formatPrice } from "@/utils/format-price";
import { formatDuration } from "@/utils/format-duration";
import { darkenColor } from "@/utils/darken-color";

export function CartPanel() {
  const { style } = useStyle();
  const { items, removeService, total, totalDuration } = useCart();
  const { isAuthenticated } = useAuthStore();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  function handleAgendar() {
    if (isAuthenticated) {
      navigate(`/${slug}/agendar`);
    } else {
      navigate(`/${slug}/entrar?from=agendar`);
    }
  }

  return (
    <div className="lg:sticky lg:top-28 lg:w-80 lg:shrink-0 lg:pt-14">
      <div className="rounded-2xl border border-current/15 p-5 shadow-sm" style={{ backgroundColor: darkenColor(style.background_color, 0.15) }}>
        <div className="mb-4 flex items-center gap-2">
          <ShoppingCart size={16} className="text-current" />
          <span className="text-sm font-medium">
            Minha seleção
            {items.length > 0 && (
              <span className="ml-1.5 rounded-full px-2 py-0.5 text-xs" style={{ backgroundColor: style.background_color, color: style.text_color }}>
                {items.length}
              </span>
            )}
          </span>
        </div>

        {items.length === 0 ? (
          <p className="py-6 text-center text-sm text-current/70">
            Nenhum serviço selecionado
          </p>
        ) : (
          <>
            <ul className="flex flex-col gap-2">
              {items.map(service => (
                <li
                  key={service.id}
                  className="flex border-l-2 items-center justify-between gap-2 px-3 py-2.5"
                  style={{ borderColor: darkenColor(style.text_color, 0.15) }}
                >
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-sm font-medium">
                      {service.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {service.duration_min != null && (
                        <span className="flex items-center gap-1 text-xs text-current/50">
                          <Clock size={10} />
                          {formatDuration(service.duration_min)}
                        </span>
                      )}
                      {service.price != null && (
                        <span className="text-xs font-medium text-current/50">
                          {formatPrice(service.price)}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeService(service.id)}
                    className="shrink-0 rounded-full p-1 text-current transition-colors hover:bg-red-600 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between border-t border-current/15">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-current/50">Total</span>
                <span className="text-sm font-semibold">
                  {formatPrice(total)}
                </span>
              </div>
              {totalDuration > 0 && (
                <span className="flex items-center gap-1 text-xs text-current/50">
                  <Clock size={12} />
                  {formatDuration(totalDuration)}
                </span>
              )}
            </div>

            <Button
              className="mt-4 h-11 w-full rounded-full text-sm font-medium"
              style={{
                backgroundColor: style.primary_color,
                color: style.text_button_color,
              }}
              onClick={handleAgendar}
            >
              Agendar selecionados
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
