import { ArrowRight } from "lucide-react";
import { PostCard } from "../cards/post-card";
import { PostsSkeleton } from "../skeleton/posts-skeleton";
import { useFeaturedPosts } from "@/portal/contexts/featured-posts/featured-posts-context";

export function SectionHealth() {
  const { posts, isLoading } = useFeaturedPosts();

  if (isLoading) return <PostsSkeleton bgDark={false} />;

  const categoryPosts = posts.filter(post => post.category === "saude");
  const primaryPost = categoryPosts.slice(0, 3);
  const secondaryPosts = categoryPosts.slice(3, 6);

  if (categoryPosts.length === 0) return null;

  return (
    <section className="relative mt-16 flex min-h-screen w-full flex-col items-center rounded-xl bg-[#e7e7e7] py-16">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-4 w-full text-start text-4xl font-bold text-[#050419]">
          Saude
        </h2>
        <div className="flex flex-col gap-12">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {primaryPost.map(post => (
              <PostCard
                key={post.id}
                isSmall={true}
                title={post.title}
                category={post.category}
                published_at={post.published_at}
                cover_url={post.cover_url}
                excerpt={post.excerpt}
                link={"portal/" + post.category + "/" + post.slug}
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
                published_at={post.published_at}
                cover_url={post.cover_url}
                excerpt={post.excerpt}
                link={"portal/" + post.category + "/" + post.slug}
              />
            ))}
          </div>
        </div>
      </div>
      <a
        href="/portal/saude"
        className="flex items-center gap-1 mt-10 bg-[#0457EF] rounded-full px-6 py-3 text-sm font-medium text-neutral-100 transition-colors hover:opacity-90"
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
