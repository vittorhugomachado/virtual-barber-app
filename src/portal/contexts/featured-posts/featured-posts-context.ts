import { createContext, useContext } from "react";
import type { Post } from "@/portal/types/portal-types";

export type FeaturedPostsContextValue = {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
};

export const FeaturedPostsContext =
  createContext<FeaturedPostsContextValue | null>(null);

export function useFeaturedPosts() {
  const context = useContext(FeaturedPostsContext);

  if (!context) {
    throw new Error(
      "useFeaturedPosts must be used within a FeaturedPostsProvider",
    );
  }

  return context;
}
