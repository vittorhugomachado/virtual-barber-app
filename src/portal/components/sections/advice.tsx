import { ArrowRight } from "lucide-react";
import { PostCard } from "../cards/post-card";
import { SectionSkeleton } from "../skeleton/section-skeleton";
import { useFeaturedPosts } from "@/portal/contexts/featured-posts/featured-posts-context";
import { toPortalCardPost } from "@/portal/lib/post-presenter";

export function SectionAdvice() {
  const { posts, isLoading } = useFeaturedPosts();

  if (isLoading) return <SectionSkeleton />;

  const categoryPosts = posts
    .filter(post => post.category === "dicas")
    .map(toPortalCardPost);
  const primaryPost = categoryPosts.slice(0, 3);
  const secondaryPosts = categoryPosts.slice(3, 6);

  if (categoryPosts.length === 0) return null;

  return (
    <section className="relative mt-26 flex min-h-screen w-full flex-col items-center rounded-xl bg-[#e7e7e7] py-16">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-4 w-full text-start text-4xl font-bold text-[#050419]">
          Dicas
        </h2>
        <div className="flex flex-col gap-12">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {primaryPost.map(post => (
              <PostCard
                key={post.id}
                isSmall={false}
                title={post.title}
                category={post.category}
                date={post.date}
                imageUrl={post.imageUrl}
                description={post.description}
                readTime={post.readTime}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {secondaryPosts.map(post => (
              <PostCard
                key={post.id}
                isSmall={true}
                title={post.title}
                category={post.category}
                date={post.date}
                imageUrl={post.imageUrl}
                description={post.description}
                readTime={post.readTime}
              />
            ))}
          </div>
        </div>
      </div>
      <a
        href="/dicas"
        className="mt-4 flex items-center transition-all duration-300 hover:scale-103"
      >
        Ver mais{" "}
        <ArrowRight
          size={20}
          className="text-4xl transition-all duration-300 group-hover:-rotate-45"
        />
      </a>
    </section>
  );
}
