import { supabase } from "./supabase";
import type { Post } from "@/portal/types/portal-types";

export async function getAllPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      title,
      slug,
      excerpt,
      content,
      cover_url,
      category,
      tags,
      meta_title,
      meta_description,
      status,
      published_at,
      created_at,
      updated_at,
      featured,
      is_primary,
      display_order
    `,
    )
    .eq("status", "published")
    .order("display_order", { ascending: true });
  console.log("dados do getAllPosts: ", data);

  if (error || !data) return [];

  return data as Post[];
}

export async function getFeaturedPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      title,
      slug,
      excerpt,
      content,
      cover_url,
      category,
      tags,
      meta_title,
      meta_description,
      status,
      published_at,
      created_at,
      updated_at,
      featured,
      is_primary,
      display_order
    `,
    )
    .eq("status", "published")
    .eq("featured", true)
    .order("display_order", { ascending: true });
  console.log("dados do getFeaturedPosts: ", data);
  if (error || !data) return [];

  return data as Post[];
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      title,
      slug,
      excerpt,
      content,
      cover_url,
      category,
      tags,
      meta_title,
      meta_description,
      status,
      published_at,
      created_at,
      updated_at,
      featured,
      is_primary,
      display_order
    `,
    )
    .eq("status", "published")
    .eq("category", tag)
    .order("display_order", { ascending: true });

  if (error || !data) return [];
  console.log("dados do getPostsByTag: ", data);
  return data as Post[];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      title,
      slug,
      excerpt,
      content,
      cover_url,
      category,
      tags,
      meta_title,
      meta_description,
      status,
      published_at,
      created_at,
      updated_at,
      featured,
      is_primary,
      display_order
    `,
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) return null;
  console.log("dados do getPostBySlug: ", data);
  return data as Post;
}
