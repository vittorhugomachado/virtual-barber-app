import { FaInstagram, FaTiktok, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { RiThreadsLine } from "react-icons/ri";

type SocialBarProps = {
  className?: string;
  variant?: "sidebar";
};

const LINKS = [
  { href: "https://www.instagram.com/appvirtualbarber/", icon: <FaInstagram />, label: "Instagram" },
  { href: "https://www.tiktok.com/@appvirtualbarber", icon: <FaTiktok />, label: "TikTok" },
  { href: "https://www.facebook.com/profile.php?id=61575426003642", icon: <FaFacebook />, label: "Facebook" },
  { href: "https://x.com/virtualbarber_", icon: <FaXTwitter />, label: "X (Twitter)" },
  { href: "https://www.threads.com/@appvirtualbarber", icon: <RiThreadsLine />, label: "Threads" },
];

export function SocialBar({ className, variant }: SocialBarProps) {
  if (variant === "sidebar") {
    return (
      <div className="absolute inset-y-0 left-6 z-40 hidden w-10 xl:block">
        <div className="sticky top-[calc(50vh-124px)] flex flex-col gap-3 py-8">
          {LINKS.map(({ href, icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg text-[#050419] shadow-sm transition-all duration-200 hover:scale-110 hover:bg-[#0458EE] hover:text-white"
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <ul className={className}>
      {LINKS.map(({ href, icon, label }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#0458EE] transition-all duration-300"
          >
            {icon}
          </a>
        </li>
      ))}
    </ul>
  );
}
