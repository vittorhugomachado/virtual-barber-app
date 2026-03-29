import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NotFoundPage } from "./pages/not-found-page";
import { AuthCallbackPage } from "./pages/auth-callback-page";
import { ThemeResolver } from "./themes/resolver";
import { supabase } from "./lib/supabase";
import { syncAuthStoreWithSession } from "./lib/auth";
import { useAuthStore } from "./store/auth-store";

export function App() {
  const { setCustomer, clearCustomer, setLoading } = useAuthStore();

  useEffect(() => {
    let active = true;

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return;

      return syncAuthStoreWithSession(session, {
        setCustomer,
        clearCustomer,
        setLoading,
      });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;

      void syncAuthStoreWithSession(session, {
        setCustomer,
        clearCustomer,
        setLoading,
      });
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [setCustomer, clearCustomer, setLoading]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/404" replace />} />
        <Route path="/:slug" element={<ThemeResolver page="home" />} />
        <Route
          path="/:slug/agendar"
          element={<ThemeResolver page="booking" />}
        />
        <Route
          path="/:slug/perfil"
          element={<ThemeResolver page="profile" />}
        />
        <Route path="/:slug/entrar" element={<ThemeResolver page="auth" />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/:slug/auth/callback" element={<AuthCallbackPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
