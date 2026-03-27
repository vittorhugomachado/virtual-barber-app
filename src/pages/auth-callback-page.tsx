import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/auth-store";
import type { Customer } from "../themes/types";

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const { setCustomer } = useAuthStore();
  const [customer, setLocalCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    let handled = false;

    async function handleSession(user: { id: string; email?: string; user_metadata?: Record<string, string> }) {
      if (handled) return;
      handled = true;

      const { data: customerData } = await supabase
        .from("customers_auth")
        .upsert(
          {
            auth_user_id: user.id,
            name:
              user.user_metadata?.full_name ??
              user.user_metadata?.name ??
              "",
          },
          { onConflict: "auth_user_id", ignoreDuplicates: true },
        )
        .select("id, name, phone, auth_user_id")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (customerData) {
        const c: Customer = {
          id: customerData.id,
          name: customerData.name,
          phone: customerData.phone,
          auth_user_id: customerData.auth_user_id,
        };
        setCustomer(c);
        setLocalCustomer(c);
      }

      const redirect = localStorage.getItem("auth_redirect") ?? "/";
      const from = localStorage.getItem("auth_from");
      localStorage.removeItem("auth_redirect");
      localStorage.removeItem("auth_from");

      navigate(from === "agendar" ? redirect + "/agendar" : redirect, {
        replace: true,
      });
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session?.user) {
        subscription.unsubscribe();
        handleSession(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, setCustomer]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-800" />
      {customer ? (
        <div className="text-center">
          <p className="text-lg font-semibold">{customer.name}</p>
          {customer.phone && (
            <p className="text-sm text-neutral-500">{customer.phone}</p>
          )}
        </div>
      ) : (
        <p className="text-sm text-neutral-500">Autenticando...</p>
      )}
    </div>
  );
}
