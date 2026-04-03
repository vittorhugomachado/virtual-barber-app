import { FeaturedCard } from "../cards/featured-card";
import { PostsSkeleton } from "../skeleton/posts-skeleton";
import { useFeaturedPosts } from "@/portal/contexts/featured-posts/featured-posts-context";
import { PORTAL_CATEGORIES } from "@/portal/types/portal-types";

export function SectionHero() {
  const { posts, isLoading } = useFeaturedPosts();

  if (isLoading) return <PostsSkeleton bgDark={true} />;

  const primaryPost = posts.find(post => post.is_primary);

  if (!primaryPost) return null;

  const secondaryPosts = Object.keys(PORTAL_CATEGORIES)
    .map(category =>
      posts.find(
        post =>
          post.category === category &&
          post.is_primary &&
          post.id !== primaryPost.id,
      ),
    )
    .filter((post): post is NonNullable<typeof post> => post !== undefined);

  return (
    <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 className="mb-4 w-full text-start text-4xl font-bold text-white">
        Destaques
      </h2>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.76fr)_minmax(0,1fr)]">
        <FeaturedCard
          isSmall={false}
          title={primaryPost.title}
          category={primaryPost.category}
          published_at={primaryPost.published_at}
          cover_url={primaryPost.cover_url}
          excerpt={primaryPost.excerpt}
          read_time={primaryPost.read_time}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-1">
          {secondaryPosts.map(post => (
            <FeaturedCard
              key={post.id}
              isSmall={true}
              title={post.title}
              category={post.category}
              published_at={post.published_at}
              cover_url={post.cover_url}
              excerpt={post.excerpt}
              read_time={post.read_time}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
