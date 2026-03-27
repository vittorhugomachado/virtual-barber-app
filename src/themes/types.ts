// ─── Dias da semana e periodos ────────────────────────────────────────────────────────────
export const DAYS_FULL = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

export const DAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export const MONTHS_FULL = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
export const MONTHS_SHORT = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

export const PERIOD_LABELS: Record<"manha" | "tarde" | "noite", string> = {
  manha: "Manhã",
  tarde: "Tarde",
  noite: "Noite",
};

// ─── Enums do banco ────────────────────────────────────────────────────────────

export type Plan = "iniciante" | "profissional" | "master";

export type TemplateId = "default" | "vintage" | "modern" | "minimalist";

// ─── Entidades ─────────────────────────────────────────────────────────────────

export interface StoreStyle {
  text_color: string;
  theme_is_dark: boolean;
  primary_color: string;
  text_button_color: string;
}

export interface SocialMedia {
  instagram?: string | null;
  facebook?: string | null;
  tiktok?: string | null;
}

export interface Address {
  city: string | null;
  country?: string | null;
  street: string;
  number: string;
  neighborhood: string;
  state: string;
  zip_code: string;
  complement?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface Service {
  id: string;
  name: string;
  image_url?: string | null;
  description?: string | null;
  duration_min?: number | null;
  price?: number | null;
}

export interface BarberAvailability {
  id: string;
  barber_id: string;
  barbershop_id: string;
  day_of_week: number;
  is_day_off: boolean;
  use_custom_hours: boolean;
  starts_at: string | null;
  ends_at: string | null;
  period_order: number;
}

export interface Barber {
  id: string;
  name: string;
  avatar_url?: string | null;
  description?: string | null;
  is_active: boolean;
  serviceIds: string[];
  services: string[];
  availability: BarberAvailability[];
}

export interface GalleryImage {
  id: string;
  url: string;
  order: number;
}

export interface OpeningHour {
  id: string;
  day_of_week: number; // 0 = domingo, 6 = sábado
  opens_at: string; // "HH:mm:ss"
  closes_at: string;
  period_order: number; // suporte a turnos (manhã/tarde)
  is_open: boolean;
}

// ─── Contrato principal ────────────────────────────────────────────────────────

export interface BarbershopPageProps {
  id: string;
  name: string;
  slug: string;
  phone?: string | null;
  description?: string | null;
  logo_url?: string | null;
  banner_url?: string | null;

  template: TemplateId;
  style: StoreStyle;

  services: Service[];
  barbers: Barber[];
  openingHours: OpeningHour[];
  gallery: GalleryImage[];
  address?: Address | null;
  socialMedia?: SocialMedia | null;

  isPreview?: boolean;
}

// ─── Agendamento ───────────────────────────────────────────────────────────────

export type AppointmentStatus =
  | "scheduled"
  | "completed"
  | "cancelled_by_customer"
  | "cancelled_by_barbershop"
  | "no_show";

export interface Appointment {
  id: string;
  barbershop_id: string;
  barber_id: string | null;
  service_id: string | null;
  customer_id: string | null;
  status: AppointmentStatus;
  starts_at: string;
  ends_at: string;
  notes?: string | null;
  created_at: string;
}

// ─── Cliente ───────────────────────────────────────────────────────────────────

export interface Customer {
  id: string;
  name: string;
  phone: string;
  auth_user_id?: string | null;
  barbershop_id?: string | null;
}

export interface ServiceSelection {
  barber: Barber;
  time: string;
}

export interface OtherSelection {
  time: string;
  duration: number;
}

// ─── Agendamento ────────────────────────────────────────────────────────────

export interface ServiceSlotCardProps {
  serviceId: string;
  customerId?: string | null;
  date: string;
  selection?: ServiceSelection;
  otherSelections: OtherSelection[];
  onSelect: (sel: ServiceSelection) => void;
  autoOpen?: boolean;
}

export interface StepBarberTimeProps {
  customerId?: string | null;
  date: string;
  selections: Record<string, ServiceSelection>;
  onSelectionsChange: (selections: Record<string, ServiceSelection>) => void;
  onContinue: () => void;
}
