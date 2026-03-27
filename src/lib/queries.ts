import { supabase } from "./supabase";
import type { BarbershopPageProps, GalleryImage } from "../themes/types";

type BarbershopQueryResult =
  | (BarbershopPageProps & { plan: string; gallery: GalleryImage[] })
  | null;

const inFlightBarbershopRequests = new Map<
  string,
  Promise<BarbershopQueryResult>
>();

export async function getBarbershopBySlug(
  slug: string,
): Promise<BarbershopQueryResult> {
  const existingRequest = inFlightBarbershopRequests.get(slug);

  if (existingRequest) {
    return existingRequest;
  }

  const request = (async (): Promise<BarbershopQueryResult> => {
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
          theme_is_dark,
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
          ),
          barber_availability (
            id,
            barber_id,
            barbershop_id,
            day_of_week,
            is_day_off,
            use_custom_hours,
            starts_at,
            ends_at,
            period_order
          )
        ),
        barbershop_gallery (
          id,
          url,
          order
        )
      `,
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error || !barbershop) return null;

    // filtra só serviços ativos
    const activeServices = (barbershop.services ?? []).filter(
      service => service.is_active,
    );

    // monta os barbers com serviceIds e nomes dos serviços
    const barbers = (barbershop.barbers ?? [])
      .filter(barber => barber.is_active)
      .map(barber => {
        const serviceIds = (barber.barber_services ?? []).map(
          barberService => barberService.service_id,
        );
        const services = activeServices
          .filter(service => serviceIds.includes(service.id))
          .map(service => service.name);

        return {
          id: barber.id,
          name: barber.name,
          avatar_url: barber.avatar_url ?? null,
          description: barber.description ?? null,
          is_active: barber.is_active,
          serviceIds,
          services,
          availability: (barber.barber_availability ?? []).sort(
            (a, b) => a.day_of_week - b.day_of_week || a.period_order - b.period_order,
          ),
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
      style: (() => {
        const styleSource = (Array.isArray(barbershop.store_style)
          ? barbershop.store_style[0]
          : barbershop.store_style) ?? {
          text_color: undefined,
          theme_is_dark: true,
          primary_color: undefined,
          text_button_color: undefined,
        };

        return {
          text_color: styleSource.text_color ?? "#FFFFFF",
          theme_is_dark: styleSource.theme_is_dark ?? true,
          primary_color: styleSource.primary_color ?? "#0458EE",
          text_button_color: styleSource.text_button_color ?? "#000000",
        };
      })(),
      socialMedia:
        (Array.isArray(barbershop.social_media)
          ? barbershop.social_media[0]
          : barbershop.social_media) ?? null,
      address:
        (Array.isArray(barbershop.addresses)
          ? barbershop.addresses[0]
          : barbershop.addresses) ?? null,
      services: activeServices.map(service => ({
        id: service.id,
        name: service.name,
        image_url: service.image_url ?? null,
        description: service.description ?? null,
        duration_min: service.duration_min ?? null,
        price: service.price ?? null,
      })),
      barbers,
      openingHours: (barbershop.opening_hours ?? []).sort(
        (first, second) =>
          first.day_of_week - second.day_of_week ||
          first.period_order - second.period_order,
      ),
      gallery: (barbershop.barbershop_gallery ?? [])
        .sort((first, second) => first.order - second.order)
        .map(image => ({
          id: image.id,
          url: image.url,
          order: image.order,
        })),
    };
  })();

  inFlightBarbershopRequests.set(slug, request);

  try {
    return await request;
  } finally {
    inFlightBarbershopRequests.delete(slug);
  }
}

//--------- !! ABAIXO RETORNA O BANCO DE DADOS COMPLETO ?? ---------------//
// import { supabase } from "./supabase";
// import type { BarbershopPageProps, GalleryImage } from "../themes/types";

// type BarbershopQueryResult =
//   | (BarbershopPageProps & { plan: string; gallery: GalleryImage[] })
//   | null;

// const inFlightBarbershopRequests = new Map();

// export async function getBarbershopBySlug(
//   slug: string,
// ): Promise<BarbershopQueryResult> {
//   const existingRequest = inFlightBarbershopRequests.get(slug);

//   if (existingRequest) {
//     return existingRequest;
//   }

//   const request = (async (): Promise<BarbershopQueryResult> => {
//     const { data: barbershop, error } = await supabase
//       .from("barbershops")
//       .select(
//         `
//         *,
//         store_style (*),
//         social_media (*),
//         addresses (*),
//         services (*),
//         opening_hours (*),
//         barbers (
//           *,
//           barber_services (*),
//           barber_availability (*)
//         ),
//         barbershop_gallery (*),
//         barbershop_members (*),
//         customers (*),
//         appointments (
//           *,
//           customers (*),
//           barbers (*),
//           services (*)
//         )
//       `,
//       )
//       .eq("slug", slug)
//       .eq("is_active", true)
//       .single();

//     console.log("====== BARBERSHOP DATA COMPLETA ======");
//     console.log(JSON.stringify(barbershop, null, 2));
//     console.log("====== ERROR ======");
//     console.log(error);

//     if (error || !barbershop) return null;

//     // filtra só serviços ativos
//     const activeServices = (barbershop.services ?? []).filter(
//       (service: any) => service.is_active,
//     );

//     // monta os barbers com serviceIds e nomes dos serviços
//     const barbers = (barbershop.barbers ?? [])
//       .filter((barber: any) => barber.is_active)
//       .map((barber: any) => {
//         const serviceIds = (barber.barber_services ?? []).map(
//           (barberService: any) => barberService.service_id,
//         );
//         const services = activeServices
//           .filter((service: any) => serviceIds.includes(service.id))
//           .map((service: any) => service.name);

//         return {
//           id: barber.id,
//           name: barber.name,
//           avatar_url: barber.avatar_url ?? null,
//           description: barber.description ?? null,
//           is_active: barber.is_active,
//           serviceIds,
//           services,
//         };
//       });

//     console.log(barbershop);
//     return {
//       id: barbershop.id,
//       name: barbershop.name,
//       slug: barbershop.slug,
//       phone: barbershop.phone ?? null,
//       description: barbershop.description ?? null,
//       logo_url: barbershop.logo_url ?? null,
//       banner_url: barbershop.banner_url ?? null,
//       template: barbershop.template as BarbershopPageProps["template"],
//       plan: barbershop.plan,
//       style: (() => {
//         const styleSource = (Array.isArray(barbershop.store_style)
//           ? barbershop.store_style[0]
//           : barbershop.store_style) ?? {
//           text_color: undefined,
//           theme_is_dark: true,
//           primary_color: undefined,
//           text_button_color: undefined,
//         };

//         return {
//           text_color: styleSource.text_color ?? "#FFFFFF",
//           theme_is_dark: styleSource.theme_is_dark ?? true,
//           primary_color: styleSource.primary_color ?? "#CF2820",
//           text_button_color: styleSource.text_button_color ?? "#000000",
//         };
//       })(),
//       socialMedia:
//         (Array.isArray(barbershop.social_media)
//           ? barbershop.social_media[0]
//           : barbershop.social_media) ?? null,
//       address:
//         (Array.isArray(barbershop.addresses)
//           ? barbershop.addresses[0]
//           : barbershop.addresses) ?? null,
//       services: activeServices.map((service: any) => ({
//         id: service.id,
//         name: service.name,
//         image_url: service.image_url ?? null,
//         description: service.description ?? null,
//         duration_min: service.duration_min ?? null,
//         price: service.price ?? null,
//       })),
//       barbers,
//       openingHours: (barbershop.opening_hours ?? []).sort(
//         (first: any, second: any) =>
//           first.day_of_week - second.day_of_week ||
//           first.period_order - second.period_order,
//       ),
//       gallery: (barbershop.barbershop_gallery ?? [])
//         .sort((first: any, second: any) => first.order - second.order)
//         .map((image: any) => ({
//           id: image.id,
//           url: image.url,
//           order: image.order,
//         })),
//     };
//   })();

//   inFlightBarbershopRequests.set(slug, request);

//   try {
//     return await request;
//   } finally {
//     inFlightBarbershopRequests.delete(slug);
//   }
// }
