import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import type { Customer } from "@/app/themes/types";

interface AuthStoreHandlers {
  setCustomer: (customer: Customer) => void;
  clearCustomer: (options?: { force?: boolean }) => void;
  setLoading: (loading: boolean) => void;
}

function normalizePhone(phone?: string | null) {
  return phone?.replace(/\D/g, "").replace(/^55/, "") ?? "";
}

function getAuthUserPhone(user: User) {
  return user.phone || user.user_metadata?.phone || null;
}

function getPhoneVariants(phone?: string | null) {
  const digits = phone?.replace(/\D/g, "") ?? "";

  if (!digits) {
    return [];
  }

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

function toCustomer(
  customer: {
    id: string;
    name: string | null;
    phone: string | null;
    barbershop_id: string | null;
    auth: boolean | null;
  },
  user: User,
): Customer {
  const authPhone = getAuthUserPhone(user);

  return {
    id: customer.id,
    name:
      customer.name ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      "",
    phone: customer.phone ?? normalizePhone(authPhone),
    auth: customer.auth === true,
    auth_user_id: user.id,
    barbershop_id:
      customer.barbershop_id ?? user.user_metadata?.barbershop_id ?? null,
  };
}

function getCustomerFromAuthMetadata(user: User): Customer | null {
  const customerId = user.user_metadata?.customer_id;

  if (!customerId) {
    return null;
  }

  return {
    id: customerId,
    name: user.user_metadata?.full_name || user.user_metadata?.name || "",
    phone: normalizePhone(getAuthUserPhone(user)),
    auth: true,
    auth_user_id: user.id,
    barbershop_id: user.user_metadata?.barbershop_id ?? null,
  };
}

export async function getCustomerFromAuthUser(
  user: User,
): Promise<{ data: Customer | null; error: Error | null }> {
  const customerId = user.user_metadata?.customer_id;

  if (customerId) {
    const { data: customer, error } = await supabase
      .from("customers")
      .select("id, name, phone, barbershop_id, auth")
      .eq("id", customerId)
      .eq("auth", true)
      .maybeSingle();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    if (customer) {
      return { data: toCustomer(customer, user), error: null };
    }
  }

  const authPhone = getAuthUserPhone(user);
  const phoneVariants = getPhoneVariants(authPhone);

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

  return { data: toCustomer(customer, user), error: null };
}

export async function syncAuthStoreWithSession(
  session: Session | null,
  handlers: AuthStoreHandlers,
) {
  handlers.setLoading(true);

  try {
    if (!session?.user) {
      handlers.clearCustomer({ force: true });
      return null;
    }

    const metadataCustomer = getCustomerFromAuthMetadata(session.user);
    const { data, error } = await getCustomerFromAuthUser(session.user);

    if (data) {
      handlers.setCustomer(data);
      return data;
    }

    if (metadataCustomer) {
      handlers.setCustomer(metadataCustomer);
      return metadataCustomer;
    }

    if (error) {
      handlers.clearCustomer({ force: true });
      return null;
    }

    handlers.clearCustomer({ force: true });
    return null;
  } finally {
    handlers.setLoading(false);
  }
}

export function subscribeToSupabaseAuth(handlers: AuthStoreHandlers) {
  let active = true;

  void supabase.auth.getSession().then(({ data: { session } }) => {
    if (!active) return;
    void syncAuthStoreWithSession(session, handlers);
  });

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    if (!active) return;
    void syncAuthStoreWithSession(session, handlers);
  });

  return () => {
    active = false;
    subscription.unsubscribe();
  };
}

export function getPostAuthRedirectPath(slug?: string, from?: string | null) {
  const safeSlug = slug?.trim();

  if (!safeSlug) {
    return "/";
  }

  return from === "agendar" ? `/${safeSlug}/agendar` : `/${safeSlug}`;
}
