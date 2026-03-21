import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../../../components/ui/sheet";
import { useAuth } from "../../../hooks/use-auth";
import { Logo, LogoMobileMenu } from "../../../components/logo";

type navBarProps = {
  isPreview: boolean;
};
export function Navbar({ isPreview }: navBarProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  function handleAgendar() {
    if (isPreview) return;
    navigate(`/${slug}/agendar`);
  }

  function handlePerfil() {
    if (isPreview) return;
    navigate(`/${slug}/perfil`);
  }
console.log(isAuthenticated)
  const navLinks = (
    <>
      {isAuthenticated ? (
        <>
          <button
            onClick={handlePerfil}
            className="text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            Meus agendamentos
          </button>
          <button
            onClick={signOut}
            className="text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            Sair
          </button>
        </>
      ) : (
        <button
          onClick={() => !isPreview && navigate(`/${slug}/entrar`)}
          className="cursor-pointer text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
        >
          Entrar
        </button>
      )}
      <Button
        onClick={handleAgendar}
        className="rounded-full bg-neutral-900 px-5 text-sm text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
      >
        Agendar
      </Button>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-screen border-b border-neutral-200 bg-white/90 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/90">
      <div className="mx-auto flex h-14 items-center justify-between px-6">
        {/* logo */}
        <Logo />

        {/* desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">{navLinks}</nav>

        {/* mobile nav */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="p-2 text-neutral-600 dark:text-neutral-400">
                {isOpen ? (
                  <X size={20} color="red" />
                ) : (
                  <Menu size={20} color="red" />
                )}
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="flex w-fit flex-col gap-6 pt-3"
            >
              <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
              <SheetDescription className="sr-only">
                Links de navegação do site
              </SheetDescription>
              <LogoMobileMenu />
              <nav className="mx-auto flex max-w-40 flex-col gap-4">
                {navLinks}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
