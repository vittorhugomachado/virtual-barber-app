import { lazy, Suspense, useEffect, useState, type CSSProperties } from "react";
import { useParams } from "react-router-dom";
import { useBarbershop } from "../hooks/use-barbershop";
import { NotFoundPage } from "@/app/pages/not-found-page";
import { CartProvider } from "../contexts/cart-context/cart-provider";
import { StyleProvider } from "../contexts/style-context/style-provider";
import { BarbershopDataProvider } from "../contexts/barbershop-data/barbershop-data-provider";
import type { StoreStyle } from "./types";

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

function isDarkColor(color?: string | null) {
  const hex = color?.replace("#", "") ?? "";
  const normalizedHex =
    hex.length === 3
      ? hex
          .split("")
          .map(character => character + character)
          .join("")
      : hex;

  if (!/^[0-9a-fA-F]{6}$/.test(normalizedHex)) return true;

  const red = Number.parseInt(normalizedHex.slice(0, 2), 16);
  const green = Number.parseInt(normalizedHex.slice(2, 4), 16);
  const blue = Number.parseInt(normalizedHex.slice(4, 6), 16);
  const luminance = (red * 299 + green * 587 + blue * 114) / 1000;

  return luminance < 128;
}

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
  const [previewStyleOverride, setPreviewStyleOverride] =
    useState<Partial<StoreStyle> | null>(null);
  const isPreview =
    new URLSearchParams(window.location.search).get("preview") === "true";

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type !== "BARBERSHOP_PREVIEW_STYLE") return;

      setPreviewStyleOverride(event.data.style);
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    if (!isPreview) return;

    const preventPreviewAction = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      *, *::before, *::after {
        cursor: default !important;
      }
    `;

    document.head.appendChild(styleElement);
    document.addEventListener("click", preventPreviewAction, true);
    document.addEventListener("submit", preventPreviewAction, true);

    return () => {
      styleElement.remove();
      document.removeEventListener("click", preventPreviewAction, true);
      document.removeEventListener("submit", preventPreviewAction, true);
    };
  }, [isPreview]);

  useEffect(() => {
    const sendHeight = () => {
      window.parent.postMessage(
        {
          type: "BARBERSHOP_PREVIEW_HEIGHT",
          height: document.documentElement.scrollHeight,
        },
        "*",
      );
    };

    sendHeight();

    const resizeObserver = new ResizeObserver(sendHeight);
    resizeObserver.observe(document.body);

    window.addEventListener("resize", sendHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", sendHeight);
    };
  }, []);

  useEffect(() => {
    document.title = data ? `${data.name}` : "Barbershop";
    document.documentElement.classList.toggle(
      "dark",
      isDarkColor(previewStyleOverride?.background_color ?? data?.style.background_color),
    );
  }, [data, previewStyleOverride?.background_color]);

  if (isLoading) return <ThemeLoadingFallback />;
  if (error || !data) return <NotFoundPage />;

  const resolvedTemplate = resolveTemplate(data.template, data.plan);
  const Page = THEMES[resolvedTemplate][page];
  const style: StoreStyle = {
    ...data.style,
    ...previewStyleOverride,
  };
  const isDarkBackground = isDarkColor(style.background_color);
  const themeStyle = {
    backgroundColor: style.background_color,
    "--store-background": style.background_color,
    "--store-primary": style.primary_color,
    "--store-text": style.text_color,
    "--store-button-text": style.text_button_color,
  } as CSSProperties;

  return (
    <CartProvider slug={slug ?? ""}>
      <StyleProvider
        style={style}
        isDarkBackground={isDarkBackground}
      >
        <div
          className="min-h-screen bg-(--store-background) text-(--store-text)"
          style={themeStyle}
        >
          <BarbershopDataProvider value={{ ...data, style }}>
            <Suspense fallback={<ThemeLoadingFallback />}>
              <Page {...data} style={style} />
            </Suspense>
          </BarbershopDataProvider>
        </div>
      </StyleProvider>
    </CartProvider>
  );
}

function ThemeLoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
        <span className="text-sm text-current">Carregando...</span>
      </div>
    </div>
  );
}
