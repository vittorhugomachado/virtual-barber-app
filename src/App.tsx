import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotFoundPage } from "./app/pages/not-found-page";
import { AuthCallbackPage } from "./app/pages/auth-callback-page";
// import { PostPage } from "./portal/pages/post";
// import { CategoryPage } from "./portal/pages/category";
import { ThemeResolver } from "./app/themes/resolver";
import { supabase } from "./app/lib/supabase";
import { syncAuthStoreWithSession } from "./app/lib/auth";
import { useAuthStore } from "./app/store/auth-store";
import { LandingPage } from "./landing-page";
import { PrivacyPolicyPage } from "./portal/pages/privacy-policy";

function hasPersistedWhatsAppCustomer() {
  try {
    const rawAuth = window.localStorage.getItem("vb-auth");
    if (!rawAuth) return false;

    const parsed = JSON.parse(rawAuth) as {
      state?: {
        customer?: {
          auth?: boolean;
        } | null;
        isAuthenticated?: boolean;
      };
    };

    return parsed.state?.isAuthenticated === true &&
      parsed.state.customer?.auth === true;
  } catch {
    return false;
  }
}

export function App() {
  const { customer, setCustomer, clearCustomer, setLoading } = useAuthStore();
  console.log(customer)
  useEffect(() => {
    let active = true;

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return;

      if (
        customer?.auth ||
        useAuthStore.getState().customer?.auth ||
        hasPersistedWhatsAppCustomer()
      ) {
        return;
      }

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

      if (
        useAuthStore.getState().customer?.auth ||
        hasPersistedWhatsAppCustomer()
      ) {
        return;
      }

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
  }, [customer?.auth, setCustomer, clearCustomer, setLoading]);

  return (
    <BrowserRouter>
      <Routes>
        {/* ROTAS DA LANDING PAGE */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/politica-de-privacidade"
          element={<PrivacyPolicyPage />}
        />

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
