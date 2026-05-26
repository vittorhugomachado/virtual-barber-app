import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import type {
  ServiceBookingSlots,
  UseBookingSlotsParams,
} from "../themes/types";

export function useBookingSlots({
  barbershopId,
  customerId,
  date,
  services,
}: UseBookingSlotsParams) {
  const [data, setData] = useState<ServiceBookingSlots[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const serviceIds = useMemo(
    () => services.map(service => service.id),
    [services],
  );

  const enabled =
    !!barbershopId && !!customerId && !!date && serviceIds.length > 0;

  useEffect(() => {
    if (!enabled) return;

    async function loadBookingSlots() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc("vb_get_booking_slots", {
        p_barbershop_id: barbershopId,
        p_customer_id: customerId,
        p_date: date,
        p_service_ids: serviceIds,
      });

      if (error) {
        setError(error.message);
        setData([]);
        setLoading(false);
        return;
      }

      setData((data ?? []) as ServiceBookingSlots[]);
      setLoading(false);
    }

    void loadBookingSlots();
  }, [enabled, barbershopId, customerId, date, serviceIds]);

  return {
    data: enabled ? data : [],
    loading: enabled ? loading : false,
    error: enabled ? error : null,
  };
}
