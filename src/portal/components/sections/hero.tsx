import { FeaturedCard } from "../cards/featured-card";
import { PostsSkeleton } from "../skeleton/posts-skeleton";
import { useFeaturedPosts } from "@/portal/contexts/featured-posts/featured-posts-context";
import { toPortalCardPost } from "@/portal/lib/post-presenter";
import { PORTAL_CATEGORIES } from "@/portal/types/portal-types";

export function SectionHero() {
  const { posts, isLoading } = useFeaturedPosts();

  if (isLoading) return <PostsSkeleton bgDark={true} />;

  const primaryPost = posts.find(post => post.is_primary);

  if (!primaryPost) return null;

  const heroPost = toPortalCardPost(primaryPost);
  const secondaryPosts = Object.keys(PORTAL_CATEGORIES)
    .map(category =>
      posts.find(
        post =>
          post.category === category &&
          post.is_primary &&
          post.id !== primaryPost.id,
      ),
    )
    .filter(post => post !== undefined)
    .map(toPortalCardPost);

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
          published_at={heroPost.published_at}
          cover_url={heroPost.cover_url}
          excerpt={heroPost.excerpt}
          read_time={heroPost.read_time}
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
