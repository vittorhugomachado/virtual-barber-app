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

      let { data: customerData } = await supabase
        .from("customers")
        .select("*")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (!customerData) {
        const { data: inserted, error: insertError } = await supabase
          .from("customers")
          .insert({
            auth_user_id: user.id,
            email: user.email,
            name:
              user.user_metadata?.full_name ??
              user.user_metadata?.name ??
              user.email?.split("@")[0] ??
              "Usuário",
            phone: null,
          })
          .select()
          .single();

        if (insertError) {
          console.error("[auth-callback] erro ao inserir customer:", insertError);
          const { data: existing } = await supabase
            .from("customers")
            .select("*")
            .eq("auth_user_id", user.id)
            .maybeSingle();
          customerData = existing;
        } else {
          customerData = inserted;
        }
      }

      if (customerData) {
        const c: Customer = {
          id: customerData.id,
          name: customerData.name,
          phone: customerData.phone,
          email: customerData.email,
          auth_user_id: customerData.auth_user_id,
          barbershop_id: customerData.barbershop_id,
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
          <p className="text-sm text-neutral-500">{customer.email}</p>
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
