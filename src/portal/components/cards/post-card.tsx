import { ArrowRight, BookOpenText } from "lucide-react";
import {
  PORTAL_CATEGORIES,
  type PortalCategoryKey,
} from "@/portal/types/portal-types";

type PostCardProps = {
  title: string;
  category: PortalCategoryKey;
  date: string;
  imageUrl: string;
  description: string;
  readTime: string;
  isSmall: boolean;
};

export function PostCard({
  title,
  category,
  date,
  imageUrl,
  description,
  readTime,
  isSmall,
}: PostCardProps) {
  const categoryMeta = PORTAL_CATEGORIES[category];

  return (
    <div className="group flex h-full w-full cursor-pointer flex-col rounded-lg border border-neutral-200 bg-white p-2 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-800">
      {!isSmall && (
        <img
          src={imageUrl}
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
          <span className="text-[13px] text-neutral-500">{date}</span>
        </div>
        <h3 className="mt-4 line-clamp-2 min-h-14 text-xl font-semibold text-[#212039]">
          {title}
        </h3>
        <p className="font-semilight mb-6 line-clamp-3 min-h-15 text-sm text-neutral-500">
          {description}
        </p>
        <div className="mt-auto flex justify-between">
          <span className="flex items-center gap-1 text-[12px] text-neutral-500">
            {" "}
            <BookOpenText size={15} className="translate-y-px" /> {readTime} de
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
