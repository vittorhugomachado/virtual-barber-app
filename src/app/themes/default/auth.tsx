import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@/app/lib/supabase";
import { useAuthStore } from "@/app/store/auth-store";
import { useBarbershop } from "../../hooks/use-barbershop";
import { Button } from "../../components/ui/button";
import { FaWhatsapp } from "react-icons/fa";
import { BarbershopLogo } from "./components/logo-text";
import { formatPhone } from "@/utils/format-phone";
import {
  getCustomerFromAuthUser,
  getPostAuthRedirectPath,
} from "@/app/lib/auth";

const OTP_CHANNEL: "sms" | "whatsapp" = "whatsapp";

interface RequestWhatsAppLoginResponse {
  code: string;
  whatsappUrl: string;
  expiresInSeconds: number;
}

export default function DefaultAuthPage() {
  const navigate = useNavigate();
  const { setCustomer, setLoading, isLoading } = useAuthStore();
  const { slug } = useParams<{ slug: string }>();
  const { data } = useBarbershop(slug ?? "");
  const [searchParams] = useSearchParams();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [error, setError] = useState("");
  const [whatsappLoginCode, setWhatsappLoginCode] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const from = searchParams.get("from");

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { data: existingCustomer, error: customerError } =
          await getCustomerFromAuthUser(session.user);

        if (customerError || !existingCustomer) {
          setError("Nao foi possivel carregar sua sessao. Tente novamente.");
          return;
        }

        setCustomer({
          ...existingCustomer,
          barbershop_id: data?.id ?? null,
        });
        navigate(getPostAuthRedirectPath(slug, from), { replace: true });
      }
    });
  }, [slug, navigate, setCustomer, from, data?.id]);

  function toE164(formatted: string) {
    const digits = formatted.replace(/\D/g, "");
    return `+55${digits}`;
  }

  async function handleSendOtp() {
    setError("");
    setWhatsappLoginCode("");
    setWhatsappUrl("");
    const digits = phone.replace(/\D/g, "");

    if (digits.length !== 11) {
      setError("Digite um numero de celular valido com DDD.");
      return;
    }

    if (!data?.id || !data?.slug) {
      setError("Nao foi possivel carregar os dados da barbearia.");
      return;
    }

    setLoading(true);
    try {
      const { data: loginData, error } =
        await supabase.functions.invoke<RequestWhatsAppLoginResponse>(
          "request-whatsapp-login",
          {
            body: {
              barbershop_id: data.id,
              barbershop_name: data.name,
              slug: data.slug,
              phone: digits,
            },
          },
        );

      if (error) {
        setError(error.message || "Nao foi possivel gerar o codigo.");
        return;
      }

      if (!loginData?.code || !loginData?.whatsappUrl) {
        setError("A funcao nao retornou o codigo esperado.");
        return;
      }

      setWhatsappLoginCode(loginData.code);
      setWhatsappUrl(loginData.whatsappUrl);
      setStep("otp");

      console.log("Codigo WhatsApp criado com sucesso", {
        expiresInSeconds: loginData.expiresInSeconds,
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    setError("");
    setLoading(true);

    try {
      const e164Phone = toE164(phone);
      const {
        data: { session },
        error,
      } = await supabase.auth.verifyOtp({
        phone: e164Phone,
        token: otp,
        type: "sms",
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (!session) {
        setError("Código inválido ou sessão não iniciada.");
        return;
      }

      const user = session.user;

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          { id: user.id, role: "customer" },
          { onConflict: "id", ignoreDuplicates: true },
        );

      if (profileError) {
        setError("Nao foi possivel finalizar seu cadastro. Tente novamente.");
        return;
      }

      const { error: customerUpsertError } = await supabase
        .from("customers_auth")
        .upsert(
        {
          auth_user_id: user.id,
          phone: user.phone?.replace(/^55/, "") ?? null,
          name: "",
        },
        { onConflict: "auth_user_id", ignoreDuplicates: true },
      );

      if (customerUpsertError) {
        setError("Nao foi possivel salvar seus dados. Tente novamente.");
        return;
      }

      const { data: customerAuth, error: customerFetchError } = await supabase
        .from("customers_auth")
        .select("id, name, phone")
        .eq("auth_user_id", user.id)
        .single();

      if (customerFetchError || !customerAuth) {
        setError("Nao foi possivel carregar seu perfil. Tente novamente.");
        return;
      }

      setCustomer({
        id: customerAuth.id ?? user.id,
        name:
          customerAuth.name ||
          (user.user_metadata?.full_name ?? user.user_metadata?.name ?? ""),
        phone: customerAuth.phone ?? user.phone?.replace(/^55/, "") ?? "",
        auth_user_id: user.id,
        barbershop_id: data?.id ?? null,
      });
      navigate(getPostAuthRedirectPath(slug, from), { replace: true });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-(--store-background) text-(--store-text)">
      <header className="fixed top-0 z-50 flex h-14 w-full items-center border-b border-current/15 bg-(--store-background) px-4 backdrop-blur-sm">
        {data?.name && <BarbershopLogo name={data.name} className="text-3xl" />}
      </header>
      <div className="mx-auto w-[90vw] max-w-md rounded-2xl border border-current/10 p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: data?.style.primary_color }}>
            <FaWhatsapp
              size={24}
              style={{color: data?.style.background_color}}
            />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {step === "phone" ? "Entrar" : "Confirmar código"}
          </h1>
          <p className="mt-1 text-sm text-current">
            {step === "phone"
              ? from === "agendar"
                ? "Para agendar, informe seu whatsapp"
                : "Informe seu whatsapp"
              : `Enviamos um código para ${phone} via ${OTP_CHANNEL === "sms" ? "SMS" : "WhatsApp"}`}
          </p>
        </div>

        {step === "phone" ? (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-current">
                Telefone
              </label>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={e => setPhone(formatPhone(e.target.value))}
                className="h-11 w-full rounded-xl border border-current bg-transparent px-4 text-sm transition-colors outline-none placeholder:text-current/60 focus:ring-2 focus:ring-current/60"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button
              className="h-11 w-full gap-2 rounded-xl hover:opacity-85"
              style={{ backgroundColor: data?.style.primary_color, color: data?.style.text_button_color }}
              onClick={handleSendOtp}
              disabled={isLoading || phone.replace(/\D/g, "").length < 10}
            >
              <FaWhatsapp size={16} />
              {OTP_CHANNEL === "sms"
                ? "Enviar código por SMS"
                : "Enviar código"}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {whatsappLoginCode && (
              <div className="rounded-xl border border-current/20 p-4 text-center">
                <p className="text-sm text-current/80">Seu codigo e</p>
                <p className="mt-1 text-3xl font-semibold tracking-[0.2em]">
                  {whatsappLoginCode}
                </p>
              </div>
            )}
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium hover:opacity-85"
                style={{ backgroundColor: data?.style.primary_color, color: data?.style.text_button_color }}
              >
                <FaWhatsapp size={16} />
                Enviar codigo no WhatsApp
              </a>
            )}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-current">
                Código de verificação
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="000000"
                maxLength={6}
                value={otp}
                onChange={e =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="h-11 w-full rounded-xl border border-current bg-transparent px-4 text-sm transition-colors outline-none placeholder:text-current/60 focus:ring-2 focus:ring-current/60"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button
              className="h-11 w-full gap-2 rounded-xl hover:opacity-85"
              style={{ backgroundColor: data?.style.primary_color, color: data?.style.text_button_color }}
              onClick={handleVerifyOtp}
              disabled={isLoading || otp.length < 6}
            >
              Verificar
            </Button>
            <button
              className="text-sm text-current underline-offset-4 hover:underline"
              onClick={() => {
                setStep("phone");
                setOtp("");
                setError("");
                setWhatsappLoginCode("");
                setWhatsappUrl("");
              }}
            >
              Usar outro número
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
