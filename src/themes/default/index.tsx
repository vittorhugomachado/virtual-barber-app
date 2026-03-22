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

export default function DefaultTheme(props: BarbershopPageProps) {
  return (
    <div className="relative">
      <Navbar
        isPreview={false}
        primaryColor={props.style.primary_color}
        barbershopName={props.name}
        openingHours={props.openingHours}
      />
      {props.phone && (
        <WhatsappButton
          linkWhatsapp={`https://wa.me/55${props?.phone.replace(/\D/g, "")}`}
        />
      )}
      <SectionNav primaryColor={props.style.primary_color} />
      <main className="mx-auto max-w-6xl px-4 pt-14 pb-10">
        <Gallery images={props.gallery} barbershopName={props.name} />
        <Services services={props.services} isPreview={props.isPreview} />
          <Team barbers={props.barbers} />
          <BarberShopHours openingHours={props.openingHours} />
          <Location address={props.address} phone={props.phone} />
      </main>
      <Footer />
    </div>
  );
}
