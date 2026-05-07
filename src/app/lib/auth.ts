import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import type { Customer } from "@/app/themes/types";

function normalizePhone(phone?: string | null) {
  return phone?.replace(/\D/g, "").replace(/^55/, "") ?? "";
}

function getPhoneVariants(phone?: string | null) {
  const digits = phone?.replace(/\D/g, "") ?? "";
  const normalized = digits.startsWith("55") ? digits : `55${digits}`;
  const variants = new Set([normalized]);

  if (normalized.startsWith("55") && normalized.length === 13) {
    variants.add(`${normalized.slice(0, 4)}${normalized.slice(5)}`);
  }

  if (normalized.startsWith("55") && normalized.length === 12) {
    variants.add(`${normalized.slice(0, 4)}9${normalized.slice(4)}`);
  }

  variants.add(normalizePhone(normalized));

  return Array.from(variants).filter(Boolean);
}

export async function getCustomerFromAuthUser(
  user: User,
): Promise<{ data: Customer | null; error: Error | null }> {
  const phoneVariants = getPhoneVariants(user.phone);

  if (phoneVariants.length === 0) {
    return { data: null, error: null };
  }

  const { data: customer, error } = await supabase
    .from("customers")
    .select("id, name, phone, barbershop_id, auth")
    .eq("auth", true)
    .in("phone", phoneVariants)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  if (!customer) {
    return { data: null, error: null };
  }

  return {
    data: {
      id: customer.id,
      name:
        customer.name ||
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        "",
      phone: customer.phone ?? normalizePhone(user.phone),
      auth: customer.auth === true,
      auth_user_id: null,
      barbershop_id: customer.barbershop_id,
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
