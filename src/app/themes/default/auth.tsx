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
import type { Customer } from "../types";

interface RequestWhatsAppLoginResponse {
  code: string;
  whatsappUrl: string;
  expiresInSeconds: number;
}

interface ConsumeWhatsAppLoginTokenResponse {
  success: boolean;
  customer: Customer;
  expiresInDays: number;
}

export default function DefaultAuthPage() {
  const navigate = useNavigate();
  const { isAuthenticated, setCustomer, setLoading, isLoading } = useAuthStore();
  const { slug } = useParams<{ slug: string }>();
  const { data } = useBarbershop(slug ?? "");
  const [searchParams] = useSearchParams();
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [error, setError] = useState("");
  const [whatsappLoginCode, setWhatsappLoginCode] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [isConsumingLoginToken, setIsConsumingLoginToken] = useState(false);
  const from = searchParams.get("from");
  const loginToken = searchParams.get("token");

  useEffect(() => {
    if (isAuthenticated && !loginToken) {
      navigate(getPostAuthRedirectPath(slug, from), { replace: true });
      return;
    }

    if (loginToken) {
      setError("");
      setIsConsumingLoginToken(true);
      setLoading(true);
      console.log("Consumindo token de login WhatsApp", {
        tokenLength: loginToken.length,
        slug,
      });

      supabase.functions
        .invoke<ConsumeWhatsAppLoginTokenResponse>(
          "consume-whatsapp-login-token",
          {
            body: { token: loginToken },
          },
        )
        .then(({ data: tokenData, error: tokenError }) => {
          console.log("Resposta consume-whatsapp-login-token", {
            hasData: Boolean(tokenData),
            hasError: Boolean(tokenError),
            success: tokenData?.success === true,
          });

          if (tokenError || !tokenData?.success || !tokenData.customer) {
            setError("Link de login invalido ou expirado. Solicite um novo codigo.");
            return;
          }

          setCustomer(tokenData.customer);
          navigate(getPostAuthRedirectPath(slug, from), { replace: true });
        })
        .finally(() => {
          setLoading(false);
          setIsConsumingLoginToken(false);
        });

      return;
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { data: existingCustomer, error: customerError } =
          await getCustomerFromAuthUser(session.user);

        if (customerError || !existingCustomer) {
          // setError("Nao foi possivel carregar sua sessao. Tente novamente.");
          return;
        }

        setCustomer({
          ...existingCustomer,
          barbershop_id: data?.id ?? null,
        });
        navigate(getPostAuthRedirectPath(slug, from), { replace: true });
      }
    });
  }, [
    isAuthenticated,
    slug,
    navigate,
    setCustomer,
    setLoading,
    from,
    data?.id,
    loginToken,
  ]);

  async function handleSendOtp() {
    setError("");
    setWhatsappLoginCode("");
    setWhatsappUrl("");
    const digits = phone.replace(/\D/g, "");

    if (digits.length !== 11) {
      setError("Digite um número de celular válido com DDD.");
      return;
    }

    if (!data?.id || !data?.slug) {
      setError("Não foi possível carregar os dados da barbearia.");
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
        setError("A função não retornou o código esperado.");
        return;
      }

      setWhatsappLoginCode(loginData.code);
      setWhatsappUrl(loginData.whatsappUrl);
      setStep("otp");

      console.log("Código WhatsApp criado com sucesso", {
        expiresInSeconds: loginData.expiresInSeconds,
      });
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
        {isConsumingLoginToken ? (
          <div className="py-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Entrando...
            </h1>
            <p className="mt-2 text-sm text-current">
              Validando seu link de acesso pelo WhatsApp.
            </p>
            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
          </div>
        ) : (
          <>
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: data?.style.primary_color }}>
            <FaWhatsapp
              size={24}
              style={{color: data?.style.text_button_color}}
            />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {step === "phone" ? "Entrar" : "Confirmar código"}
          </h1>
          <p className="mt-1 text-sm text-current">
            {step === "phone"
              ? from === "agendar"
                ? "Para agendar, informe seu whatsApp"
                : "Informe seu whatsapp"
              : `Clique no botão abaixo e envie seu código pelo WhatsApp para entrar.`}
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
                onChange={e => {
                  setPhone(formatPhone(e.target.value))
                  setError("")
                }}
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
              Gerar código
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {whatsappLoginCode && (
              <div className="rounded-xl border border-current/20 p-4 text-center">
                <p className="text-sm text-current/80">Seu código é</p>
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
                Confirmar Whatsapp
              </a>
            )}
            <button
              className="text-sm text-current underline-offset-4 hover:underline"
              onClick={() => {
                setStep("phone");
                setError("");
                setWhatsappLoginCode("");
                setWhatsappUrl("");
              }}
            >
              Usar outro número
            </button>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
}
