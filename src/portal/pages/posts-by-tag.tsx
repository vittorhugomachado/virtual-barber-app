import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Post } from "../types/portal-types";
import { getPostsByTag } from "../lib/queries";

export function PostsByTagPage() {
  const [postsList, setpostsList] = useState<Post[] | null>(null);
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

      setpostsList(result);
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

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  console.log(postsList);
  return (
    <div>
      <h1>{tag}</h1>
      <p>{postsList?.length ?? 0}</p>
    </div>
  );
}
