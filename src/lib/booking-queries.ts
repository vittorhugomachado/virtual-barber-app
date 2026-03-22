import { supabase } from "./supabase";

export async function getAppointmentsForBarberOnDate(
  barbershopId: string,
  barberId: string,
  date: string, // YYYY-MM-DD
) {
  const { data } = await supabase
    .from("appointments")
    .select("starts_at, ends_at")
    .eq("barbershop_id", barbershopId)
    .eq("barber_id", barberId)
    .gte("starts_at", `${date}T00:00:00`)
    .lte("starts_at", `${date}T23:59:59`)
    .in("status", ["scheduled", "confirmed"]);

  return (data ?? []) as { starts_at: string; ends_at: string }[];
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
  const { data, error } = await supabase
    .from("appointments")
    .insert(appointments.map(a => ({ ...a, status: "scheduled" })))
    .select();

  return { data, error };
}
