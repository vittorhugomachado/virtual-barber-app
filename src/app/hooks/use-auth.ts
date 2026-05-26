// import { useAuthStore } from "@/app/store/auth-store";
// import { supabase } from "@/app/lib/supabase";
// 
// export function useAuth() {
//   const { customer, isAuthenticated, isLoading, clearCustomer, setLoading } =
//     useAuthStore();
//   async function signOut() {
//     setLoading(true);
//     await supabase.auth.signOut();
//     clearCustomer({ force: true });
//     setLoading(false);
//   }
// 
//   return {
//     customer,
//     isAuthenticated,
//     isLoading,
//     signOut,
//   };
// }
