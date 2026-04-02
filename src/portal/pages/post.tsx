import { useParams } from "react-router-dom";

export function PostPage() {
  const { tag, idPost } = useParams<{ tag: string; idPost: string }>();

  return <div data-tag={tag ?? ""} data-post-id={idPost ?? ""} />;
}
