import { useEffect, useState } from "react";
import type { BarberAvailability, OpeningHour } from "@/app/themes/types";
import {
  getAppointmentsForBarberOnDate,
  getAppointmentsForCustomerOnDate,
} from "@/app/lib/booking-queries";
import { getEffectivePeriodsForDay } from "@/utils/format-time";
import { getLocalTimeMinutes, toLocalDateKey } from "@/utils/date-time";

export interface SlotAppointment {
  starts_at: string;
  ends_at: string;
}

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

function getLocalDateString(date: Date) {
  return toLocalDateKey(date);
}

export function calculateAvailableSlots({
  date,
  totalDuration,
  openingHours,
  barberAvailability,
  barberAppointments,
  customerAppointments,
}: {
  date: string | null;
  totalDuration: number;
  openingHours: OpeningHour[];
  barberAvailability?: BarberAvailability[];
  barberAppointments: SlotAppointment[];
  customerAppointments: SlotAppointment[];
}) {
  if (!date || totalDuration === 0) {
    return [];
  }

  const dayOfWeek = new Date(date + "T12:00:00").getDay();
  const periods =
    barberAvailability && barberAvailability.length > 0
      ? getEffectivePeriodsForDay(dayOfWeek, openingHours, barberAvailability)
      : openingHours
          .filter(hour => hour.day_of_week === dayOfWeek && hour.is_open)
          .map(hour => ({ opens_at: hour.opens_at, closes_at: hour.closes_at }));

  if (periods.length === 0) {
    return [];
  }

  const now = new Date();
  const isToday = date === getLocalDateString(now);
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

      const overlapsAppointment = (appointment: SlotAppointment) => {
        const appointmentStart = getLocalTimeMinutes(appointment.starts_at);
        const appointmentEnd = getLocalTimeMinutes(appointment.ends_at);
        return current < appointmentEnd && slotEnd > appointmentStart;
      };

      const isBlocked =
        barberAppointments.some(overlapsAppointment) ||
        customerAppointments.some(overlapsAppointment);

      if (!isBlocked) {
        available.push(minutesToTime(current));
      }

      current += 30;
    }
  }

  return available;
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
        setLoading(false);
        return;
      }

      setLoading(true);

      const [barberAppointments, customerAppointments] = await Promise.all([
        getAppointmentsForBarberOnDate(barbershopId, barberId, date),
        customerId
          ? getAppointmentsForCustomerOnDate(barbershopId, customerId, date)
          : Promise.resolve([]),
      ]);

      setSlots(
        calculateAvailableSlots({
          date,
          totalDuration,
          openingHours,
          barberAvailability,
          barberAppointments,
          customerAppointments,
        }),
      );
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
