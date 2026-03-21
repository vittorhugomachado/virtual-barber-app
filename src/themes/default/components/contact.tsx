// src/themes/default/components/contact.tsx

import { Phone, MapPin, Instagram, Facebook } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import type { BarbershopPageProps } from "../../types";

interface ContactProps {
  phone?: string | null;
  address?: BarbershopPageProps["address"];
  socialMedia?: BarbershopPageProps["socialMedia"];
}

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

export function Contact({ phone, address, socialMedia }: ContactProps) {
  const hasSocial =
    socialMedia?.instagram || socialMedia?.facebook || socialMedia?.tiktok;
  const hasAny = phone || address || hasSocial;

  if (!hasAny) return null;

  return (
    <section>
      <h2 className="mb-4 text-lg font-medium">Contato</h2>

      <div className="flex flex-col divide-y divide-neutral-100 overflow-hidden rounded-xl border border-neutral-100 dark:divide-neutral-800 dark:border-neutral-800">
        {phone && (
          <a
            href={`tel:${phone.replace(/\D/g, "")}`}
            className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
              <Phone size={14} className="text-neutral-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-neutral-400">Telefone</span>
              <span className="text-sm font-medium">{formatPhone(phone)}</span>
            </div>
          </a>
        )}

        {address && (
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(
              `${address.street}, ${address.number}, ${address.neighborhood}, ${address.city}, ${address.state}`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
              <MapPin size={14} className="text-neutral-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-neutral-400">Endereço</span>
              <span className="text-sm font-medium">
                {address.street}, {address.number}
              </span>
              <span className="text-xs text-neutral-500">
                {address.neighborhood} · {address.city}, {address.state}
              </span>
            </div>
          </a>
        )}

        {socialMedia?.instagram && (
          <a
            href={`https://instagram.com/${socialMedia.instagram.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
              <Instagram size={14} className="text-neutral-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-neutral-400">Instagram</span>
              <span className="text-sm font-medium">
                @{socialMedia.instagram.replace("@", "")}
              </span>
            </div>
          </a>
        )}

        {socialMedia?.facebook && (
          <a
            href={`https://facebook.com/${socialMedia.facebook}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
              <Facebook size={14} className="text-neutral-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-neutral-400">Facebook</span>
              <span className="text-sm font-medium">
                {socialMedia.facebook}
              </span>
            </div>
          </a>
        )}

        {socialMedia?.tiktok && (
          <a
            href={`https://tiktok.com/@${socialMedia.tiktok.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
              <SiTiktok size={13} className="text-neutral-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-neutral-400">TikTok</span>
              <span className="text-sm font-medium">
                @{socialMedia.tiktok.replace("@", "")}
              </span>
            </div>
          </a>
        )}
      </div>
    </section>
  );
}
