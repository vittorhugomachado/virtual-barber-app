// src/store/barbershopStore.ts

import { create } from 'zustand'
import type { BarbershopPageProps } from '../themes/types'

interface BarbershopState {
  data: (BarbershopPageProps & { plan: string }) | null
  isLoading: boolean
  error: string | null

  // actions
  setData: (data: BarbershopPageProps & { plan: string }) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearData: () => void
}

export const useBarbershopStore = create<BarbershopState>()((set) => ({
  data: null,
  isLoading: false,
  error: null,

  setData: (data) => set({ data, error: null }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearData: () => set({ data: null, error: null }),
}))