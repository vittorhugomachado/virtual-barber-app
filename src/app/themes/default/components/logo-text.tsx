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
      className={`font-semibold tracking-tight text-(--store-text) my-2 ${className ?? ""}`}
    >
      {name}
    </a>
  );
}
