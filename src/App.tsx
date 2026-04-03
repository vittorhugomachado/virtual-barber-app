import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotFoundPage } from "./app/pages/not-found-page";
import { AuthCallbackPage } from "./app/pages/auth-callback-page";
import { PostPage } from "./portal/pages/post";
import { CategoryPage } from "./portal/pages/category";
import { ThemeResolver } from "./app/themes/resolver";
import { supabase } from "./app/lib/supabase";
import { syncAuthStoreWithSession } from "./app/lib/auth";
import { useAuthStore } from "./app/store/auth-store";
import { HomePage } from "./portal/pages/home";

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
        {/* ROTAS DO PORTAL */}
        <Route path="/" element={<HomePage />} />
        <Route path="/portal/:tag/:post" element={<PostPage />} />
        <Route path="/portal/:tag" element={<CategoryPage />} />

        {/* ROTAS DO APP */}
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
