import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ChevronDown, Menu, User, X } from "lucide-react";
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
import { useStyle } from "../../../contexts/style-context/style-context";
import { BarbershopLogo } from "./logo-text";
import { StatusBadge } from "../../../components/status-badge";
import { useBarbershopData } from "../../../contexts/barbershop-data/barbershop-data-context";
import { BookingButton } from "./booking-button";
import { darkenColor } from "@/utils/darken-color";

export function Navbar() {
  const { name, openingHours } = useBarbershopData();
  const { style } = useStyle();
  const { isAuthenticated, signOut } = useAuth();
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const { items } = useCart();
  const navigate = useNavigate();
  const cartCount = items.length;
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const shouldHideScheduleButton = location.pathname.includes("agendar");
  const isPreview =
    new URLSearchParams(window.location.search).get("preview") === "true";

  function handleAgendar() {
    if (isAuthenticated) {
      navigate(`/${slug}/agendar`);
    } else {
      navigate(`/${slug}/entrar?from=agendar`);
    }
  }

  function handlePerfil() {
    navigate(`/${slug}/perfil`);
  }

  async function handleConfirmLogout() {
    setShowLogoutDialog(false);
    await signOut();
  }

  const mobileNavLinks = (
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
          onClick={() => navigate(`/${slug}/entrar`)}
          className="cursor-pointer text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
        >
          Entrar
        </button>
      )}
    </>
  );

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-current/15 bg-(--store-background) px-4 text-(--store-text)">
        <div className="relative mx-auto h-full w-full max-w-6xl">
          <div className="mx-auto flex items-center justify-between">
            {/* logo desktop */}
            <BarbershopLogo name={name} className="hidden text-3xl md:block" />

            {/* desktop nav */}
            <nav className="mr-3 hidden items-center gap-6 md:flex">
              {!shouldHideScheduleButton && <BookingButton />}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen(open => !open)}
                    className="flex items-center gap-2 rounded-full border border-current/50 px-2 py-1.5 transition-colors hover:border-current/60"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-300 text-neutral-600">
                      <User size={16} />
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-current transition-transform ${
                        userMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute top-full right-0 z-50 mt-2 flex min-w-44 flex-col rounded-2xl border border-current/15 p-2 shadow-lg"
                      style={{
                        backgroundColor: darkenColor(
                          style.background_color,
                          0.15,
                        ),
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          handlePerfil();
                        }}
                        className="rounded-xl px-3 py-2 text-left text-sm text-current transition-all hover:scale-102"
                      >
                        Meus agendamentos
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          setShowLogoutDialog(true);
                        }}
                        className="rounded-xl px-3 py-2 text-left text-sm text-current transition-all hover:scale-102"
                      >
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate(`/${slug}/entrar`)}
                  className="cursor-pointer text-sm text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                >
                  Entrar
                </button>
              )}
            </nav>

            {/* logo + status + menu mobile */}
            <div className="flex flex-1 items-center justify-between md:hidden">
              <BarbershopLogo name={name} className="text-2xl" />
              {!isPreview ? (
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
                    <SheetTitle className="sr-only">
                      Menu de navegação
                    </SheetTitle>
                    <SheetDescription className="sr-only">
                      Links de navegação do site
                    </SheetDescription>
                    <div className="flex flex-col gap-1 pl-4">
                      <BarbershopLogo name={name} className="text-2xl" />
                      <StatusBadge openingHours={openingHours} />
                    </div>
                    <nav className="mx-auto flex max-w-40 flex-col gap-4">
                      {!shouldHideScheduleButton && (
                        <Button
                          onClick={handleAgendar}
                          className="relative rounded-full px-5 text-sm"
                          style={{
                            backgroundColor: style.primary_color,
                            color: style.text_button_color,
                          }}
                        >
                          Agendar
                          {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-black bg-white text-[10px] font-bold text-black">
                              {cartCount}
                            </span>
                          )}
                        </Button>
                      )}
                      {mobileNavLinks}
                    </nav>
                  </SheetContent>
                </Sheet>
              ) : (
                <Button
                  onClick={handleAgendar}
                  className="relative rounded-full px-5 text-sm"
                  style={{
                    backgroundColor: style.primary_color,
                    color: style.text_button_color,
                  }}
                >
                  Agendar
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-black bg-white text-[10px] font-bold text-black">
                      {cartCount}
                    </span>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent
          className="mx-auto w-[90vw] max-w-md rounded-2xl"
          style={{
            backgroundColor: style.background_color,
            color: style.text_color,
          }}
        >
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
