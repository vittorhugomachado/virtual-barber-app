import { useParams } from "react-router-dom";

export function PostsByTagPage() {
  const { tag } = useParams<{ tag: string }>();

  return <div data-tag={tag ?? ""} />;
}
