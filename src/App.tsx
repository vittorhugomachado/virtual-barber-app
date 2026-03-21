import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BarbershopPage } from "./pages/barbershop-page";
import { BookingPage } from "./pages/booking-page";
import { ProfilePage } from "./pages/profile-page";
import { NotFoundPage } from "./pages/not-found-page";
import { AuthPage } from "./pages/auth-page";
import { AuthCallbackPage } from "./pages/auth-callback-page";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/404" replace />} />
        <Route path="/:slug" element={<BarbershopPage />} />
        <Route path="/:slug/agendar" element={<BookingPage />} />
        <Route path="/:slug/perfil" element={<ProfilePage />} />
        <Route path="/:slug/entrar" element={<AuthPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/:slug/auth/callback" element={<AuthCallbackPage />} />
        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
