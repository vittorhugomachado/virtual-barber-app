import { useBookingStore } from '../store/booking-store'
import { useAuthStore } from '../store/auth-store'
import { supabase } from '../lib/supabase'

export function useBooking() {
  const booking = useBookingStore()
  const { customer } = useAuthStore()

  async function confirmBooking() {
    const { barbershopId, selection } = booking

    if (
      !barbershopId ||
      !selection.service ||
      !selection.date ||
      !selection.barber ||
      !selection.time ||
      !customer
    ) {
      return { success: false, error: 'Dados incompletos' }
    }

    // monta starts_at e ends_at
    const startsAt = new Date(`${selection.date}T${selection.time}:00`)
    const endsAt = new Date(
      startsAt.getTime() + (selection.service.duration_min ?? 30) * 60000
    )

    const { error } = await supabase.from('appointments').insert({
      barbershop_id: barbershopId,
      customer_id: customer.id,
      barber_id: selection.barber.id,
      service_id: selection.service.id,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      status: 'scheduled',
    })

    if (error) return { success: false, error: error.message }

    booking.resetBooking()
    return { success: true, error: null }
  }

  return {
    ...booking,
    confirmBooking,
  }
}