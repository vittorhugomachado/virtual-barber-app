import { useStyle } from "@/app/contexts/style-context/style-context";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

interface ExpiredLoginLinkModalProps {
  open: boolean;
  onEnter: () => void;
  onContinueWithoutLogin: () => void;
}

export function ExpiredLoginLinkModal({
  open,
  onEnter,
  onContinueWithoutLogin,
}: ExpiredLoginLinkModalProps) {
  const { style } = useStyle();

  return (
    <Dialog
      open={open}
      onOpenChange={nextOpen => {
        if (!nextOpen) {
          onContinueWithoutLogin();
        }
      }}
    >
      <DialogContent className="mx-auto w-[90vw] max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Link expirado</DialogTitle>
          <DialogDescription>
            Parece que voce acessou um link ja expirado, para acessar sua conta
            e preciso fazer o login novamente.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={onContinueWithoutLogin}
          >
            Continuar sem entrar
          </Button>
          <Button
            style={{
              backgroundColor: style.primary_color,
              color: style.text_button_color,
            }}
            className="rounded-xl"
            onClick={onEnter}
          >
            Entrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
