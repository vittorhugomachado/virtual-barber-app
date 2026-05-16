import { useMemo, useState } from "react";
import { Pencil, Phone, User } from "lucide-react";
import { supabase } from "@/app/lib/supabase";
import { useAuthStore } from "@/app/store/auth-store";
import { useStyle } from "../../../contexts/style-context/style-context";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { formatPhone } from "@/utils/format-phone";
import { darkenColor } from "@/utils/darken-color";

function hasValidName(value: string) {
  return value.trim().length >= 2;
}

export function CustomerProfileCard() {
  const { customer, setCustomer } = useAuthStore();
  const { style } = useStyle();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState(customer?.name?.trim() ?? "");

  const initials = useMemo(() => {
    const value = (customer?.name ?? "").trim();
    if (!value) return null;
    return value
      .split(/\s+/)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase())
      .join("");
  }, [customer?.name]);

  if (!customer) return null;
  const currentCustomer = customer;

  async function handleSave() {
    const normalizedName = name.trim();

    if (!hasValidName(normalizedName)) {
      setError("Informe um nome com pelo menos 2 letras.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { error: updateError } = await supabase.rpc(
        "vb_update_customer_profile",
        {
          p_name: normalizedName,
        },
      );

      if (updateError) {
        setError("Não foi possível atualizar seu nome. Tente novamente.");
        return;
      }

      await supabase.auth.updateUser({
        data: {
          name: normalizedName,
          full_name: normalizedName,
        },
      });

      setCustomer({ ...currentCustomer, name: normalizedName });
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div
        style={{
          backgroundColor: darkenColor(style.background_color, 0.15),
        }}
        className="mb-6 flex flex-col gap-4 rounded-3xl border border-current/15 p-5 shadow-sm"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full text-sm font-semibold"
              style={{
                backgroundColor: `${style.primary_color}20`,
                color: style.primary_color,
                border: `2px solid ${style.primary_color}`,
              }}
            >
              {initials || <User size={22} />}
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-xs tracking-wide text-current/70 uppercase">
                Seu perfil
              </p>
              <h2 className="text-xl font-semibold">
                {currentCustomer.name?.trim() || "Cliente"}
              </h2>
              <div className="flex items-center gap-1.5 text-sm text-current/70">
                <Phone size={14} />
                <span>{formatPhone(currentCustomer.phone)}</span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            className="gap-2 rounded-full border-current bg-transparent hover:bg-current/10 hover:text-current"
            onClick={() => {
              setName(currentCustomer.name?.trim() ?? "");
              setError("");
              setOpen(true);
            }}
          >
            <Pencil size={14} />
            Editar nome
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="mx-auto w-[90vw] max-w-md rounded-2xl"
          style={{ backgroundColor: style.background_color }}
        >
          <DialogHeader>
            <DialogTitle>Editar nome</DialogTitle>
            <DialogDescription>
              Atualize como deseja ser identificado nos seus agendamentos.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-current">
              Como podemos te chamar?
            </label>
            <input
              type="text"
              value={name}
              onChange={event => {
                setName(event.target.value);
                if (error) setError("");
              }}
              placeholder="Digite seu nome"
              className={`h-11 w-full rounded-xl bg-transparent px-4 text-sm ring-offset-2 transition-colors outline-none placeholder:text-current focus:ring-2 ${
                error
                  ? "border border-red-500 focus:ring-red-500 dark:border-red-500"
                  : "border border-current focus:ring-current"
              }`}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              className="rounded-xl"
              style={{
                backgroundColor: "green",
                color: "white",
              }}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
