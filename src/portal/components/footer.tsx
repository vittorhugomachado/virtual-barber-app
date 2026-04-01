import { SocialBar } from "./social-bar";

export function Footer() {
  return (
    <footer className="relative bottom-0 flex h-76 sm:h-66 w-full flex-col items-center justify-center rounded-t-3xl bg-[#050419]">
      <div className="absolute bottom-6 left-6 flex flex-col gap-0">
        <img
          src="/logo-text-virtual.png"
          alt="logo-text-virtual"
          className="w-31 sm:w-43 translate-y-1.5"
        />
        <img
          src="/logo-text-barber.png"
          alt="logo-text-barber"
          className="w-30 sm:w-43 -translate-y-1.5"
        />
      </div>
      <SocialBar className="flex gap-3 text-3xl text-white -translate-y-4" />
      <img
        src="/logo-arrow.png"
        alt="logo-arrow"
        className="absolute top-1 right-1 w-16 sm:w-23"
      />
      <span className="text-xs text-neutral-700 absolute bottom-1">Direitos autorais © 2026 Virtual Barber</span>
    </footer>
  );
}
