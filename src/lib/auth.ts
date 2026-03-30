import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import type { Customer } from "../themes/types";

function normalizePhone(phone?: string | null) {
  return phone?.replace(/^\+?55/, "") ?? "";
}

export async function getCustomerFromAuthUser(
  user: User,
): Promise<{ data: Customer | null; error: Error | null }> {
  const { data: customerAuth, error } = await supabase
    .from("customers_auth")
    .select("id, name, phone, auth_user_id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  if (!customerAuth) {
    return { data: null, error: null };
  }

  return {
    data: {
      id: customerAuth.id,
      name:
        customerAuth.name ||
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        "",
      phone: customerAuth.phone ?? normalizePhone(user.phone),
      auth_user_id: user.id,
      barbershop_id: null,
    },
    error: null,
  };
}

export async function syncAuthStoreWithSession(
  session: Session | null,
  handlers: {
    setCustomer: (customer: Customer) => void;
    clearCustomer: () => void;
    setLoading: (loading: boolean) => void;
  },
) {
  handlers.setLoading(true);

  try {
    if (!session?.user) {
      handlers.clearCustomer();
      return;
    }

    const { data, error } = await getCustomerFromAuthUser(session.user);

    if (error || !data) {
      handlers.clearCustomer();
      return;
    }

    handlers.setCustomer(data);
  } finally {
    handlers.setLoading(false);
  }
}

export function getPostAuthRedirectPath(slug?: string, from?: string | null) {
  const safeSlug = slug?.trim();

  if (!safeSlug) {
    return "/";
  }

  return from === "agendar" ? `/${safeSlug}/agendar` : `/${safeSlug}`;
}
