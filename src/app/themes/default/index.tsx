import { type BarbershopPageProps } from "../types";
import { Navbar } from "./components/nav-bar";
import { Gallery } from "./components/gallery";
import { Team } from "./components/team";
import { Services } from "./components/services";
import { BookingButton } from "./components/booking-button";
import { Location } from "./components/location";
import { BarberShopHours } from "./components/barbershop-hours";
import { Footer } from "../../components/footer";
import { SectionNav } from "./components/section-nav";
import { CartPanel } from "./components/cart-panel";

export default function DefaultTheme(props: BarbershopPageProps) {
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
    <div className="relative min-h-screen text-(--store-text)">
      <Navbar />

      <SectionNav sections={sections} />

      <BookingButton />
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
  );
}
