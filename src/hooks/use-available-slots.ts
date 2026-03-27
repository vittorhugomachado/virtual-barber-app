import { useState, useEffect } from "react";
import type { BarberAvailability, OpeningHour } from "../themes/types";
import {
  getAppointmentsForBarberOnDate,
  getAppointmentsForCustomerOnDate,
} from "../lib/booking-queries";
import { getEffectivePeriodsForDay } from "../utils/format-time";

function timeToMinutes(time: string) {
  const [h, m] = time.slice(0, 5).split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number) {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

export function useAvailableSlots({
  barbershopId,
  barberId,
  customerId,
  date,
  totalDuration,
  openingHours,
  barberAvailability,
}: {
  barbershopId: string;
  barberId: string | null;
  customerId?: string | null;
  date: string | null;
  totalDuration: number;
  openingHours: OpeningHour[];
  barberAvailability?: BarberAvailability[];
}) {
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!barberId || !date || totalDuration === 0) {
        setSlots([]);
        return;
      }

      setLoading(true);

      const dayOfWeek = new Date(date + "T12:00:00").getDay();
      const periods =
        barberAvailability && barberAvailability.length > 0
          ? getEffectivePeriodsForDay(
              dayOfWeek,
              openingHours,
              barberAvailability,
            )
          : openingHours
              .filter(h => h.day_of_week === dayOfWeek && h.is_open)
              .map(h => ({ opens_at: h.opens_at, closes_at: h.closes_at }));

      if (periods.length === 0) {
        setSlots([]);
        setLoading(false);
        return;
      }

      const [barberAppointments, customerAppointments] = await Promise.all([
        getAppointmentsForBarberOnDate(barbershopId, barberId, date),
        customerId
          ? getAppointmentsForCustomerOnDate(barbershopId, customerId, date)
          : Promise.resolve([]),
      ]);
      console.log(barberAppointments);
      const now = new Date();
      const isToday = date === now.toISOString().slice(0, 10);
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const available: string[] = [];

      for (const period of periods) {
        const openMin = timeToMinutes(period.opens_at.slice(0, 5));
        const closeMin = timeToMinutes(period.closes_at.slice(0, 5));
        let current = openMin;

        while (current + totalDuration <= closeMin) {
          const slotEnd = current + totalDuration;

          if (isToday && current <= currentMinutes) {
            current += 30;
            continue;
          }

          const overlapsAppointment = (appt: {
            starts_at: string;
            ends_at: string;
          }) => {
            const apptStart = timeToMinutes(appt.starts_at.slice(11, 16));
            const apptEnd = timeToMinutes(appt.ends_at.slice(11, 16));
            return current < apptEnd && slotEnd > apptStart;
          };

          const isBlocked =
            barberAppointments.some(overlapsAppointment) ||
            customerAppointments.some(overlapsAppointment);

          if (!isBlocked) available.push(minutesToTime(current));
          current += 30;
        }
      }

      setSlots(available);
      setLoading(false);
    }

    void load();
  }, [
    barberId,
    customerId,
    date,
    totalDuration,
    barbershopId,
    openingHours,
    barberAvailability,
  ]);

  return { slots, loading };
}
