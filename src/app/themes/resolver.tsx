import { lazy, Suspense, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useBarbershop } from "../hooks/use-barbershop";
import { NotFoundPage } from "@/app/pages/not-found-page";
import { CartProvider } from "../contexts/cart-context/cart-provider";
import { StyleProvider } from "../contexts/style-context/style-provider";
import { BarbershopDataProvider } from "../contexts/barbershop-data/barbershop-data-provider";

export type PageType = "home" | "auth" | "booking" | "profile";

const THEMES = {
  default: {
    home: lazy(() => import("./default")),
    auth: lazy(() => import("./default/auth")),
    booking: lazy(() => import("./default/booking")),
    profile: lazy(() => import("./default/profile")),
  },
  vintage: {
    home: lazy(() => import("./premium-a")),
    auth: lazy(() => import("./premium-a/auth")),
    booking: lazy(() => import("./premium-a/booking")),
    profile: lazy(() => import("./premium-a/profile")),
  },
  minimalist: {
    home: lazy(() => import("./premium-b")),
    auth: lazy(() => import("./premium-b/auth")),
    booking: lazy(() => import("./premium-b/booking")),
    profile: lazy(() => import("./premium-b/profile")),
  },
  modern: {
    home: lazy(() => import("./premium-c")),
    auth: lazy(() => import("./premium-c/auth")),
    booking: lazy(() => import("./premium-c/booking")),
    profile: lazy(() => import("./premium-c/profile")),
  },
};

const PLAN_ALLOWED_TEMPLATES: Record<string, (keyof typeof THEMES)[]> = {
  iniciante: ["default"],
  profissional: ["vintage", "modern", "minimalist"],
  master: ["vintage", "modern", "minimalist"],
};

function resolveTemplate(
  template: keyof typeof THEMES,
  plan: string,
): keyof typeof THEMES {
  const allowed = PLAN_ALLOWED_TEMPLATES[plan] ?? ["default"];
  return allowed.includes(template) ? template : "default";
}

interface ThemeResolverProps {
  page: PageType;
}

export function ThemeResolver({ page }: ThemeResolverProps) {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = useBarbershop(slug ?? "");

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      Boolean(data?.style.theme_is_dark),
    );
  }, [data?.style.theme_is_dark]);

  if (isLoading) return <ThemeLoadingFallback />;
  if (error || !data) return <NotFoundPage />;

  const resolvedTemplate = resolveTemplate(data.template, data.plan);
  const Page = THEMES[resolvedTemplate][page];

  return (
    <CartProvider slug={slug ?? ""}>
      <StyleProvider
        primaryColor={data.style.primary_color}
        textButtonColor={data.style.text_button_color}
      >
        <BarbershopDataProvider value={data}>
          <Suspense fallback={<ThemeLoadingFallback />}>
            <Page {...data} />
          </Suspense>
        </BarbershopDataProvider>
      </StyleProvider>
    </CartProvider>
  );
}

function ThemeLoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-800" />
        <span className="text-sm text-neutral-500">Carregando...</span>
      </div>
    </div>
  );
}
