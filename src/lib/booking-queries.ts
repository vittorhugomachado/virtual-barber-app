import { supabase } from "./supabase";

export async function getCurrentCustomer(barbershopId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: null };

  const { data, error } = await supabase
    .from("customers")
    .select("id, name, phone, email, created_at")
    .eq("auth_user_id", user.id)
    .eq("barbershop_id", barbershopId)
    .single();

  if (error) return { data: null, error };

  return { data, error: null };
}

export async function getCustomerAppointments(
  customerId: string,
  barbershopId: string,
) {
  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      id,
      status,
      starts_at,
      ends_at,
      notes,
      created_at,
      barbers ( id, name, avatar_url ),
      services ( id, name, price, duration_min )
    `,
    )
    .eq("barbershop_id", barbershopId)
    .eq("customer_id", customerId)
    .order("starts_at", { ascending: false });

  if (error) return { data: null, error };

  return { data: data ?? [], error: null };
}

export async function getAppointmentsForBarberOnDate(
  barbershopId: string,
  barberId: string,
  date: string,
) {
  const { data } = await supabase
    .from("appointments")
    .select("starts_at, ends_at, status")
    .eq("barbershop_id", barbershopId)
    .eq("barber_id", barberId)
    .gte("starts_at", `${date}T00:00:00`)
    .lte("starts_at", `${date}T23:59:59`);

  return (data ?? []).filter(
    a =>
      !["cancelled_by_customer", "cancelled_by_barbershop", "no_show"].includes(
        a.status,
      ),
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
