import { useParams } from "react-router-dom";
import { useBarbershop } from "../hooks/use-barbershop";
import { ThemeResolver } from "../themes/resolver";
import { NotFoundPage } from "./not-found-page";

export function BarbershopPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = useBarbershop(slug ?? "");

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-800" />
      </div>
    );
  }

  if (error || !data) return <NotFoundPage />;

  return <ThemeResolver {...data} plan={data.plan} />;
}
