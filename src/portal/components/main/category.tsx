import { useMemo, useState } from "react";
import type { PortalPost } from "@/portal/types/portal-types";
import { PostCard } from "../cards/post-card";
import { ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";

type CategoryMainProps = {
  category: string;
  posts: PortalPost[];
};

const POSTS_PER_PAGE = 10;

export function CategoryMain({ category, posts }: CategoryMainProps) {
  const location = useLocation();
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
      <div className="flex w-full items-center text-sm text-neutral-500">
        <a
          href="/"
          className="hover:text-neutral-700 hover:shadow-[0_-1px_0_0_#3f3f46_inset]"
        >
          Portal
        </a>
        <ChevronRight size={15} />
        <a
          href={location.pathname}
          className="hover:text-neutral-700 hover:shadow-[0_-1px_0_0_#3f3f46_inset]"
        >
          {category}
        </a>
      </div>
      <h1 className="my-7 mx-auto text-center w-full text-4xl font-bold text-[#050419]">{category}</h1>
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
          />
        ))}
      </div>
      {hasMorePosts && (
        <button
          type="button"
          onClick={handleLoadMore}
          className="mt-10 bg-[#0457EF] rounded-full border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-100 transition-colors hover:opacity-90"
        >
          Ver mais
        </button>
      )}
    </main>
  );
}
