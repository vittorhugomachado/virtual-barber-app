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

export default function DefaultTheme(props: BarbershopPageProps) {
  const hasMultipleBarbers = props.barbers && props.barbers.length > 1;

  // Define as seções baseado na quantidade de barbeiros
  const getSections = () => {
    const sections = [
      { id: "servicos", label: "Serviços" },
      { id: "horarios", label: "Horários" },
      { id: "localizacao", label: "Localização" },
    ];

    // Se tiver mais de um barbeiro, insere a seção "Equipe" depois de "Serviços"
    if (hasMultipleBarbers) {
      sections.splice(1, 0, { id: "equipe", label: "Equipe" });
    }

    return sections;
  };

  const sections = getSections();

  return (
    <div className="relative">
      <Navbar
        isPreview={false}
        primaryColor={props.style.primary_color}
        textButtonColor={props.style.text_button_color}
        barbershopName={props.name}
        openingHours={props.openingHours}
      />
      {props.phone && <WhatsappButton linkWhatsapp={props?.phone} />}
      <SectionNav
        primaryColor={props.style.primary_color}
        sections={sections} // <-- passa as seções dinâmicas
      />
      <main className="mx-auto max-w-6xl px-4 pt-14 pb-10">
        <Gallery images={props.gallery} barbershopName={props.name} />
        <section
          id="servicos"
          className="mt-8 flex flex-col gap-6 lg:mt-16 lg:flex-row lg:items-start"
        >
          <Services services={props.services} isPreview={props.isPreview} />
          <CartPanel
            primaryColor={props.style.primary_color}
            textButtonColor={props.style.text_button_color}
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
