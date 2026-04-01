import { Menu, X } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";
import { Logo } from "./logo";

const navItems = [
  { label: "Tendências", href: "/tendencias" },
  { label: "Gestão", href: "/gestao" },
  { label: "Conheça", href: "/conheca" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 items-center justify-between gap-6 px-4 md:px-4 lg:px-10">
        <Logo isDarkLogo={false} />
        <div className="w-full flex gap-2 justify-end">
          <nav
            aria-label="Navegacao principal"
            className="hidden mx-auto items-center gap-4 md:flex lg:gap-7"
          >
            {navItems.map(item => (
              <a
                key={item.label}
                href={item.href}
                className="text-md font-semilight text-neutral-900 transition-colors hover:text-neutral-950 lg:text-lg"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-0 md:flex">
            <a
              href="/entrar"
              className="text-md text-md font-semilight rounded-full pl-4 pr-3 py-2.5 text-neutral-900 transition-colors hover:text-neutral-950 lg:text-lg"
            >
              Entrar
            </a>
            <a
              href="/comecar-gratis"
              className="text-md rounded-full bg-[#0458EE] px-3 py-3 font-semibold text-white transition-all duration-300 hover:bg-[#004cd1] lg:text-lg"
            >
              Começar grátis
            </a>
          </div>
        </div>

        <div className="md:hidden">
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
                    {navItems.map(item => (
                      <a
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-md font-semilight block rounded-[1.5rem] border border-neutral-200 px-5 py-4 text-neutral-900 transition-colors hover:bg-neutral-50"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-col gap-3 pt-6">
                    <a
                      href="/entrar"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-md font-semilight rounded-full border border-neutral-200 px-5 py-3 text-center text-neutral-900 transition-colors hover:bg-neutral-100"
                    >
                      Entrar
                    </a>
                    <a
                      href="/comecar-gratis"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-full bg-[#0458EE] px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
                    >
                      Começar grátis
                    </a>
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
