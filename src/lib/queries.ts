import { supabase } from "./supabase";
import type { BarbershopPageProps } from "../themes/types";

// ─── Busca todos os dados da barbearia para a página pública ──────────────────

export async function getBarbershopBySlug(
  slug: string,
): Promise<(BarbershopPageProps & { plan: string }) | null> {
  const { data: barbershop, error } = await supabase
    .from("barbershops")
    .select(
      `
      id,
      name,
      slug,
      phone,
      description,
      logo_url,
      banner_url,
      template,
      plan,
      store_style (
        text_color,
        background_color,
        primary_color,
        text_button_color
      ),
      social_media (
        instagram,
        facebook,
        tiktok
      ),
      addresses (
        city,
        country,
        street,
        number,
        neighborhood,
        state,
        zip_code,
        complement,
        latitude,
        longitude
      ),
      services (
        id,
        name,
        image_url,
        description,
        duration_min,
        price,
        is_active
      ),
      opening_hours (
        id,
        day_of_week,
        opens_at,
        closes_at,
        period_order,
        is_open
      ),
      barbers (
        id,
        name,
        avatar_url,
        description,
        is_active,
        barber_services (
          service_id
        )
      )
    `,
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !barbershop) return null;

  // filtra só serviços ativos
  const activeServices = (barbershop.services ?? []).filter(s => s.is_active);

  // monta os barbers com serviceIds e nomes dos serviços
  const barbers = (barbershop.barbers ?? [])
    .filter(b => b.is_active)
    .map(barber => {
      const serviceIds = (barber.barber_services ?? []).map(
        bs => bs.service_id,
      );
      const services = activeServices
        .filter(s => serviceIds.includes(s.id))
        .map(s => s.name);

      return {
        id: barber.id,
        name: barber.name,
        avatar_url: barber.avatar_url ?? null,
        description: barber.description ?? null,
        is_active: barber.is_active,
        serviceIds,
        services,
      };
    });

  return {
    id: barbershop.id,
    name: barbershop.name,
    slug: barbershop.slug,
    phone: barbershop.phone ?? null,
    description: barbershop.description ?? null,
    logo_url: barbershop.logo_url ?? null,
    banner_url: barbershop.banner_url ?? null,
    template: barbershop.template as BarbershopPageProps["template"],
    plan: barbershop.plan,
    style: (Array.isArray(barbershop.store_style)
      ? barbershop.store_style[0]
      : barbershop.store_style) ?? {
      text_color: "#FFFFFF",
      background_color: "#000000",
      primary_color: "#CF2820",
      text_button_color: "#000000",
    },
    socialMedia:
      (Array.isArray(barbershop.social_media)
        ? barbershop.social_media[0]
        : barbershop.social_media) ?? null,
    address:
      (Array.isArray(barbershop.addresses)
        ? barbershop.addresses[0]
        : barbershop.addresses) ?? null,
    services: activeServices.map(s => ({
      id: s.id,
      name: s.name,
      image_url: s.image_url ?? null,
      description: s.description ?? null,
      duration_min: s.duration_min ?? null,
      price: s.price ?? null,
    })),
    barbers,
    openingHours: (barbershop.opening_hours ?? []).sort(
      (a, b) =>
        a.day_of_week - b.day_of_week || a.period_order - b.period_order,
    ),
  };
}
