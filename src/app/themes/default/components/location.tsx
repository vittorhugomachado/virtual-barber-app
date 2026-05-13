import { MapPin, Phone } from "lucide-react";
import { formatPhone } from "@/utils/format-phone";
import { useBarbershopData } from "../../../contexts/barbershop-data/barbershop-data-context";

export function Location() {
  const { address, phone } = useBarbershopData();

  if (!address) return null;

  let queryAddress = `${address.street}, ${address.number}`;
  if (address.city && address.state) {
    queryAddress += `, ${address.city} - ${address.state}`;
  }
  if (address.neighborhood) {
    queryAddress += `, ${address.neighborhood}`;
  }

  const API_KEY = import.meta.env.VITE_API_GOOGLE_MAPS;

  const mapSrc = `https://www.google.com/maps/embed/v1/search?key=${API_KEY}&q=${encodeURIComponent(queryAddress)}&zoom=16`;

  return (
    <section id="localizacao" className="mt-18">
      <div className="mb-4 flex items-center justify-center gap-2">
        <MapPin size={18} />
        <h2 className="text-2xl font-medium md:text-4xl">Localização</h2>
      </div>
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="w-full overflow-hidden rounded-xl border border-current/15 lg:flex-1">
          <iframe
            src={mapSrc}
            width="100%"
            height="320"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização da barbearia"
          />
        </div>

        <div className="flex flex-col gap-4 lg:w-72 lg:shrink-0">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-current">Endereço</span>
            <span className="text-sm text-current/70">
              {address.street}, {address.number}
            </span>
            {address.complement && (
              <span className="text-sm text-current/70">
                {address.complement}
              </span>
            )}
            <span className="text-sm text-current/70">
              {address.neighborhood}
            </span>
            <span className="text-sm text-current/70">
              {address.city}, {address.state} · {address.zip_code}
            </span>
          </div>

          {phone && (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-current">Contato</span>
              <p className="flex items-center gap-1.5 text-sm text-current/70 transition-colors">
                <Phone size={14} className="shrink-0" />
                {formatPhone(phone)}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
