import { useEffect, useMemo, useState } from "react";
import { Header } from "../components/header";
import { HeroMain } from "../components/main/home";
import { Footer } from "../components/footer";
import { FeaturedPostsProvider } from "../contexts/featured-posts/featured-posts-provider";
import { getFeaturedPosts } from "../lib/queries";
import type { PortalPost, Post } from "../types/portal-types";
import { PostsSkeleton } from "../components/skeleton/posts-skeleton";
import { toPortalCardPost } from "../lib/post-presenter";

export function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchFeaturedPosts() {
      setIsLoading(true);
      setError(null);

      const result = await getFeaturedPosts();

      if (!active) return;

      setPosts(result);
      setIsLoading(false);

      if (result.length === 0) {
        setError("Nenhum post em destaque encontrado.");
      }
    }

    void fetchFeaturedPosts();

    return () => {
      active = false;
    };
  }, []);

  const featuredPostsValue = useMemo(
    () => ({
      posts: posts.map(toPortalCardPost) as PortalPost[],
      isLoading,
      error,
    }),
    [posts, isLoading, error],
  );

  return (
    <FeaturedPostsProvider value={featuredPostsValue}>
      <div className="relative min-h-screen bg-[#050419]">
        <Header />
        {isLoading ? <PostsSkeleton bgDark={true} /> : <HeroMain />}
        <Footer />
      </div>
    </FeaturedPostsProvider>
  );
}
