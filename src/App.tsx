import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { BarbershopPage } from './pages/barbershop-page'
import { BookingPage } from './pages/booking-page'
import { ProfilePage } from './pages/profile-page'
import { NotFoundPage } from './pages/not-found-page'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* rota raiz — redireciona para 404 */}
        <Route path="/" element={<Navigate to="/404" replace />} />

        {/* página pública da barbearia */}
        <Route path="/:slug" element={<BarbershopPage />} />

        {/* agendamento */}
        <Route path="/:slug/agendar" element={<BookingPage />} />

        {/* perfil do cliente */}
        <Route path="/:slug/perfil" element={<ProfilePage />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}