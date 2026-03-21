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
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        subscription.unsubscribe();

        const barbershopId = localStorage.getItem("auth_barbershop_id");

        let { data: customerData } = await supabase
          .from("customers")
          .select("*")
          .eq("auth_user_id", session.user.id)
          .maybeSingle();

        if (!customerData) {
          const { data: inserted, error: insertError } = await supabase
            .from("customers")
            .insert({
              auth_user_id: session.user.id,
              email: session.user.email,
              name:
                session.user.user_metadata?.full_name ??
                session.user.email?.split("@")[0] ??
                "Usuário",
              barbershop_id: barbershopId || null,
              phone: null,
            })
            .select()
            .single();

          if (insertError) {
            const { data: existing } = await supabase
              .from("customers")
              .select("*")
              .eq("auth_user_id", session.user.id)
              .single();
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
        localStorage.removeItem("auth_barbershop_id");
        localStorage.removeItem("auth_from");

        navigate(from === "agendar" ? redirect + "/agendar" : redirect, {
          replace: true,
        });
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
