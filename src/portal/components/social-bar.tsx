import { FaInstagram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { RiThreadsLine } from "react-icons/ri";

export function SocialBar({ className }: { className?: string }) {
  return (
    <ul className={`${className}`}>
      <li>
        <a href="https://www.instagram.com/appvirtualbarber/" target="_blank" className="hover:text-[#0458EE] transition-all duration-300">
          <FaInstagram />
        </a>
      </li>
      <li>
        <a href="https://www.tiktok.com/@appvirtualbarber" target="_blank" className="hover:text-[#0458EE] transition-all duration-300">
          <FaTiktok />
        </a>
      </li>
      <li>
        <a href="https://www.facebook.com/profile.php?id=61575426003642" target="_blank" className="hover:text-[#0458EE] transition-all duration-300">
          <FaFacebook />
        </a>
      </li>
      <li>
        <a href="https://x.com/virtualbarber_" target="_blank" className="hover:text-[#0458EE] transition-all duration-300">
          <FaXTwitter />
        </a>
      </li>
      <li>
        <a href="https://www.threads.com/@appvirtualbarber" target="_blank" className="hover:text-[#0458EE] transition-all duration-300">
          <RiThreadsLine />
        </a>
      </li>
    </ul>
  );
}
