import { useEffect } from "react";

export function NotFoundPage() {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-medium">404</h1>
      <p className="text-neutral-500">Barbearia nao encontrada.</p>
    </div>
  );
}
