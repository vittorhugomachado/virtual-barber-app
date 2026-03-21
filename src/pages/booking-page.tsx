import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth-store";
import { useBookingStore } from "../store/booking-store";
import { useBarbershop } from "../hooks/use-barbershop";
import { NotFoundPage } from "./not-found-page";

export function BookingPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { setBarbershop } = useBookingStore();
  const { data, isLoading, error } = useBarbershop(slug ?? "");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/${slug}/entrar?from=agendar`, { replace: true });
    }
  }, [isAuthenticated, slug, navigate]);

  useEffect(() => {
    if (data) {
      setBarbershop(data.id, data.slug);
    }
  }, [data, setBarbershop]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-800" />
      </div>
    );
  }

  if (error || !data) return <NotFoundPage />;

  return (
    <div className="min-h-screen">
      <h1 className="text-8xl">Agendamento</h1>
      {/* BookingFlow vai aqui — implementado em components/booking/ */}
    </div>
  );
}
