import { ShoppingCart, X, Clock } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { useCart } from "../../../contexts/cart-context";
import { useAuthStore } from "../../../store/auth-store";
import { formatPrice } from "../../../utils/format-price";
import { formatDuration } from "../../../utils/format-duration";

interface CartPanelProps {
  primaryColor?: string;
  isPreview?: boolean;
}

export function CartPanel({ primaryColor, isPreview }: CartPanelProps) {
  const { items, removeService, total, totalDuration } = useCart();
  const { isAuthenticated } = useAuthStore();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  function handleAgendar() {
    if (isPreview) return;
    if (isAuthenticated) {
      navigate(`/${slug}/agendar`);
    } else {
      navigate(`/${slug}/entrar?from=agendar`);
    }
  }

  return (
    <div className="lg:w-80 lg:shrink-0 lg:sticky lg:top-28 pt-14">
      <div className="rounded-2xl border border-zinc-300 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mb-4 flex items-center gap-2">
          <ShoppingCart size={16} className="text-neutral-400" />
          <span className="text-sm font-medium">
            Minha seleção
            {items.length > 0 && (
              <span className="ml-1.5 rounded-full bg-neutral-100 px-2 py-0.5 text-xs dark:bg-neutral-800">
                {items.length}
              </span>
            )}
          </span>
        </div>

        {items.length === 0 ? (
          <p className="text-center text-sm text-neutral-400 py-6">
            Nenhum serviço selecionado
          </p>
        ) : (
          <>
            <ul className="flex flex-col gap-2">
              {items.map(service => (
                <li
                  key={service.id}
                  className="flex items-center justify-between gap-2 rounded-lg bg-neutral-50 px-3 py-2.5 dark:bg-neutral-800"
                >
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-sm font-medium">
                      {service.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {service.duration_min != null && (
                        <span className="flex items-center gap-1 text-xs text-neutral-400">
                          <Clock size={10} />
                          {formatDuration(service.duration_min)}
                        </span>
                      )}
                      {service.price != null && (
                        <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                          {formatPrice(service.price)}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeService(service.id)}
                    className="shrink-0 rounded-full p-1 text-neutral-400 transition-colors hover:bg-neutral-200 hover:text-neutral-700 dark:hover:bg-neutral-700"
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-neutral-400">Total estimado</span>
                <span className="text-sm font-semibold">{formatPrice(total)}</span>
              </div>
              {totalDuration > 0 && (
                <span className="flex items-center gap-1 text-xs text-neutral-400">
                  <Clock size={12} />
                  {formatDuration(totalDuration)}
                </span>
              )}
            </div>

            <Button
              className="mt-4 h-11 w-full rounded-full text-sm font-medium text-white"
              style={primaryColor ? { backgroundColor: primaryColor } : undefined}
              onClick={handleAgendar}
              disabled={isPreview}
            >
              Agendar selecionados
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
