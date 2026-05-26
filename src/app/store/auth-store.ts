// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import type { Customer } from "@/app/themes/types";
// 
// interface AuthState {
//   customer: Customer | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
// 
//   setCustomer: (customer: Customer) => void;
//   clearCustomer: (options?: { force?: boolean }) => void;
//   setLoading: (loading: boolean) => void;
// }
// 
// export const useAuthStore = create<AuthState>()(
//   persist(
//     set => ({
//       customer: null,
//       isAuthenticated: false,
//       isLoading: true,
// 
//       setCustomer: customer =>
//         set({
//           customer,
//           isAuthenticated: true,
//         }),
// 
//       clearCustomer: () =>
//         set({
//           customer: null,
//           isAuthenticated: false,
//         }),
// 
//       setLoading: isLoading => set({ isLoading }),
//     }),
//     {
//       name: "vb-auth",
//       partialize: state => ({
//         customer: state.customer,
//         isAuthenticated: state.isAuthenticated,
//       }),
//     },
//   ),
// );
