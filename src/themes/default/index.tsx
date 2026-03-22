import { type BarbershopPageProps } from "../types";
import { Navbar } from "./components/nav-bar";
import { Gallery } from "./components/gallery";
import { Team } from "./components/team";
import { Services } from "./components/services";
import { WhatsappButton } from "./components/whatsapp-button";
import { Location } from "./components/location";
import { BarberShopHours } from "./components/barbaershop-hours";
import { Footer } from "../../components/footer";

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
      <main className="mx-auto max-w-6xl px-4 pb-10">
        <div className="-mx-4 md:mt-8 sm:mx-0">
          <Gallery images={props.gallery} barbershopName={props.name} />
        </div>
        <Services services={props.services} isPreview={props.isPreview} />
        <div className="mt-16">
          <Team barbers={props.barbers} />
        </div>
        <BarberShopHours openingHours={props.openingHours} />
        <Location address={props.address} phone={props.phone} />
      </main>
      <Footer />
    </div>
  );
}
