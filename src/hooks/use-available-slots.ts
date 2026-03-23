import { useState, useEffect } from "react";
import type { OpeningHour } from "../themes/types";
import { getAppointmentsForBarberOnDate } from "../lib/booking-queries";

function timeToMinutes(time: string) {
  const [h, m] = time.slice(0, 5).split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number) {
  const h = Math.floor(minutes / 60).toString().padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

export function useAvailableSlots({
  barbershopId,
  barberId,
  date,
  totalDuration,
  openingHours,
}: {
  barbershopId: string;
  barberId: string | null;
  date: string | null;
  totalDuration: number;
  openingHours: OpeningHour[];
}) {
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!barberId || !date || totalDuration === 0) {
      setSlots([]);
      return;
    }

    async function load() {
      setLoading(true);

      const dayOfWeek = new Date(date + "T12:00:00").getDay();
      const periods = openingHours.filter(
        h => h.day_of_week === dayOfWeek && h.is_open,
      );

      if (periods.length === 0) {
        setSlots([]);
        setLoading(false);
        return;
      }

      const appointments = await getAppointmentsForBarberOnDate(
        barbershopId,
        barberId!,
        date!,
      );

      const now = new Date();
      const isToday = date === now.toISOString().slice(0, 10);
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const available: string[] = [];

      for (const period of periods) {
        const openMin = timeToMinutes(period.opens_at);
        const closeMin = timeToMinutes(period.closes_at);
        let current = openMin;

        while (current + totalDuration <= closeMin) {
          const slotEnd = current + totalDuration;

          if (isToday && current <= currentMinutes) {
            current += 30;
            continue;
          }

          const isBlocked = appointments.some(appt => {
            const apptStart = timeToMinutes(appt.starts_at.slice(11, 16));
            const apptEnd = timeToMinutes(appt.ends_at.slice(11, 16));
            return current < apptEnd && slotEnd > apptStart;
          });

          if (!isBlocked) available.push(minutesToTime(current));
          current += 30;
        }
      }

      setSlots(available);
      setLoading(false);
    }

    load();
  }, [barberId, date, totalDuration, barbershopId, openingHours]);

  return { slots, loading };
}
