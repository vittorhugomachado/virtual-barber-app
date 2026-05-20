import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotFoundPage } from "./app/pages/not-found-page";
import { AuthCallbackPage } from "./app/pages/auth-callback-page";
// import { PostPage } from "./portal/pages/post";
// import { CategoryPage } from "./portal/pages/category";
import { ThemeResolver } from "./app/themes/resolver";
import { subscribeToSupabaseAuth } from "./app/lib/auth";
import { useAuthStore } from "./app/store/auth-store";
import { LandingPage } from "./landing-page";
import { PrivacyPolicyPage } from "./portal/pages/privacy-policy";
import { DataDeletionPage } from "./portal/pages/data-deletion";

export function App() {
  const { setCustomer, clearCustomer, setLoading } = useAuthStore();

  useEffect(() => {
    return subscribeToSupabaseAuth({
      setCustomer,
      clearCustomer,
      setLoading,
      getCustomer: () => useAuthStore.getState().customer,
    });
  }, [setCustomer, clearCustomer, setLoading]);

  return (
    <BrowserRouter>
      <Routes>
        {/* ROTAS DA LANDING PAGE */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/politica-de-privacidade"
          element={<PrivacyPolicyPage />}
        />
        <Route path="/data-deletion" element={<DataDeletionPage />} />

        {/* ROTAS DO PORTAL EM DESENVOLVIMENTO*/}
        {/* <Route path="/portal/:tag/:post" element={<PostPage />} />
        <Route path="/portal/:tag" element={<CategoryPage />} /> */}

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
