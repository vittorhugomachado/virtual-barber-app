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
    set => ({
      customer: null,
      isAuthenticated: false,
      isLoading: false,

      setCustomer: customer => set({ customer, isAuthenticated: true }),

      clearCustomer: options =>
        set(state => {
          if (state.customer?.auth && !options?.force) {
            return state;
          }

          return { customer: null, isAuthenticated: false };
        }),

      setLoading: loading => set({ isLoading: loading }),
    }),
    {
      name: "vb-auth",
      partialize: state => ({
        customer: state.customer,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
