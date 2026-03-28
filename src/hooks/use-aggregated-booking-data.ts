import { useEffect, useMemo, useState } from "react";
import {
  getAppointmentsForBarberOnDate,
  getAppointmentsForCustomerOnDate,
} from "../lib/booking-queries";
import type { Barber, OpeningHour, Service } from "../themes/types";
import {
  calculateAvailableSlots,
  type SlotAppointment,
} from "./use-available-slots";

type SlotsByService = Record<string, Record<string, string[]>>;

interface UseAggregatedBookingDataParams {
  barbershopId: string;
  customerId?: string | null;
  date: string | null;
  services: Service[];
  barbers: Barber[];
  openingHours: OpeningHour[];
}

export function useAggregatedBookingData({
  barbershopId,
  customerId,
  date,
  services,
  barbers,
  openingHours,
}: UseAggregatedBookingDataParams) {
  const [loading, setLoading] = useState(false);
  const [customerAppointments, setCustomerAppointments] = useState<
    SlotAppointment[]
  >([]);
  const [appointmentsByBarber, setAppointmentsByBarber] = useState<
    Record<string, SlotAppointment[]>
  >({});

  const eligibleBarbers = useMemo(
    () =>
      barbers.filter(barber =>
        services.some(service => barber.serviceIds.includes(service.id)),
      ),
    [barbers, services],
  );

  useEffect(() => {
    let isActive = true;

    async function load() {
      if (!date || services.length === 0 || eligibleBarbers.length === 0) {
        if (!isActive) {
          return;
        }

        setAppointmentsByBarber({});
        setCustomerAppointments([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const [barberResults, customerResults] = await Promise.all([
          Promise.all(
            eligibleBarbers.map(async barber => ({
              barberId: barber.id,
              appointments: await getAppointmentsForBarberOnDate(
                barbershopId,
                barber.id,
                date,
              ),
            })),
          ),
          customerId
            ? getAppointmentsForCustomerOnDate(barbershopId, customerId, date)
            : Promise.resolve([]),
        ]);

        if (!isActive) {
          return;
        }

        setAppointmentsByBarber(
          Object.fromEntries(
            barberResults.map(({ barberId, appointments }) => [
              barberId,
              appointments,
            ]),
          ),
        );
        setCustomerAppointments(customerResults);
      } catch (error) {
        console.error("Failed to aggregate booking data", error);

        if (!isActive) {
          return;
        }

        setAppointmentsByBarber({});
        setCustomerAppointments([]);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      isActive = false;
    };
  }, [barbershopId, customerId, date, eligibleBarbers, services.length]);

  const slotsByService = useMemo<SlotsByService>(() => {
    if (!date || services.length === 0 || eligibleBarbers.length === 0) {
      return {};
    }

    return Object.fromEntries(
      services.map(service => {
        const duration = service.duration_min ?? 30;
        const serviceBarbers = eligibleBarbers.filter(barber =>
          barber.serviceIds.includes(service.id),
        );

        return [
          service.id,
          Object.fromEntries(
            serviceBarbers.map(barber => [
              barber.id,
              calculateAvailableSlots({
                date,
                totalDuration: duration,
                openingHours,
                barberAvailability: barber.availability,
                barberAppointments: appointmentsByBarber[barber.id] ?? [],
                customerAppointments,
              }),
            ]),
          ),
        ];
      }),
    );
  }, [
    appointmentsByBarber,
    customerAppointments,
    date,
    eligibleBarbers,
    openingHours,
    services,
  ]);

  return { slotsByService, loading };
}
