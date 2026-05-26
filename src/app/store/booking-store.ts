// import { create } from "zustand";
// import type { Service, Barber } from "@/app/themes/types";
// 
// interface BookingStep {
//   service: Service | null;
//   date: string | null;
//   barber: Barber | null;
//   time: string | null;
// }
// 
// interface BookingState {
//   barbershopId: string | null;
//   barbershopSlug: string | null;
//   step: number;
//   selection: BookingStep;
// 
//   // actions
//   setBarbershop: (id: string, slug: string) => void;
//   setService: (service: Service) => void;
//   setDate: (date: string) => void;
//   setBarberAndTime: (barber: Barber, time: string) => void;
//   setStep: (step: number) => void;
//   resetBooking: () => void;
// }
// 
// const initialSelection: BookingStep = {
//   service: null,
//   date: null,
//   barber: null,
//   time: null,
// };
// 
// export const useBookingStore = create<BookingState>()(set => ({
//   barbershopId: null,
//   barbershopSlug: null,
//   step: 0,
//   selection: initialSelection,
// 
//   setBarbershop: (id, slug) => set({ barbershopId: id, barbershopSlug: slug }),
// 
//   setService: service =>
//     set(state => ({
//       selection: {
//         ...state.selection,
//         service,
//         date: null,
//         barber: null,
//         time: null,
//       },
//       step: 1,
//     })),
// 
//   setDate: date =>
//     set(state => ({
//       selection: { ...state.selection, date, barber: null, time: null },
//       step: 2,
//     })),
// 
//   setBarberAndTime: (barber, time) =>
//     set(state => ({
//       selection: { ...state.selection, barber, time },
//       step: 3,
//     })),
// 
//   setStep: step => set({ step }),
// 
//   resetBooking: () => set({ step: 0, selection: initialSelection }),
// }));
