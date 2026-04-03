import { BookOpenText, Calendar } from "lucide-react";
import type { Post } from "@/portal/types/portal-types";
import { PORTAL_CATEGORIES } from "@/portal/types/portal-types";
import { getReadTime } from "@/portal/utils/get-read-time";
import { formatDate } from "@/portal/utils/format-date";

type PostMainProps = {
  post: Post;
};

export function PostMain({ post }: PostMainProps) {
  const categoryMeta = PORTAL_CATEGORIES[post.category];

  return (
    <main>
      {/* Hero — fundo escuro */}
      <section className="w-full bg-[#050419]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-8 lg:py-20">
          {/* Texto */}
          <div className="flex flex-1 flex-col gap-6">
            <span
              style={{
                backgroundColor: categoryMeta.colors.background,
                color: categoryMeta.colors.text,
              }}
              className="w-fit rounded-sm px-2 py-1 text-[13px] font-medium"
            >
              {categoryMeta.label}
            </span>

            <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            <p className="text-lg leading-relaxed text-neutral-300">
              {post.excerpt}
            </p>

            <div className="flex items-center gap-5 text-sm text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Calendar size={15} className="translate-y-px" />
                {formatDate(post.published_at)}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpenText size={15} className="translate-y-px" />
                {getReadTime(post.content)} de leitura
              </span>
            </div>
          </div>

          {/* Imagem */}
          <div className="w-full lg:w-120 lg:shrink-0">
            <img
              src={post.cover_url}
              alt={post.title}
              className="h-64 w-full rounded-xl object-cover sm:h-80 lg:h-90"
            />
          </div>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="w-full bg-neutral-100">
        <div
          className="prose prose-neutral mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </section>
    </main>
  );
}
