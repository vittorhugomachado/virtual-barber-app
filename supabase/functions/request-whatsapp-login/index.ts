import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {
  corsHeaders,
  createServiceClient,
  generateSixDigitCode,
  getRequiredEnv,
  jsonResponse,
  normalizeBrazilianPhone,
} from "../shared/helpers.ts";

interface RequestBody {
  barbershop_id?: string;
  barbershop_name?: string;
  slug?: string;
  phone?: string;
}

const CODE_TTL_SECONDS = 10 * 60;

Deno.serve(async (req) => {
  // Responde preflight do navegador antes do POST real.
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Esta function so cria solicitacoes de login, entao nao aceita GET/PUT/etc.
  if (req.method !== "POST") {
    return jsonResponse({ error: "Metodo nao permitido" }, 405);
  }

  // Le o JSON enviado pelo frontend: barbershop_id, slug e telefone do cliente.
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "JSON invalido" }, 400);
  }

  const barbershopId = body.barbershop_id?.trim();
  const slug = body.slug?.trim();
  const phone = body.phone?.trim();

  // Validacao minima para evitar consultas e inserts com dados incompletos.
  if (!barbershopId || !slug || !phone) {
    return jsonResponse({ error: "barbershop_id, slug e phone sao obrigatorios" }, 400);
  }

  let normalizedPhone: string;
  let systemNumber: string;
  try {
    // Normaliza o telefone do cliente e o numero oficial do sistema para wa.me.
    normalizedPhone = normalizeBrazilianPhone(phone);
    systemNumber = normalizeBrazilianPhone(getRequiredEnv("WHATSAPP_SYSTEM_NUMBER"));
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Telefone invalido" },
      400,
    );
  }

  try {
    const supabase = createServiceClient();

    // Confere slug e id juntos para evitar gerar codigo para outra barbearia.
    const { data: barbershop, error: barbershopError } = await supabase
      .from("barbershops")
      .select("id, name, slug, is_active")
      .eq("id", barbershopId)
      .eq("slug", slug)
      .single();

    if (barbershopError || !barbershop) {
      return jsonResponse({ error: "Barbearia nao encontrada" }, 404);
    }

    // Impede login em barbearias desativadas.
    if (barbershop.is_active === false) {
      return jsonResponse({ error: "Barbearia inativa" }, 403);
    }

    // Apenas o codigo mais recente fica utilizavel para este telefone/barbearia.
    const { error: invalidateError } = await supabase
      .from("whatsapp_login_codes")
      .update({ used: true })
      .eq("barbershop_id", barbershop.id)
      .eq("phone", normalizedPhone)
      .eq("used", false);

    if (invalidateError) {
      console.error("Failed to invalidate previous WhatsApp login codes", invalidateError);
      return jsonResponse({ error: "Erro ao preparar novo codigo" }, 500);
    }

    const expiresAt = new Date(Date.now() + CODE_TTL_SECONDS * 1000).toISOString();
    let code = generateSixDigitCode();
    let codeAvailable = false;

    // Evita colisao improvavel com codigo ativo do mesmo telefone/barbearia.
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const { data: existingCode, error: existingError } = await supabase
        .from("whatsapp_login_codes")
        .select("id")
        .eq("barbershop_id", barbershop.id)
        .eq("phone", normalizedPhone)
        .eq("code", code)
        .eq("used", false)
        .gt("expires_at", new Date().toISOString())
        .maybeSingle();

      if (existingError) {
        console.error("Failed to check WhatsApp login code collision", existingError);
        return jsonResponse({ error: "Erro ao gerar codigo" }, 500);
      }

      if (!existingCode) {
        codeAvailable = true;
        break;
      }

      code = generateSixDigitCode();
    }

    if (!codeAvailable) {
      return jsonResponse({ error: "Nao foi possivel gerar codigo unico" }, 500);
    }

    // Cria o registro que sera validado depois pelo whatsapp-webhook.
    const { error: insertError } = await supabase
      .from("whatsapp_login_codes")
      .insert({
        barbershop_id: barbershop.id,
        phone: normalizedPhone,
        code,
        used: false,
        expires_at: expiresAt,
      });

    if (insertError) {
      console.error("Failed to save WhatsApp login code", insertError);
      return jsonResponse({ error: "Erro ao salvar codigo" }, 500);
    }

    // Em producao, evite logar o codigo. Ele volta ao frontend por regra do fluxo.
    // O frontend exibe o codigo e oferece este link para o cliente enviar a mensagem.
    const whatsappText = encodeURIComponent(`Olá, meu código é ${code}`);
    const whatsappUrl = `https://wa.me/${systemNumber}?text=${whatsappText}`;

    return jsonResponse({
      code,
      whatsappUrl,
      expiresInSeconds: CODE_TTL_SECONDS,
    });
  } catch (error) {
    console.error("request-whatsapp-login failed", error);
    return jsonResponse({ error: "Erro interno ao solicitar login" }, 500);
  }
});
