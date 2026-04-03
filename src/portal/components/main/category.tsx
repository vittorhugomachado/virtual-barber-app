import { useMemo, useState } from "react";
import type { PortalPost } from "@/portal/types/portal-types";
import { PostCard } from "../cards/post-card";
import { ChevronRight } from "lucide-react";

type CategoryMainProps = {
  category: string;
  posts: PortalPost[];
};

const POSTS_PER_PAGE = 10;

export function CategoryMain({ category, posts }: CategoryMainProps) {
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const visiblePosts = useMemo(
    () => posts.slice(0, visibleCount),
    [posts, visibleCount],
  );
  const hasMorePosts = visibleCount < posts.length;

  function handleLoadMore() {
    setVisibleCount(current => current + POSTS_PER_PAGE);
  }

  return (
    <main className="max-w-8xl flex min-h-screen w-full flex-col items-center px-3 pt-8 pb-18 md:px-8">
      <nav
        aria-label="Breadcrumb"
        className="flex w-full items-center text-sm text-neutral-700"
      >
        <a
          href="/"
          className="hover:text-neutral-700 hover:shadow-[0_-1px_0_0_#3f3f46_inset]"
        >
          Portal
        </a>
        <ChevronRight size={15} />
        <span aria-current="page" className="text-neutral-700">
          {category}
        </span>
      </nav>
      <h1 className="mx-auto my-7 w-full text-center text-4xl font-bold text-[#050419]">
        {category}
      </h1>
      <h2 className="sr-only">Lista de posts da categoria {category}</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {visiblePosts.map(post => (
          <PostCard
            key={post.id}
            title={post.title}
            category={post.category}
            published_at={post.published_at}
            cover_url={post.cover_url}
            excerpt={post.excerpt}
            isSmall={false}
            link={post.slug}
          />
        ))}
      </div>
      {hasMorePosts && (
        <button
          type="button"
          onClick={handleLoadMore}
          className="mt-10 rounded-full border border-neutral-300 bg-[#0457EF] px-6 py-3 text-sm font-medium text-neutral-100 transition-colors hover:opacity-90"
        >
          Ver mais
        </button>
      )}
    </main>
  );
}
