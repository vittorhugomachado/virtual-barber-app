import type { BarbershopPageProps } from "../types";
import { Navbar } from "./components/nav-bar";
import { useAuthStore } from "../../store/auth-store";
import { Gallery } from "./components/gallery";

export default function DefaultTheme(props: BarbershopPageProps) {
  const { customer, isAuthenticated } = useAuthStore();
  console.log(isAuthenticated, customer, props);
  return (
    <div>
      <Navbar isPreview={false} />
      <h2>{customer?.name}</h2>
      <main className="mx-auto max-w-6xl py-8">
        <Gallery images={props.gallery} barbershopName={props.name} />
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
