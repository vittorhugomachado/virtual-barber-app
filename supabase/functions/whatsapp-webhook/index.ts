import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {
  buildLoginUrl,
  corsHeaders,
  createServiceClient,
  extractSixDigitCodeCandidates,
  generateSecureToken,
  getBrazilianPhoneVariants,
  normalizeBrazilianPhone,
  sendWhatsAppText,
  sha256,
} from "../shared/helpers.ts";

interface WhatsAppTextMessage {
  from?: string;
  id?: string;
  timestamp?: string;
  type?: string;
  text?: {
    body?: string;
  };
}

interface WhatsAppChangeValue {
  metadata?: {
    phone_number_id?: string;
  };
  messages?: WhatsAppTextMessage[];
  statuses?: unknown[];
}

interface WhatsAppPayload {
  object?: string;
  entry?: Array<{
    id?: string;
    changes?: Array<{
      value?: WhatsAppChangeValue;
    }>;
  }>;
}

const TOKEN_TTL_SECONDS = 10 * 60;

Deno.serve(async req => {
  // Responde preflight CORS, util para testes manuais e chamadas de browser.
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Verificacao inicial exigida pela Meta ao configurar o webhook.
  if (req.method === "GET") {
    const url = new URL(req.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge") ?? "";
    const verifyToken = Deno.env.get("WHATSAPP_VERIFY_TOKEN");

    if (mode === "subscribe" && verifyToken && token === verifyToken) {
      return new Response(challenge, {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    return new Response("Verify token mismatch", { status: 403 });
  }

  // A Meta envia eventos reais por POST; outros metodos nao fazem parte do fluxo.
  if (req.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    // Le o payload completo da Meta, mas so loga um resumo sem codigo/token.
    const payload = (await req.json()) as WhatsAppPayload;

    console.log("WhatsApp webhook received", {
      object: payload.object,
      entryCount: payload.entry?.length ?? 0,
    });

    const supabase = createServiceClient();

    // O payload pode trazer multiplas entries/changes no mesmo POST.
    for (const entry of payload.entry ?? []) {
      for (const change of entry.changes ?? []) {
        const value = change.value;
        const phoneNumberId = value?.metadata?.phone_number_id;

        // Status events are delivery/read updates. They do not belong to auth.
        if (!value?.messages?.length || !phoneNumberId) {
          continue;
        }

        for (const message of value.messages) {
          if (message.type !== "text") {
            continue;
          }

          if (!message.from) {
            continue;
          }

          let normalizedFrom: string;
          try {
            // O "from" do WhatsApp vem como numero em formato internacional.
            normalizedFrom = normalizeBrazilianPhone(message.from);
          } catch {
            continue;
          }

          const phoneVariants = getBrazilianPhoneVariants(normalizedFrom);
          await upsertWhatsAppWindowsForPhone(
            supabase,
            phoneVariants,
            normalizedFrom,
          );

          const text = message.text?.body ?? "";
          const codeCandidates = extractSixDigitCodeCandidates(text);

          // Sem 6 ou 7 digitos, nao ha intencao clara de autenticacao.
          if (!codeCandidates.length) {
            continue;
          }

          console.log("WhatsApp auth message parsed", {
            phoneNumberId,
            fromLast4: normalizedFrom.slice(-4),
            hasSixDigitCode: true,
            codeCandidateCount: codeCandidates.length,
          });

          // Valida o codigo e ja marca como usado em uma operacao so.
          // Isso evita que o mesmo codigo seja processado duas vezes em corrida.
          const { data: loginCode, error: loginCodeError } = await supabase
            .from("whatsapp_login_codes")
            .update({ used: true })
            .in("code", codeCandidates)
            .in("phone", phoneVariants)
            .eq("used", false)
            .gt("expires_at", new Date().toISOString())
            .select("id, barbershop_id, phone")
            .maybeSingle();

          if (loginCodeError) {
            console.error(
              "Failed to validate WhatsApp login code",
              loginCodeError,
            );
            await logInvalidCodeDiagnostics(
              supabase,
              normalizedFrom,
              phoneVariants,
              codeCandidates,
            );
            await sendInvalidCodeMessage(
              supabase,
              phoneNumberId,
              normalizedFrom,
              codeCandidates,
            );
            continue;
          }

          if (!loginCode) {
            const codeWithDifferentPhone =
              await findActiveCodeWithDifferentPhone(
                supabase,
                phoneVariants,
                codeCandidates,
              );

            if (codeWithDifferentPhone) {
              const { data: barbershop } = await supabase
                .from("barbershops")
                .select("slug")
                .eq("id", codeWithDifferentPhone.barbershop_id)
                .maybeSingle();

              await sendWrongPhoneMessage(
                phoneNumberId,
                normalizedFrom,
                buildLoginUrl(barbershop?.slug),
              );
              continue;
            }

            await logInvalidCodeDiagnostics(
              supabase,
              normalizedFrom,
              phoneVariants,
              codeCandidates,
            );
            await sendInvalidCodeMessage(
              supabase,
              phoneNumberId,
              normalizedFrom,
              codeCandidates,
            );
            continue;
          }

          // Depois de validar o codigo, carrega slug/nome para montar mensagem final.
          const { data: barbershop, error: barbershopError } = await supabase
            .from("barbershops")
            .select("id, name, slug")
            .eq("id", loginCode.barbershop_id)
            .single();

          if (barbershopError || !barbershop) {
            console.error("Barbershop not found for WhatsApp login code", {
              barbershopId: loginCode.barbershop_id,
            });
            await sendWhatsAppText(
              phoneNumberId,
              normalizedFrom,
              [
                "❌ Erro ao validar código",
                "Não foi possível validar agora. Solicite um novo código e tente novamente.",
              ].join("\n\n"),
            );
            continue;
          }

          // Cria um token descartavel de 10 minutos e salva apenas seu hash.
          const tokenInsert = await insertLoginToken(
            supabase,
            loginCode.barbershop_id,
            loginCode.phone,
          );

          if (!tokenInsert) {
            await sendWhatsAppText(
              phoneNumberId,
              normalizedFrom,
              [
                "❌ Erro ao validar código",
                "Não foi possível validar agora. Solicite um novo código e tente novamente.",
              ].join("\n\n"),
            );
            continue;
          }

          const loginLink = buildLoginUrl(barbershop.slug, tokenInsert.token);
          // O token puro vai somente no link enviado pelo WhatsApp.
          const successMessage = [
            "✅ Código validado",
            `Seu acesso à ${barbershop.name} foi confirmado. Clique no link abaixo para entrar:`,
            loginLink,
          ].join("\n\n");

          await sendWhatsAppText(phoneNumberId, normalizedFrom, successMessage);
        }
      }
    }
  } catch (error) {
    // Meta retries failed webhooks aggressively, so POST never returns 500.
    console.error("WhatsApp webhook processing failed", error);
  }

  return new Response("OK", { status: 200, headers: corsHeaders });
});

// Insere um token de login unico. Repetimos poucas vezes por seguranca contra
// colisao improvavel na constraint UNIQUE de token_hash.
async function insertLoginToken(
  supabase: ReturnType<typeof createServiceClient>,
  barbershopId: string,
  phone: string,
): Promise<{ token: string } | null> {
  const expiresAt = new Date(
    Date.now() + TOKEN_TTL_SECONDS * 1000,
  ).toISOString();

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const token = generateSecureToken();
    const tokenHash = await sha256(token);

    const { error } = await supabase.from("whatsapp_login_tokens").insert({
      barbershop_id: barbershopId,
      phone,
      token_hash: tokenHash,
      used: false,
      expires_at: expiresAt,
    });

    if (!error) {
      return { token };
    }

    console.error("Failed to insert WhatsApp login token", {
      attempt: attempt + 1,
      code: error.code,
      message: error.message,
    });
  }

  return null;
}

// Verifica se o codigo existe e esta ativo, mas pertence a outro telefone.
async function findActiveCodeWithDifferentPhone(
  supabase: ReturnType<typeof createServiceClient>,
  phoneVariants: string[],
  codeCandidates: string[],
): Promise<{ barbershop_id: string } | null> {
  const { data, error } = await supabase
    .from("whatsapp_login_codes")
    .select("id, phone, barbershop_id")
    .in("code", codeCandidates)
    .eq("used", false)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Failed to inspect active WhatsApp login code phone", error);
    return null;
  }

  const differentPhoneRecord = (data ?? []).find(
    record => !phoneVariants.includes(record.phone),
  );

  return differentPhoneRecord
    ? { barbershop_id: differentPhoneRecord.barbershop_id }
    : null;
}

async function upsertWhatsAppWindowsForPhone(
  supabase: ReturnType<typeof createServiceClient>,
  phoneVariants: string[],
  normalizedPhone: string,
): Promise<void> {
  const nowIso = new Date().toISOString();
  const { data: customers, error } = await supabase
    .from("customers")
    .select("id, barbershop_id, phone")
    .in("phone", phoneVariants)
    .eq("auth", true);

  if (error) {
    console.error("Failed to fetch customers for WhatsApp window", {
      message: error.message,
      phoneLast4: normalizedPhone.slice(-4),
    });
    return;
  }

  const windowsByKey = new Map<
    string,
    {
      barbershop_id: string;
      customer_id: string;
      phone: string;
      last_message_at: string;
      updated_at: string;
    }
  >();

  for (const customer of customers ?? []) {
    if (!customer.barbershop_id || !customer.phone) {
      continue;
    }

    windowsByKey.set(`${customer.barbershop_id}:${customer.phone}`, {
      barbershop_id: customer.barbershop_id,
      customer_id: customer.id,
      phone: customer.phone,
      last_message_at: nowIso,
      updated_at: nowIso,
    });
  }

  const windowRows = Array.from(windowsByKey.values());

  if (windowRows.length === 0) {
    return;
  }

  for (const windowRow of windowRows) {
    const { error: upsertError } = await supabase.rpc(
      "upsert_whatsapp_window",
      {
        p_barbershop_id: windowRow.barbershop_id,
        p_customer_id: windowRow.customer_id,
        p_phone: windowRow.phone,
        p_last_message_at: windowRow.last_message_at,
      },
    );

    if (upsertError) {
      console.error("Failed to upsert WhatsApp window", {
        message: upsertError.message,
        phoneLast4: normalizedPhone.slice(-4),
        barbershopId: windowRow.barbershop_id,
      });

      continue;
    }

    const { error: refreshError } = await supabase.rpc(
      "refresh_manual_reminder_groups_after_whatsapp_window",
      {
        p_barbershop_id: windowRow.barbershop_id,
        p_customer_id: windowRow.customer_id,
        p_phone: windowRow.phone,
      },
    );

    if (refreshError) {
      console.error("Failed to refresh reminder groups after WhatsApp window", {
        message: refreshError.message,
        phoneLast4: normalizedPhone.slice(-4),
        barbershopId: windowRow.barbershop_id,
      });
    }
  }
}

function formatBrazilianPhoneForMessage(
  phone: string,
  withoutNine?: boolean,
): string {
  const digits = phone.replace(/\D/g, "").replace(/^55/, "");

  if (digits.length === 10) {
    let formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;

    if (!withoutNine) {
      formatted = `(${digits.slice(0, 2)}) 9${digits.slice(2, 6)}-${digits.slice(6)}`;
    }

    return formatted;
  }

  if (digits.length === 11) {
    let formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;

    if (!withoutNine) {
      formatted = `(${digits.slice(0, 2)}) 9${digits.slice(3, 8)}-${digits.slice(8)}`;
    }

    return formatted;
  }

  return `+${phone.replace(/\D/g, "")}`;
}

async function sendWrongPhoneMessage(
  phoneNumberId: string,
  to: string,
  loginUrl: string,
): Promise<void> {
  const formattedPhone = formatBrazilianPhoneForMessage(to, false);
  const message = [
    "⚠️ Número diferente",
    `O número que você digitou na página é diferente desse que você está usando. Por favor insira seu número atual ${formattedPhone}:`,
    loginUrl,
  ].join("\n\n");

  await sendWhatsAppText(phoneNumberId, to, message);
}

// Loga por que um codigo nao passou na validacao sem expor o codigo completo.
async function logInvalidCodeDiagnostics(
  supabase: ReturnType<typeof createServiceClient>,
  normalizedFrom: string,
  phoneVariants: string[],
  codeCandidates: string[],
): Promise<void> {
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from("whatsapp_login_codes")
    .select("id, phone, used, expires_at, created_at")
    .in("code", codeCandidates)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Failed to inspect invalid WhatsApp login code", error);
    return;
  }

  console.log("WhatsApp login code did not match active record", {
    nowIso,
    fromLast4: normalizedFrom.slice(-4),
    fromLength: normalizedFrom.length,
    phoneVariantLengths: phoneVariants.map(phone => phone.length),
    codeCandidateCount: codeCandidates.length,
    records: (data ?? []).map(record => ({
      id: record.id,
      phoneLast4: record.phone?.slice(-4),
      phoneLength: record.phone?.length,
      phoneMatches: phoneVariants.includes(record.phone),
      used: record.used,
      expiresAt: record.expires_at,
      expired:
        new Date(record.expires_at).getTime() <= new Date(nowIso).getTime(),
      createdAt: record.created_at,
    })),
  });
}

// Quando o codigo nao e valido, responde com link para pedir outro codigo.
async function sendInvalidCodeMessage(
  supabase: ReturnType<typeof createServiceClient>,
  phoneNumberId: string,
  to: string,
  codeCandidates: string[],
): Promise<void> {
  const slug = await findBestSlugForPhone(supabase, to, codeCandidates);
  const loginUrl = buildLoginUrl(slug);
  const message = [
    "❌ Código inválido",
    "O código que você enviou é inválido ou está expirado. Solicite um novo código no link abaixo:",
    loginUrl,
  ].join("\n\n");

  await sendWhatsAppText(phoneNumberId, to, message);
}

// Tenta descobrir o slug mais provavel para montar o link de erro.
// Como o schema atual nao tem whatsapp_phone_number_id em barbershops, usamos
// o historico de codigos do telefone como fallback.
async function findBestSlugForPhone(
  supabase: ReturnType<typeof createServiceClient>,
  phone: string,
  codeCandidates: string[],
): Promise<string | null> {
  const phoneVariants = getBrazilianPhoneVariants(phone);

  // Sem uma coluna whatsapp_phone_number_id em barbershops, o melhor fallback
  // e usar o historico de codigos do proprio telefone.
  const { data: codeRecord } = await supabase
    .from("whatsapp_login_codes")
    .select("barbershop_id")
    .in("phone", phoneVariants)
    .in("code", codeCandidates)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: latestCodeRecord } = codeRecord
    ? { data: codeRecord }
    : await supabase
        .from("whatsapp_login_codes")
        .select("barbershop_id")
        .in("phone", phoneVariants)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

  const barbershopId = latestCodeRecord?.barbershop_id;
  if (!barbershopId) {
    return null;
  }

  const { data: barbershop } = await supabase
    .from("barbershops")
    .select("slug")
    .eq("id", barbershopId)
    .maybeSingle();

  return barbershop?.slug ?? null;
}
