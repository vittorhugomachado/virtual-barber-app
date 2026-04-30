import { useEffect, useState } from "react";
import { type BarbershopPageProps } from "../types";
import { Navbar } from "./components/nav-bar";
import { Gallery } from "./components/gallery";
import { Team } from "./components/team";
import { Services } from "./components/services";
import { WhatsappButton } from "./components/whatsapp-button";
import { Location } from "./components/location";
import { BarberShopHours } from "./components/barbershop-hours";
import { Footer } from "../../components/footer";
import { SectionNav } from "./components/section-nav";
import { CartPanel } from "./components/cart-panel";
import { StyleProvider } from "../../contexts/style-context/style-provider";

type PreviewStyle = {
  text_color: string;
  background_color: string;
  primary_color: string;
  text_button_color: string;
};

function isDarkColor(color: string) {
  const hex = color.replace("#", "");
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

export default function DefaultTheme(props: BarbershopPageProps) {
  const [previewStyle, setPreviewStyle] = useState<PreviewStyle>(
    props.style,
  );
  const isDarkBackground = isDarkColor(previewStyle.background_color);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type !== "BARBERSHOP_PREVIEW_STYLE") return;

      setPreviewStyle(current => ({ ...current, ...event.data.style }));
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    setPreviewStyle(props.style);
  }, [props.style]);

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

  const activeBarber =
    props.barbers?.filter(barber => barber.is_active === true) || [];

  const hasMultipleBarbers = activeBarber.length > 1;

  const sections = [
    { id: "servicos", label: "Serviços" },
    ...(hasMultipleBarbers ? [{ id: "equipe", label: "Equipe" }] : []),
    { id: "horarios", label: "Horários" },
    { id: "localizacao", label: "Localização" },
  ];

  return (
    <StyleProvider
      primaryColor={previewStyle.primary_color}
      textButtonColor={previewStyle.text_button_color}
    >
      <div
        className={
          isDarkBackground
            ? "dark relative min-h-screen text-[var(--store-text)]"
            : "relative min-h-screen text-[var(--store-text)]"
        }
        style={
          {
            backgroundColor: previewStyle.background_color,
            "--store-background": previewStyle.background_color,
            "--store-primary": previewStyle.primary_color,
            "--store-text": previewStyle.text_color,
            "--store-button-text": previewStyle.text_button_color,
          } as React.CSSProperties
        }
      >
        <Navbar />

        {props.phone && <WhatsappButton linkWhatsapp={props.phone} />}

        <SectionNav sections={sections} />

        <main className="mx-auto max-w-6xl px-4 pt-14 pb-10">
          <Gallery />

          <section
            id="servicos"
            className="mt-8 flex flex-col gap-6 lg:mt-16 lg:flex-row lg:items-start"
          >
            <Services />
            <CartPanel />
          </section>

          {hasMultipleBarbers && <Team />}

          <BarberShopHours />
          <Location />
        </main>

        <Footer />
      </div>
    </StyleProvider>
  );
}
