import { useParams } from "react-router-dom";

export function Logo() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <a className="flex items-center translate-y-0.5" href={`/${slug}`}>
      <img
        src="/logo-light.png"
        alt="logo"
        className="dark:hidden h-8 w-auto object-contain"
      />
      <img
        src="/logo-dark.png"
        alt="logo"
        className="hidden h-8 w-auto object-contain dark:block"
      />
    </a>
  );
}
