import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostsByTag } from "../lib/queries";
import { PostsSkeleton } from "../components/skeleton/posts-skeleton";
import { Header } from "../components/header";
import { CategoryMain } from "../components/main/category";
import { toPortalCardPost } from "../lib/post-presenter";
import {
  PORTAL_CATEGORIES,
  type PortalPost,
  type PortalCategoryKey,
} from "../types/portal-types";

export function CategoryPage() {
  const [postsList, setpostsList] = useState<PortalPost[] | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { tag } = useParams<{ tag: string }>();

  useEffect(() => {
    let active = true;

    async function fetchPostList() {
      if (!tag) {
        setError("Posts não encontrados.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      const result = await getPostsByTag(tag);

      if (!active) return;

      const categoryMeta = PORTAL_CATEGORIES[tag as PortalCategoryKey];

      setCategory(categoryMeta?.label ?? tag);
      setpostsList(result.map(toPortalCardPost));
      setIsLoading(false);

      if (result.length === 0) {
        setError("Posts nao encontrados.");
      }
    }

    void fetchPostList();

    return () => {
      active = false;
    };
  }, [tag]);

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <>
      <Header />
      {isLoading && <PostsSkeleton bgDark={false} />}
      {!isLoading && !error && postsList && category && (
        <CategoryMain category={category} posts={postsList} />
      )}
    </>
  );
}
