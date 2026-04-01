import { useParams } from "react-router-dom";

interface BarbershopLogoProps {
  name: string;
  className?: string;
}

export function BarbershopLogo({ name, className }: BarbershopLogoProps) {
  const { slug } = useParams<{ slug: string }>();
  return (
    <a
      href={`/${slug}`}
      className={`font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 ${className ?? ""}`}
    >
      {name}
    </a>
  );
}
