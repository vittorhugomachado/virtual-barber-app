import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  PORTAL_CATEGORIES,
  type PortalCategoryKey,
} from "@/portal/types/portal-types";
import { formatDate } from "@/portal/utils/format-date";

type PostCardProps = {
  title: string;
  category: PortalCategoryKey;
  published_at: string;
  cover_url: string;
  excerpt: string;
  isSmall: boolean;
  link: string;
};

export function PostCard({
  title,
  category,
  published_at,
  cover_url,
  excerpt,
  isSmall,
  link,
}: PostCardProps) {
  const categoryMeta = PORTAL_CATEGORIES[category];

  return (
    <Link
      to={link}
      className="group flex h-full w-full flex-col rounded-lg border border-neutral-200 bg-white p-2 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-800"
    >
      {!isSmall && (
        <img
          src={cover_url}
          alt="imagem artigo"
          className="h-50 w-full rounded-md object-cover"
        />
      )}
      <div className="flex flex-1 flex-col px-3 pt-3 pb-3">
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
          <span className="text-[13px] text-neutral-700">{formatDate(published_at)}</span>
        </div>
        <h3 className="mt-4 line-clamp-2 min-h-14 text-xl font-semibold text-[#212039]">
          {title}
        </h3>
        <p className="font-semilight mb-6 line-clamp-3 min-h-15 text-sm text-neutral-700">
          {excerpt}
        </p>
        <div className="mt-auto flex justify-end">
          {/* <span className="flex items-center gap-1 text-[12px] text-neutral-700">
            {" "}
            <BookOpenText size={15} className="translate-y-px" /> {getReadTime(excerpt)} de
            leitura
          </span> */}
          <ArrowRight
            size={30}
            className="text-4xl transition-all duration-300 group-hover:-rotate-45"
          />
        </div>
      </div>
    </Link>
  );
}
