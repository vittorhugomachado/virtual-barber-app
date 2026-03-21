import { useParams } from "react-router-dom";

export function LogoMobileMenu() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <a href={`/${slug}`} className="translate-y-0.5">
      <img
        src="/logo-light.png"
        alt="logo"
        className="dark:hidde ml-3 h-8 w-fit object-contain"
      />
      <img
        src="/logo-dark.png"
        alt="logo"
        className="ml-3 hidden h-8 w-fit object-contain dark:block"
      />
    </a>
  );
}

export function Logo() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <a className="flex items-center translate-y-0.5" href={`/${slug}`}>
      <img
        src="/logo-light.png"
        alt="logo"
        className="dark:hidde h-8 w-auto object-contain"
      />
      <img
        src="/logo-dark.png"
        alt="logo"
        className="hidden h-8 w-auto object-contain dark:block"
      />
    </a>
  );
}
