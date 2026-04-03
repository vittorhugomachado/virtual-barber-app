import { ArrowRight, BookOpenText } from "lucide-react";
import {
  PORTAL_CATEGORIES,
  type PortalCategoryKey,
} from "@/portal/types/portal-types";
import { getReadTime } from "@/portal/utils/get-read-time";

type FeaturedCardProps = {
  title: string;
  category: PortalCategoryKey;
  published_at: string;
  cover_url: string;
  excerpt: string;
  isSmall: boolean;
};

export function FeaturedCard({
  title,
  category,
  published_at,
  cover_url,
  excerpt,
  isSmall,
}: FeaturedCardProps) {
  const categoryMeta = PORTAL_CATEGORIES[category];

  return (
    <div
      style={{ maxWidth: isSmall ? "400px" : "704px" }}
      className="group h-fit w-full max-w-full cursor-pointer rounded-lg bg-white p-2 transition-all duration-300 hover:-translate-y-1"
    >
      {!isSmall && (
        <img
          src={cover_url}
          alt="imagem artigo"
          className="h-80 w-full rounded-md object-cover"
        />
      )}

      <div className="px-3 pt-3 pb-3">
        <div className="flex w-full justify-between">
          <span
            style={{
              backgroundColor: categoryMeta.colors.background,
              color: categoryMeta.colors.text,
            }}
            className="rounded-sm px-1.5 py-1 text-[13px]"
          >
            {categoryMeta.label}
          </span>
          <span className="text-[13px] text-neutral-500">{published_at}</span>
        </div>
        <h3
          style={{
            fontSize: isSmall ? "16px" : "24px",
            marginBottom: isSmall ? "0" : "20px",
          }}
          className="mt-4 text-2xl font-semibold text-[#212039]"
        >
          {title}
        </h3>
        {!isSmall && (
          <p className="text-md font-semilight mb-6 text-neutral-500">
            {excerpt}
          </p>
        )}
        <div className="flex justify-between">
          <span
            style={{ opacity: isSmall ? "0" : "100%" }}
            className="flex items-center gap-1 text-[13px] text-neutral-500"
          >
            {" "}
            <BookOpenText size={17} className="translate-y-px" /> {getReadTime(excerpt)} de
            leitura
          </span>
          <ArrowRight
            size={30}
            className="text-4xl transition-all duration-300 group-hover:-rotate-45"
          />
        </div>
      </div>
    </div>
  );
}
