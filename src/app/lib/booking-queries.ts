import { supabase } from "./supabase";

export async function getCurrentCustomer() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: null };

  const digits = user.phone?.replace(/\D/g, "") ?? "";
  const phone = digits.startsWith("55") ? digits : `55${digits}`;

  const { data, error } = await supabase
    .from("customers")
    .select("id, name, phone, created_at, barbershop_id, auth")
    .eq("auth", true)
    .eq("phone", phone)
    .maybeSingle();

  if (error) return { data: null, error };

  return { data, error: null };
}

export async function getCustomerAppointments(barbershopId: string) {
  const { data, error } = await supabase.rpc("vb_get_customer_appointments", {
    p_barbershop_id: barbershopId,
  });

  if (error) return { data: null, error };

  return { data: data ?? [], error: null };
}

export async function updateCustomerAppointmentStatus(
  appointmentId: string,
  _customerId: string,
  barbershopId: string,
  status: "scheduled" | "completed" | "cancelled_by_customer" | "no_show",
) {
  if (status !== "cancelled_by_customer") {
    return {
      data: null,
      error: new Error("Cliente só pode cancelar o próprio agendamento."),
    };
  }

  const { data, error } = await supabase.rpc(
    "vb_cancel_customer_appointment",
    {
      p_appointment_id: appointmentId,
      p_barbershop_id: barbershopId,
    },
  );

  if (error) return { data: null, error };

  return { data, error: null };
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
