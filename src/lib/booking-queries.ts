import { supabase } from "./supabase";

export async function getAppointmentsForBarberOnDate(
  barbershopId: string,
  barberId: string,
  date: string, // YYYY-MM-DD
) {
  const { data } = await supabase
    .from("appointments")
    .select("starts_at, ends_at, status")
    .eq("barbershop_id", barbershopId)
    .eq("barber_id", barberId)
    .gte("starts_at", `${date}T00:00:00`)
    .lte("starts_at", `${date}T23:59:59`);

  return (data ?? []).filter(a =>
    a.status === "scheduled" || a.status === "confirmed",
  ) as { starts_at: string; ends_at: string; status: string }[];
}

export async function createAppointments(
  appointments: {
    barbershop_id: string;
    barber_id: string;
    service_id: string;
    customer_id: string;
    starts_at: string;
    ends_at: string;
  }[],
) {
  const { error } = await supabase
    .from("appointments")
    .insert(appointments.map(a => ({ ...a, status: "scheduled" })));

  return { error };
}
