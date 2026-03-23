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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { useAuth } from "../../../hooks/use-auth";
import { useCart } from "../../../hooks/use-cart";
import { BarbershopLogo } from "./logo-text";
import { StatusBadge } from "../../../components/status-badge";
import type { OpeningHour } from "../../types";

type navBarProps = {
  barbershopName: string;
  isPreview: boolean;
  primaryColor?: string;
  textButtonColor?: string;
  openingHours: OpeningHour[];
};

export function Navbar({
  isPreview,
  primaryColor,
  textButtonColor,
  barbershopName,
  openingHours,
}: navBarProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, signOut } = useAuth();
  const { items } = useCart();
  const cartCount = items.length;
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  function handleAgendar() {
    if (isPreview) return;
    if (isAuthenticated) {
      navigate(`/${slug}/agendar`);
    } else {
      navigate(`/${slug}/entrar?from=agendar`);
    }
  }

  function handlePerfil() {
    if (isPreview) return;
    navigate(`/${slug}/perfil`);
  }

  async function handleConfirmLogout() {
    setShowLogoutDialog(false);
    await signOut();
  }

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
            onClick={() => setShowLogoutDialog(true)}
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
    </>
  );

  return (
    <>
      <header className="bg-background sticky top-0 z-50 w-full border-b border-neutral-200 px-4 dark:border-neutral-800">
        <div className="relative h-full w-full">
          <div className="mx-auto flex h-14 items-center justify-between">
            {/* logo — desktop */}
            <BarbershopLogo
              name={barbershopName}
              className="hidden text-3xl md:block"
            />

            {/* desktop nav */}
            <nav className="hidden items-center gap-6 md:flex">
              {navLinks}
              <Button
                onClick={handleAgendar}
                className="relative rounded-full px-5 text-sm"
                style={{
                  backgroundColor: primaryColor,
                  color: textButtonColor,
                }}
              >
                Agendar
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-black bg-white text-[10px] font-bold text-black">
                    {cartCount}
                  </span>
                )}
              </Button>
            </nav>

            {/* logo + status + menu — mobile */}
            <div className="flex flex-1 items-center justify-between md:hidden">
              <BarbershopLogo name={barbershopName} className="text-2xl" />
              <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetTrigger asChild>
                  <button className="p-2 text-neutral-600 dark:text-neutral-400">
                    {menuOpen ? <X size={20} /> : <Menu size={20} />}
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
                  <div className="flex flex-col gap-1 pl-4">
                    <BarbershopLogo
                      name={barbershopName}
                      className="text-2xl"
                    />
                    <StatusBadge openingHours={openingHours} />
                  </div>
                  <nav className="mx-auto flex max-w-40 flex-col gap-4">
                    <Button
                      onClick={handleAgendar}
                      className="relative rounded-full px-5 text-sm"
                      style={{
                        backgroundColor: primaryColor,
                        color: textButtonColor,
                      }}
                    >
                      Agendar
                      {cartCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-black bg-white text-[10px] font-bold text-black">
                          {cartCount}
                        </span>
                      )}
                    </Button>
                    {navLinks}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="mx-auto w-[90vw] max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Sair da conta</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja sair? Você precisará fazer login novamente
              para agendar.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setShowLogoutDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              className="rounded-xl"
              onClick={handleConfirmLogout}
            >
              Sair
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
