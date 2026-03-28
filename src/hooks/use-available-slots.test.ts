import { afterEach, describe, expect, it, vi } from "vitest";
import { calculateAvailableSlots, type SlotAppointment } from "./use-available-slots";
import type { BarberAvailability, OpeningHour } from "../themes/types";

const openingHours: OpeningHour[] = [
  {
    id: "monday-morning",
    day_of_week: 1,
    opens_at: "09:00:00",
    closes_at: "12:00:00",
    period_order: 1,
    is_open: true,
  },
];

function makeAppointment(startsAt: string, endsAt: string): SlotAppointment {
  return {
    starts_at: startsAt,
    ends_at: endsAt,
  };
}

describe("calculateAvailableSlots", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns only slots that do not overlap barber or customer appointments", () => {
    const barberAppointments = [
      makeAppointment("2026-03-30T09:30:00", "2026-03-30T10:00:00"),
    ];
    const customerAppointments = [
      makeAppointment("2026-03-30T10:30:00", "2026-03-30T11:00:00"),
    ];

    const slots = calculateAvailableSlots({
      date: "2026-03-30",
      totalDuration: 30,
      openingHours,
      barberAppointments,
      customerAppointments,
    });

    expect(slots).toEqual(["09:00", "10:00", "11:00", "11:30"]);
  });

  it("respects custom barber availability over shop opening hours", () => {
    const barberAvailability: BarberAvailability[] = [
      {
        id: "availability-1",
        barber_id: "barber-1",
        barbershop_id: "shop-1",
        day_of_week: 1,
        is_day_off: false,
        use_custom_hours: true,
        starts_at: "10:00:00",
        ends_at: "11:00:00",
        period_order: 1,
      },
    ];

    const slots = calculateAvailableSlots({
      date: "2026-03-30",
      totalDuration: 30,
      openingHours,
      barberAvailability,
      barberAppointments: [],
      customerAppointments: [],
    });

    expect(slots).toEqual(["10:00", "10:30"]);
  });

  it("respects explicit barber hours even when use_custom_hours is false", () => {
    const barberAvailability: BarberAvailability[] = [
      {
        id: "availability-2",
        barber_id: "barber-1",
        barbershop_id: "shop-1",
        day_of_week: 1,
        is_day_off: false,
        use_custom_hours: false,
        starts_at: "09:30:00",
        ends_at: "13:30:00",
        period_order: 1,
      },
    ];

    const slots = calculateAvailableSlots({
      date: "2026-03-30",
      totalDuration: 120,
      openingHours,
      barberAvailability,
      barberAppointments: [],
      customerAppointments: [],
    });

    expect(slots).toEqual(["09:30", "10:00", "10:30", "11:00", "11:30"]);
  });

  it("removes past slots for the current local day", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 30, 10, 15, 0));

    const slots = calculateAvailableSlots({
      date: "2026-03-30",
      totalDuration: 30,
      openingHours,
      barberAppointments: [],
      customerAppointments: [],
    });

    expect(slots).toEqual(["10:30", "11:00", "11:30"]);
  });

  it("returns an empty list when there is no valid date or duration", () => {
    expect(
      calculateAvailableSlots({
        date: null,
        totalDuration: 30,
        openingHours,
        barberAppointments: [],
        customerAppointments: [],
      }),
    ).toEqual([]);

    expect(
      calculateAvailableSlots({
        date: "2026-03-30",
        totalDuration: 0,
        openingHours,
        barberAppointments: [],
        customerAppointments: [],
      }),
    ).toEqual([]);
  });
});
