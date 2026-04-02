import type { Post } from "@/portal/types/portal-types";

function toReadableDate(value: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function toReadTime(content: string, excerpt: string) {
  const source = content || excerpt;
  const words = source.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));

  return `${minutes} min`;
}

export function toPortalCardPost(post: Post) {
  return {
    id: post.id,
    title: post.title,
    category: post.category,
    date: toReadableDate(post.published_at ?? post.created_at),
    imageUrl: post.cover_url,
    description: post.excerpt,
    readTime: toReadTime(post.content, post.excerpt),
  };
}
