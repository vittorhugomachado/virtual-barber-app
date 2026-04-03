import { House, Menu, X } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";
import { Logo } from "./logo";

const navItems = [
  { label: "Produtos", href: "/portal/produtos" },
  { label: "Tendências", href: "/portal/tendencias" },
  { label: "Dicas", href: "/portal/dicas" },
  { label: "Estilo", href: "/portal/estilo" },
  { label: "Saúde", href: "/portal/saude" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isActivePath = (href: string) => location.pathname === href;

  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto flex h-16 w-full items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-100 px-4 md:justify-center md:px-4 lg:px-10">
        <Logo isDarkLogo={false} />
        <div className="shrink-0 bg-neutral-100 md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full text-neutral-950 transition-colors hover:bg-neutral-100"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              style={{ maxWidth: "100vw" }}
              className="h-dvh w-screen border-r-0 px-5 pt-5 pb-8"
              showCloseButton={false}
            >
              <SheetTitle className="sr-only">Menu principal</SheetTitle>
              <SheetDescription className="sr-only">
                Navegacao principal em tela cheia.
              </SheetDescription>

              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between gap-4 pb-5">
                  <Logo isDarkLogo={false} />
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Fechar menu"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full text-neutral-950 transition-colors hover:bg-neutral-100"
                  >
                    <X size={20} />
                  </button>
                </div>

                <nav
                  aria-label="Navegacao mobile"
                  className="flex flex-1 flex-col justify-between py-8"
                >
                  <div className="space-y-2">
                    <a
                      href="/"
                      aria-label="Ir para a home do portal"
                      className="block rounded-[1.5rem] px-5 py-2 font-light text-neutral-900 transition-colors hover:bg-neutral-50"
                    >
                      <House size={23} style={{ fontWeight: "100" }} />
                    </a>
                    {navItems.map(item => (
                      <a
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-md font-semilight block rounded-[1.5rem] px-5 py-2 text-neutral-900 transition-colors hover:bg-neutral-50"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="mx-auto hidden h-12 items-center gap-6 border-b border-[#171532] bg-[#050419] px-4 md:flex md:px-4 lg:px-10">
        <div className="flex w-full justify-center gap-2">
          <nav
            aria-label="Navegacao principal"
            className="hidden items-center gap-7 md:flex lg:gap-7"
          >
            <a
              href="/"
              aria-label="Ir para a home do portal"
              className={`flex h-12 items-center border-b-3 transition-colors ${
                isActivePath("/")
                  ? "border-b-[#0458EE] text-neutral-100"
                  : "border-b-transparent text-neutral-100 hover:text-neutral-300"
              }`}
            >
              <House size={23} />
            </a>
            {navItems.map(item => (
              <a
                key={item.label}
                href={item.href}
                className={`text-md font-semilight h-[90%] flex items-center text-neutral-100 transition-colors hover:text-neutral-300 border-b-3 lg:text-lg ${
                  isActivePath(item.href)
                    ? "border-b-[#0458EE] text-neutral-100"
                    : "border-b-transparent text-neutral-100 hover:text-neutral-300"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
