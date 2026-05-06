import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {
  buildLoginUrl,
  corsHeaders,
  createServiceClient,
  extractSixDigitCode,
  generateSecureToken,
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

Deno.serve(async (req) => {
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
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
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

          const text = message.text?.body ?? "";
          const code = extractSixDigitCode(text);

          // No code means no auth intent. Return OK without replying.
          if (!code || !message.from) {
            continue;
          }

          let normalizedFrom: string;
          try {
            // O "from" do WhatsApp vem como numero em formato internacional.
            normalizedFrom = normalizeBrazilianPhone(message.from);
          } catch {
            continue;
          }

          console.log("WhatsApp auth message parsed", {
            phoneNumberId,
            fromLast4: normalizedFrom.slice(-4),
            hasSixDigitCode: true,
          });

          // Valida o codigo e ja marca como usado em uma operacao so.
          // Isso evita que o mesmo codigo seja processado duas vezes em corrida.
          const { data: loginCode, error: loginCodeError } = await supabase
            .from("whatsapp_login_codes")
            .update({ used: true })
            .eq("code", code)
            .eq("phone", normalizedFrom)
            .eq("used", false)
            .gt("expires_at", new Date().toISOString())
            .select("id, barbershop_id, phone")
            .maybeSingle();

          if (loginCodeError) {
            console.error("Failed to validate WhatsApp login code", loginCodeError);
            await sendInvalidCodeMessage(supabase, phoneNumberId, normalizedFrom, code);
            continue;
          }

          if (!loginCode) {
            await sendInvalidCodeMessage(supabase, phoneNumberId, normalizedFrom, code);
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
              "Erro ao processar login. Solicite um novo codigo e tente novamente.",
            );
            continue;
          }

          // Cria um token descartavel de 10 minutos e salva apenas seu hash.
          const tokenInsert = await insertLoginToken(
            supabase,
            loginCode.barbershop_id,
            normalizedFrom,
          );

          if (!tokenInsert) {
            await sendWhatsAppText(
              phoneNumberId,
              normalizedFrom,
              "Erro ao processar login. Solicite um novo codigo e tente novamente.",
            );
            continue;
          }

          const loginLink = buildLoginUrl(barbershop.slug, tokenInsert.token);
          // O token puro vai somente no link enviado pelo WhatsApp.
          const successMessage =
            `Parabens! Seu codigo foi confirmado. Clique no link abaixo para acessar a ${barbershop.name}: ${loginLink}`;

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
  const expiresAt = new Date(Date.now() + TOKEN_TTL_SECONDS * 1000).toISOString();

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const token = generateSecureToken();
    const tokenHash = await sha256(token);

    const { error } = await supabase
      .from("whatsapp_login_tokens")
      .insert({
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

// Quando o codigo nao e valido, responde com link para pedir outro codigo.
async function sendInvalidCodeMessage(
  supabase: ReturnType<typeof createServiceClient>,
  phoneNumberId: string,
  to: string,
  code: string,
): Promise<void> {
  const slug = await findBestSlugForPhone(supabase, to, code);
  const loginUrl = buildLoginUrl(slug);
  const message =
    `O codigo que voce enviou e invalido ou esta expirado. Voce pode solicitar um novo codigo no link abaixo: ${loginUrl}`;

  await sendWhatsAppText(phoneNumberId, to, message);
}

// Tenta descobrir o slug mais provavel para montar o link de erro.
// Como o schema atual nao tem whatsapp_phone_number_id em barbershops, usamos
// o historico de codigos do telefone como fallback.
async function findBestSlugForPhone(
  supabase: ReturnType<typeof createServiceClient>,
  phone: string,
  code: string,
): Promise<string | null> {
  // Sem uma coluna whatsapp_phone_number_id em barbershops, o melhor fallback
  // e usar o historico de codigos do proprio telefone.
  const { data: codeRecord } = await supabase
    .from("whatsapp_login_codes")
    .select("barbershop_id")
    .eq("phone", phone)
    .eq("code", code)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: latestCodeRecord } = codeRecord
    ? { data: codeRecord }
    : await supabase
      .from("whatsapp_login_codes")
      .select("barbershop_id")
      .eq("phone", phone)
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
