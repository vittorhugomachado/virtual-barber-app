import { useBookingStore } from '@/app/store/booking-store'
import { useAuthStore } from '@/app/store/auth-store'
import { createAppointments, getAppointmentErrorMessage } from '@/app/lib/booking-queries'

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

    const duration = selection.service.duration_min ?? 30
    const startsAt = new Date(`${selection.date}T${selection.time}:00`)
    const endsAt = new Date(startsAt.getTime() + duration * 60000)

    const { error } = await createAppointments([{
      barbershop_id: barbershopId,
      customer_id: customer.id,
      barber_id: selection.barber.id,
      service_id: selection.service.id,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
    }])

    if (error) return { success: false, error: getAppointmentErrorMessage(error) }

    booking.resetBooking()
    return { success: true, error: null }
  }

  return {
    ...booking,
    confirmBooking,
  }
}