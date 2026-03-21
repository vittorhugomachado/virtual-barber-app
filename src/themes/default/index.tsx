import type { BarbershopPageProps, OpeningHour } from "../types";
import { Navbar } from "./components/nav-bar";
import { useAuthStore } from "../../store/auth-store";
import { Gallery } from "./components/gallery";
import { data } from "react-router-dom";
import { Clock, MapPin } from "lucide-react";
import { formatTime } from "../../utils/format-time";
import { BarberShopHours } from "./components/barbaershop-hours";

function isOpenNow(openingHours: OpeningHour[]): {
  open: boolean;
  closesAt: string | null;
} {
  const now = new Date();
  const day = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const todayPeriods = openingHours.filter(
    h => h.day_of_week === day && h.is_open,
  );

  for (const period of todayPeriods) {
    const [openH, openM] = period.opens_at.split(":").map(Number);
    const [closeH, closeM] = period.closes_at.split(":").map(Number);
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
      return { open: true, closesAt: formatTime(period.closes_at) };
    }
  }

  return { open: false, closesAt: null };
}

export default function DefaultTheme(props: BarbershopPageProps) {
  const { customer } = useAuthStore();
  const { open, closesAt } = isOpenNow(props.openingHours);

  return (
    <div className="overflow-x-hidden">
      <Navbar isPreview={false} />
      <main className="mx-auto max-w-6xl px-4 py-10">
        {/* nome + status + endereço */}
        <div className="mb-6 flex flex-col-reverse">
          <div>
            <h1 className="text-4xl my-6 font-semibold tracking-tight">
              {props.name}
            </h1>

            {/* status aberto/fechado */}
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${open ? "bg-green-500" : "bg-red-500"}`}
              />
              <span
                className={`text-sm font-medium ${open ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
              >
                {open ? "Aberta" : "Fechada"}
              </span>
              {open && closesAt && (
                <span className="text-sm text-neutral-500">
                  · fecha às {closesAt}
                </span>
              )}
            </div>

            {/* endereço */}
            {props.address && (
              <div className="mt-2 flex items-center gap-1.5 text-sm text-neutral-500">
                <MapPin size={14} className="shrink-0" />
                <span>
                  {props.address.street}, {props.address.number} ·{" "}
                  {props.address.neighborhood} · {props.address.city},{" "}
                  {props.address.state}
                </span>
              </div>
            )}
          </div>

          {/* galeria */}
          <div className="-mx-4 sm:mx-0">
            <Gallery images={props.gallery} barbershopName={props.name} />
          </div>
        </div>
        {/* horários */}
        <BarberShopHours openingHours={props.openingHours}  />
        
      </main>
      {/* <section>
        <h2>— cliente logado —</h2>
        {isAuthenticated && customer ? (
          <>
            <p>id: {customer.id}</p>
            <p>name: {customer.name}</p>
            <p>email: {customer.email}</p>
            <p>phone: {customer.phone ?? "—"}</p>
            <p>auth_user_id: {customer.auth_user_id}</p>
            <p>barbershop_id: {customer.barbershop_id ?? "—"}</p>
          </>
        ) : (
          <p>não autenticado</p>
        )}
      </section>

      <hr />
      <section>
        <h2>— identidade —</h2>
        <p>id: {props.id}</p>
        <p>name: {props.name}</p>
        <p>slug: {props.slug}</p>
        <p>phone: {props.phone ?? "—"}</p>
        <p>description: {props.description ?? "—"}</p>
        <p>logo_url: {props.logo_url ?? "—"}</p>
        <p>banner_url: {props.banner_url ?? "—"}</p>
        <p>template: {props.template}</p>
        <p>isPreview: {String(props.isPreview ?? false)}</p>
      </section>

      <hr />

      <section>
        <h2>— style —</h2>
        <p>background_color: {props.style.background_color}</p>
        <p>text_color: {props.style.text_color}</p>
        <p>primary_color: {props.style.primary_color}</p>
        <p>text_button_color: {props.style.text_button_color}</p>
      </section>

      <hr />

      <section>
        <h2>— social media —</h2>
        <p>instagram: {props.socialMedia?.instagram ?? "—"}</p>
        <p>facebook: {props.socialMedia?.facebook ?? "—"}</p>
        <p>tiktok: {props.socialMedia?.tiktok ?? "—"}</p>
      </section>

      <hr />

      <section>
        <h2>— address —</h2>
        <p>
          street: {props.address?.street ?? "—"}, {props.address?.number ?? "—"}
        </p>
        <p>neighborhood: {props.address?.neighborhood ?? "—"}</p>
        <p>
          city: {props.address?.city ?? "—"} — {props.address?.state ?? "—"}
        </p>
        <p>zip_code: {props.address?.zip_code ?? "—"}</p>
        <p>complement: {props.address?.complement ?? "—"}</p>
        <p>
          lat/lng: {props.address?.latitude ?? "—"} /{" "}
          {props.address?.longitude ?? "—"}
        </p>
      </section>

      <hr />

      <section>
        <h2>— services ({props.services.length}) —</h2>
        {props.services.map(s => (
          <div
            key={s.id}
            style={{ marginBottom: "0.5rem", paddingLeft: "1rem" }}
          >
            <p>
              • {s.name} | R$ {s.price ?? "—"} | {s.duration_min ?? "—"} min
            </p>
            <p style={{ color: "#666" }}> {s.description ?? "—"}</p>
          </div>
        ))}
      </section>

      <hr />

      <section>
        <h2>— barbers ({props.barbers.length}) —</h2>
        {props.barbers.map(b => (
          <div
            key={b.id}
            style={{ marginBottom: "0.5rem", paddingLeft: "1rem" }}
          >
            <p>
              • {b.name} | ativo: {String(b.is_active)}
            </p>
            <p style={{ color: "#666" }}>
              {" "}
              serviços: {b.services.join(", ") || "—"}
            </p>
            <p style={{ color: "#666" }}>
              {" "}
              serviceIds: {b.serviceIds.join(", ") || "—"}
            </p>
          </div>
        ))}
      </section>

      <hr />

      <section>
        <h2>— opening hours ({props.openingHours.length}) —</h2>
        {props.openingHours.map(h => (
          <div key={h.id} style={{ paddingLeft: "1rem" }}>
            <p>
              dia {h.day_of_week} | aberto: {String(h.is_open)} | {h.opens_at} →{" "}
              {h.closes_at} | turno: {h.period_order}
            </p>
          </div>
        ))}
      </section> */}
    </div>
  );
}
