import { useState } from "react";
import { FaInstagram, FaTiktok, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { RiThreadsLine } from "react-icons/ri";

type PostShareSidebarProps = {
  url: string;
  title: string;
};

type CopiedState = "instagram" | "tiktok" | null;

export function PostShareSidebar({ url, title }: PostShareSidebarProps) {
  const [copied, setCopied] = useState<CopiedState>(null);

  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
    twitter: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`,
    threads: `https://www.threads.net/intent/post?text=${encodedTitle}%20${encoded}`,
  };

  function copyLink(platform: CopiedState) {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(platform);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  const btnBase =
    "relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#050419] shadow-sm transition-all duration-200 hover:scale-110 hover:bg-[#0458EE] hover:text-white text-lg";

  return (
    <aside className="fixed top-1/2 left-6 z-40 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
      {/* Facebook */}
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartilhar no Facebook"
        className={btnBase}
      >
        <FaFacebook />
      </a>

      {/* Twitter / X */}
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartilhar no X (Twitter)"
        className={btnBase}
      >
        <FaXTwitter />
      </a>

      {/* Threads */}
      <a
        href={shareLinks.threads}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartilhar no Threads"
        className={btnBase}
      >
        <RiThreadsLine />
      </a>

      {/* Instagram — copia o link */}
      <button
        onClick={() => copyLink("instagram")}
        aria-label="Copiar link para compartilhar no Instagram"
        className={btnBase}
      >
        <FaInstagram />
        {copied === "instagram" && (
          <span className="absolute -right-24 whitespace-nowrap rounded bg-neutral-900 px-2 py-1 text-xs text-white">
            Link copiado!
          </span>
        )}
      </button>

      {/* TikTok — copia o link */}
      <button
        onClick={() => copyLink("tiktok")}
        aria-label="Copiar link para compartilhar no TikTok"
        className={btnBase}
      >
        <FaTiktok />
        {copied === "tiktok" && (
          <span className="absolute -right-24 whitespace-nowrap rounded bg-neutral-900 px-2 py-1 text-xs text-white">
            Link copiado!
          </span>
        )}
      </button>
    </aside>
  );
}
