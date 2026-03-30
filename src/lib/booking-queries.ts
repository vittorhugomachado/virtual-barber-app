import { supabase } from "./supabase";

function getUtcRangeForLocalDate(date: string) {
  const start = new Date(`${date}T00:00:00`);
  const end = new Date(`${date}T00:00:00`);
  end.setDate(end.getDate() + 1);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

function isActiveAppointmentStatus(status: string) {
  return ![
    "cancelled_by_customer",
    "cancelled_by_barbershop",
    "no_show",
  ].includes(status);
}

async function getAppointmentsOnDateByField(
  field: "barber_id" | "customer_id",
  entityId: string,
  barbershopId: string,
  date: string,
) {
  const { start, end } = getUtcRangeForLocalDate(date);

  const { data, error } = await supabase
    .from("appointments")
    .select("starts_at, ends_at, status")
    .eq("barbershop_id", barbershopId)
    .eq(field, entityId)
    .gte("starts_at", start)
    .lt("starts_at", end);

  if (error) {
    console.error(`Erro ao buscar appointments por ${field}`, {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      barbershopId,
      entityId,
      date,
      start,
      end,
    });
    return [];
  }

  return (data ?? []).filter(a => isActiveAppointmentStatus(a.status)) as {
    starts_at: string;
    ends_at: string;
    status: string;
  }[];
}

export async function getCurrentCustomer() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: null };

  const { data, error } = await supabase
    .from("customers_auth")
    .select("id, name, phone, created_at")
    .eq("auth_user_id", user.id)
    .maybeSingle();

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
      service_name,
      service_price,
      service_duration,
      customer_name,
      barber_name,
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
  return getAppointmentsOnDateByField(
    "barber_id",
    barberId,
    barbershopId,
    date,
  );
}

export async function getAppointmentsForCustomerOnDate(
  barbershopId: string,
  customerId: string,
  date: string,
) {
  return getAppointmentsOnDateByField(
    "customer_id",
    customerId,
    barbershopId,
    date,
  );
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

export async function updateCustomerAppointmentStatus(
  appointmentId: string,
  customerId: string,
  barbershopId: string,
  status: "scheduled" | "completed" | "cancelled_by_customer" | "no_show",
) {
  const { data, error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", appointmentId)
    .eq("customer_id", customerId)
    .eq("barbershop_id", barbershopId)
    .select("id, status")
    .limit(1);

  if (error) {
    console.error("Erro ao atualizar status do agendamento do cliente", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      appointmentId,
      customerId,
      barbershopId,
      status,
    });
    return { data: null, error };
  }

  const updatedAppointment = data?.[0] ?? null;

  if (!updatedAppointment) {
    return {
      data: null,
      error: new Error(
        "Nenhum agendamento foi atualizado. Verifique se o registro pertence ao cliente autenticado e se a politica do banco permite esse update.",
      ),
    };
  }

  return { data: updatedAppointment, error: null };
}

export function getAppointmentErrorMessage(error: {
  code?: string | null;
  message?: string | null;
  details?: string | null;
}) {
  if (error.code === "23P01") {
    return "Esse horário acabou de ser ocupado. Escolha outro horário e tente novamente.";
  }

  if (error.code === "23514") {
    return "O horário informado é inválido para esse agendamento.";
  }

  return error.message || "Erro ao confirmar agendamento. Tente novamente.";
}
