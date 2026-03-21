import { useAuthStore } from '../store/auth-store'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const { customer, isAuthenticated, isLoading, clearCustomer, setLoading } =
    useAuthStore()

  async function signOut() {
    setLoading(true)
    await supabase.auth.signOut()
    clearCustomer()
    setLoading(false)
  }

  return {
    customer,
    isAuthenticated,
    isLoading,
    signOut,
  }
}