import type { ReactNode } from "react";
import type { FeaturedPostsContextValue } from "./featured-posts-context";
import { FeaturedPostsContext } from "./featured-posts-context";

interface FeaturedPostsProviderProps {
  children: ReactNode;
  value: FeaturedPostsContextValue;
}

export function FeaturedPostsProvider({
  children,
  value,
}: FeaturedPostsProviderProps) {
  return (
    <FeaturedPostsContext.Provider value={value}>
      {children}
    </FeaturedPostsContext.Provider>
  );
}
