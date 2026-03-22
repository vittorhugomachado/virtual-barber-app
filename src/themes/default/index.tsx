import { type BarbershopPageProps } from "../types";
import { Navbar } from "./components/nav-bar";
import { Gallery } from "./components/gallery";
import { Team } from "./components/team";
import { Services } from "./components/services";
import { WhatsappButton } from "./components/whatsapp-button";
import { Location } from "./components/location";
import { BarberShopHours } from "./components/barbaershop-hours";
import { Footer } from "../../components/footer";
import { SectionNav } from "./components/section-nav";
import { CartPanel } from "./components/cart-panel";

export default function DefaultTheme(props: BarbershopPageProps) {
  return (
    <div className="relative">
      <Navbar
        isPreview={false}
        primaryColor={props.style.primary_color}
        barbershopName={props.name}
        openingHours={props.openingHours}
      />
      {props.phone && <WhatsappButton linkWhatsapp={props?.phone} />}
      <SectionNav primaryColor={props.style.primary_color} />
      <main className="mx-auto max-w-6xl px-4 pt-14 pb-10">
        <Gallery images={props.gallery} barbershopName={props.name} />
          <section id="servicos" className="mt-8 lg:mt-16 flex flex-col gap-6 lg:flex-row lg:items-start">
            <Services
              services={props.services}
              isPreview={props.isPreview}
            />
            <CartPanel
              primaryColor={props.style.primary_color}
              isPreview={props.isPreview}
            />
          </section>
        <Team barbers={props.barbers} />
        <BarberShopHours openingHours={props.openingHours} />
        <Location address={props.address} phone={props.phone} />
      </main>
      <Footer />
    </div>
  );
}
