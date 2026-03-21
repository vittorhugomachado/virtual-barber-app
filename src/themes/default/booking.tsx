import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth-store";
import { useBookingStore } from "../../store/booking-store";
import type { BarbershopPageProps } from "../types";

export default function DefaultBookingPage({ id, slug }: BarbershopPageProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { setBarbershop } = useBookingStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/${slug}/entrar?from=agendar`);
    }
  }, [isAuthenticated, slug, navigate]);

  useEffect(() => {
    setBarbershop(id, slug);
  }, [id, slug, setBarbershop]);

  return (
    <div className="min-h-screen">
      <h1>Agendamento</h1>
      {/* BookingFlow vai aqui */}
    </div>
  );
}
