import type { Post } from "@/portal/types/portal-types";
import { PostCard } from "../cards/post-card";
import { ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";

type CategoryMainProps = {
  category: string;
  posts: Post[];
};

export function CategoryMain({ category, posts }: CategoryMainProps) {
  const location = useLocation();

  return (
    <main className="max-w-8xl flex min-h-screen w-full flex-col items-center px-3 pt-8 md:px-8">
      <div className="flex w-full items-center  text-sm text-neutral-500">
        <a href="/" className="hover:text-neutral-700 hover:shadow-[0_-1px_0_0_#3f3f46_inset]">Portal</a>
        <ChevronRight size={15} />
        <a href={location.pathname} className="hover:text-neutral-700 hover:shadow-[0_-1px_0_0_#3f3f46_inset]">{category}</a>
      </div>
      <h1>{category}</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {posts.map(post => (
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
      <p>{posts.length}</p>
    </main>
  );
}
