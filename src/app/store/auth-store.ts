import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Customer } from "@/app/themes/types";

interface AuthState {
  customer: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setCustomer: (customer: Customer) => void;
  clearCustomer: (options?: { force?: boolean }) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      customer: null,
      isAuthenticated: false,
      isLoading: false,

      setCustomer: customer => {
        console.log("[AUTH STORE] setCustomer chamado");
        console.log("[AUTH STORE] customer:", customer);

        set({
          customer,
          isAuthenticated: true,
        });

        console.log(
          "[AUTH STORE] estado após setCustomer:",
          get(),
        );
      },

      clearCustomer: options =>
        set(state => {
          console.log("[AUTH STORE] clearCustomer chamado");
          console.log("[AUTH STORE] options:", options);
          console.log("[AUTH STORE] estado atual:", state);

          if (state.customer?.auth && !options?.force) {
            console.log(
              "[AUTH STORE] clearCustomer BLOQUEADO pois customer.auth === true",
            );

            return state;
          }

          console.log("[AUTH STORE] limpando autenticação");

          return {
            customer: null,
            isAuthenticated: false,
          };
        }),

      setLoading: loading => {
        console.log("[AUTH STORE] setLoading:", loading);

        set({
          isLoading: loading,
        });

        console.log(
          "[AUTH STORE] estado após setLoading:",
          get(),
        );
      },
    }),
    {
      name: "vb-auth",

      partialize: state => {
        console.log(
          "[AUTH STORE] persistindo estado no localStorage:",
          {
            customer: state.customer,
            isAuthenticated: state.isAuthenticated,
          },
        );

        return {
          customer: state.customer,
          isAuthenticated: state.isAuthenticated,
        };
      },

      onRehydrateStorage: () => {
        console.log("[AUTH STORE] iniciando reidratação");

        return state => {
          console.log(
            "[AUTH STORE] estado reidratado do localStorage:",
            state,
          );
        };
      },
    },
  ),
);