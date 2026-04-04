import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostsByTag } from "../lib/queries";
import { PostListSkeleton } from "../components/skeleton/post-list-skeleton";
import { Header } from "../components/header";
import { CategoryMain } from "../components/main/category";
import { toPortalCardPost } from "../lib/post-presenter";
import {
  PORTAL_CATEGORIES,
  type PortalPost,
  type PortalCategoryKey,
} from "../types/portal-types";
import { Footer } from "../components/footer";
import { ErrorState } from "../components/error-state";

const SITE_URL = "https://virtualbarber.com.br";

function setMetaAttribute(
  selector: string,
  attribute: "name" | "property",
  key: string,
  content: string,
) {
  let meta = document.querySelector(selector) as HTMLMetaElement | null;

  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attribute, key);
    document.head.appendChild(meta);
  }

  meta.content = content;
}

function setCanonical(href: string) {
  let canonical = document.querySelector(
    'link[rel="canonical"]',
  ) as HTMLLinkElement | null;

  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }

  canonical.href = href;
}

export function CategoryPage() {
  const [postsList, setpostsList] = useState<PortalPost[] | null>(null);
  const [category, setCategory] = useState<string | null>(null);
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

      const categoryMeta = PORTAL_CATEGORIES[tag as PortalCategoryKey];

      setCategory(categoryMeta?.label ?? tag);
      setpostsList(result.map(toPortalCardPost));
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

  useEffect(() => {
    if (!tag || !category) return;

    const categoryUrl = `${SITE_URL}/portal/${tag}`;
    const title = `${category} | Virtual Barber`;
    const description = `Confira os melhores posts de ${category.toLowerCase()} no portal Virtual Barber.`;

    document.title = title;
    setCanonical(categoryUrl);
    setMetaAttribute(
      'meta[name="description"]',
      "name",
      "description",
      description,
    );
    setMetaAttribute('meta[name="robots"]', "name", "robots", "index, follow");
    setMetaAttribute(
      'meta[property="og:title"]',
      "property",
      "og:title",
      title,
    );
    setMetaAttribute(
      'meta[property="og:description"]',
      "property",
      "og:description",
      description,
    );
    setMetaAttribute(
      'meta[property="og:url"]',
      "property",
      "og:url",
      categoryUrl,
    );
    setMetaAttribute(
      'meta[name="twitter:title"]',
      "name",
      "twitter:title",
      title,
    );
    setMetaAttribute(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      description,
    );
  }, [tag, category]);

  return (
    <>
      <Header />
      {isLoading && <PostListSkeleton bgDark={false} />}
      {!isLoading && error && <ErrorState isDark={false} message={error} />}
      {!isLoading && !error && postsList && category && (
        <CategoryMain key={tag} category={category} posts={postsList} />
      )}
      <Footer />
    </>
  );
}
