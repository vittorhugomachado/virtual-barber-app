import { FeaturedCard } from "../cards/featured-card";
import { SectionSkeleton } from "../skeleton/section-skeleton";
import { useFeaturedPosts } from "@/portal/contexts/featured-posts/featured-posts-context";
import { toPortalCardPost } from "@/portal/lib/post-presenter";

export function SectionHero() {
  const { posts, isLoading } = useFeaturedPosts();

  if (isLoading) return <SectionSkeleton />;

  const primaryPost = posts.find(post => post.is_primary);
  const secondaryPosts = posts
    .filter(post => !post.is_primary)
    .slice(0, 4)
    .map(toPortalCardPost);

  if (!primaryPost) return null;

  const heroPost = toPortalCardPost(primaryPost);

  return (
    <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 className="mb-4 w-full text-start text-4xl font-bold text-white">
        Destaques
      </h2>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.76fr)_minmax(0,1fr)]">
        <FeaturedCard
          isSmall={false}
          title={heroPost.title}
          category={heroPost.category}
          date={heroPost.date}
          imageUrl={heroPost.imageUrl}
          description={heroPost.description}
          readTime={heroPost.readTime}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-1">
          {secondaryPosts.map(post => (
            <FeaturedCard
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
    </section>
  );
}
