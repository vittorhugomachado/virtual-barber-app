import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Post } from "../types/portal-types";
import { getPostBySlug } from "../lib/queries";
import { Header } from "../components/header";
import { PostMain } from "../components/main/post";
import { Footer } from "../components/footer";
import { PostMainSkeleton } from "../components/skeleton/post-skeleton";

export function PostPage() {
  const [postData, setPostData] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { tag, post } = useParams<{ tag: string; post: string }>();

  useEffect(() => {
    let active = true;

    async function fetchPost() {
      if (!post || !tag) {
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
  }, [post, tag]);

  return (
    <>
      <Header />
      {isLoading && <PostMainSkeleton />}
      {!isLoading && !error && postData && (
        <PostMain post={postData} />
      )}
      <Footer />
    </>
  );
}
