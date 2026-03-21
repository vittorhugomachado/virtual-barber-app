import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NotFoundPage } from "./pages/not-found-page";
import { AuthCallbackPage } from "./pages/auth-callback-page";
import { ThemeResolver } from "./themes/resolver";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/404" replace />} />
        <Route path="/:slug"          element={<ThemeResolver page="home" />} />
        <Route path="/:slug/agendar"  element={<ThemeResolver page="booking" />} />
        <Route path="/:slug/perfil"   element={<ThemeResolver page="profile" />} />
        <Route path="/:slug/entrar"   element={<ThemeResolver page="auth" />} />
        <Route path="/auth/callback"        element={<AuthCallbackPage />} />
        <Route path="/:slug/auth/callback"  element={<AuthCallbackPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
