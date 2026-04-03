import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Post } from "../types/portal-types";
import { getPostBySlug } from "../lib/queries";

export function PostPage() {
  const [postData, setPostData] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { tag, post } = useParams<{ tag: string; post: string }>();

  useEffect(() => {
    let active = true;

    async function fetchPost() {
      if (!post) {
        setError("Post nao encontrado.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      const result = await getPostBySlug(post);

      if (!active) return;

      setPostData(result);
      setIsLoading(false);

      if (!result) {
        setError("Post nao encontrado.");
      }
    }

    void fetchPost();

    return () => {
      active = false;
    };
  }, [post]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
console.log(postData)
  return (
    <div>
      <h1>{postData?.title ?? "post"}</h1>
      <p>{tag}</p>
      <p>{post}</p>
    </div>
  );
}
