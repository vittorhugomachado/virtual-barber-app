import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuthStore } from "../../store/auth-store";
import { useBarbershop } from "../../hooks/use-barbershop";
import { Button } from "../../components/ui/button";
import { FaWhatsapp } from "react-icons/fa";
import { BarbershopLogo } from "./components/logo-text";
import { formatPhone } from "../../utils/format-phone";

const OTP_CHANNEL: "sms" | "whatsapp" = "sms";

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
  const from = searchParams.get("from");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setCustomer(session.user)
        navigate(`/${slug}`, { replace: true });
      }
    });
  }, [slug, navigate]);

  function toE164(formatted: string) {
    const digits = formatted.replace(/\D/g, "");
    return `+55${digits}`;
  }

  async function handleSendOtp() {
  setError("");
  const digits = phone.replace(/\D/g, "");
  
  if (digits.length !== 11) {
    setError("Digite um número de celular válido com DDD.");
    return;
  }

  setLoading(true);
  try {
    const e164Phone = toE164(phone);

    const { error } = await supabase.auth.signInWithOtp({
      phone: e164Phone,
      options: { channel: OTP_CHANNEL },
    });

    if (error) {

      setError(error.message);
      return;
    }

    setStep("otp");
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

      await supabase.from("profiles").upsert(
        { id: user.id, role: "customer" },
        { onConflict: "id", ignoreDuplicates: true }
      );

      if (data?.id) {
        const { data: existing } = await supabase
          .from("customers")
          .select("id")
          .eq("auth_user_id", user.id)
          .eq("barbershop_id", data.id)
          .maybeSingle();

        if (!existing) {
          await supabase.from("customers").insert({
            barbershop_id: data.id,
            auth_user_id: user.id,
            phone: user.phone,
            name: null,
          });
        }
      }

      setCustomer(user);
      navigate(`/${slug}`, { replace: true });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-950">
      <header className="fixed top-0 z-50 flex h-14 w-full items-center border-b border-neutral-200 bg-white/90 px-4 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/90">
        {data?.name && <BarbershopLogo name={data.name} className="text-3xl" />}
      </header>
      <div className="mx-auto w-[90vw] max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <FaWhatsapp
              size={24}
              className="text-green-600 dark:text-green-400"
            />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {step === "phone" ? "Entrar" : "Confirmar código"}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {step === "phone"
              ? from === "agendar"
                ? "Para agendar, informe seu telefone"
                : "Informe seu número de telefone"
              : `Enviamos um código para ${phone} via ${OTP_CHANNEL === "sms" ? "SMS" : "WhatsApp"}`}
          </p>
        </div>

        {step === "phone" ? (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Telefone
              </label>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={e => setPhone(formatPhone(e.target.value))}
                className="h-11 w-full rounded-xl border border-neutral-200 bg-transparent px-4 text-sm ring-offset-2 transition-colors outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:focus:ring-neutral-100"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button
              className="h-11 w-full gap-2 rounded-xl bg-green-600 hover:bg-green-700"
              onClick={handleSendOtp}
              disabled={isLoading || phone.replace(/\D/g, "").length < 10}
            >
              <FaWhatsapp size={16} />
              {OTP_CHANNEL === "sms" ? "Enviar código por SMS" : "Enviar código pelo WhatsApp"}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
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
                className="h-11 w-full rounded-xl border border-neutral-200 bg-transparent px-4 text-center text-lg tracking-widest ring-offset-2 transition-colors outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-900 dark:border-neutral-700 dark:focus:ring-neutral-100"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button
              className="h-11 w-full rounded-xl"
              onClick={handleVerifyOtp}
              disabled={isLoading || otp.length < 6}
            >
              Verificar
            </Button>
            <button
              className="text-sm text-neutral-500 underline-offset-4 hover:underline"
              onClick={() => {
                setStep("phone");
                setOtp("");
                setError("");
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
