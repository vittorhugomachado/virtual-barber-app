import { DAYS_FULL, type BarbershopPageProps } from "../types";
import { Navbar } from "./components/nav-bar";
import { Gallery } from "./components/gallery";
import { Clock, MapPin } from "lucide-react";
import { formatTime } from "../../utils/format-time";
import { groupByDay } from "../../utils/Group-bay-day";
import { Team } from "./components/team";
import { StatusBadge } from "../../components/status-badge";
import { Services } from "./components/services";
import { Contact } from "./components/contact";
import { WhatsappButton } from "./components/whatsapp-button";

export default function DefaultTheme(props: BarbershopPageProps) {
  const byDay = groupByDay(props.openingHours);
  const today = new Date().getDay();

  return (
    <div className="relative">
      <Navbar
        isPreview={false}
        primaryColor={props.style.primary_color}
        barbershopName={props.name}
        openingHours={props.openingHours}
      />
      <StatusBadge openingHours={props.openingHours} classTailwind="pl-4" />
      {props.phone && (
        <WhatsappButton
          linkWhatsapp={`https://wa.me/55${props?.phone.replace(/\D/g, "")}`}
        />
      )}
      <main className="mx-auto max-w-6xl px-4 py-10">
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

        {/* galeria */}
        <div className="-mx-4 mt-6 sm:mx-0">
          <Gallery images={props.gallery} barbershopName={props.name} />
        </div>
        {/* horários */}

        <div className="mt-16">
          <Team barbers={props.barbers} />
        </div>
        <Services services={props.services} isPreview={props.isPreview} />
        <Contact phone={props.phone} />

        <div className="flex-1">
          <div className="mb-4 flex items-center gap-2">
            <Clock size={18} className="text-neutral-400" />
            <h2 className="text-lg font-medium">Horários de funcionamento</h2>
          </div>

          <div className="divide-y divide-neutral-100 rounded-xl border border-neutral-100 dark:divide-neutral-800 dark:border-neutral-800">
            {Array.from({ length: 7 }, (_, i) => {
              const periods = byDay[i];
              const isToday = i === today;
              const hasPeriods = periods?.some(p => p.is_open);

              return (
                <div
                  key={i}
                  className={`flex items-center justify-between px-4 py-3 ${isToday ? "bg-neutral-50 dark:bg-neutral-900" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${hasPeriods ? "bg-green-500" : "bg-red-500"}`}
                    />
                    <span
                      className={`text-sm ${isToday ? "font-semibold" : "text-neutral-600 dark:text-neutral-400"}`}
                    >
                      {DAYS_FULL[i]}
                      {isToday && (
                        <span className="ml-2 text-xs font-normal text-neutral-400">
                          hoje
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-0.5">
                    {hasPeriods ? (
                      periods
                        .filter(p => p.is_open)
                        .sort((a, b) => a.period_order - b.period_order)
                        .map(p => (
                          <span
                            key={p.id}
                            className="text-sm whitespace-nowrap text-neutral-600 dark:text-neutral-400"
                          >
                            {formatTime(p.opens_at)} – {formatTime(p.closes_at)}
                          </span>
                        ))
                    ) : (
                      <span className="text-sm text-neutral-400">Fechado</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* 
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
