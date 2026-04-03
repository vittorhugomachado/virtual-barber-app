import { createContext, useContext } from "react";
import type { PortalPost } from "@/portal/types/portal-types";

export type FeaturedPostsContextValue = {
  posts: PortalPost[];
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
