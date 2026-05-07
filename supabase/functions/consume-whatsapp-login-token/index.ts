import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {
  corsHeaders,
  createServiceClient,
  getBrazilianPhoneVariants,
  jsonResponse,
  sha256,
} from "../shared/helpers.ts";

interface RequestBody {
  token?: string;
}

Deno.serve(async (req) => {
  // Libera o preflight CORS feito pelo navegador antes da chamada POST.
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Esta function so consome tokens de login unico.
  if (req.method !== "POST") {
    return jsonResponse({ error: "Metodo nao permitido" }, 405);
  }

  // Le o token recebido pelo frontend a partir da URL enviada pelo WhatsApp.
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "JSON invalido" }, 400);
  }

  const token = body.token?.trim();
  // Sem token nao ha como calcular hash nem validar o login.
  if (!token) {
    return jsonResponse({ error: "Token e obrigatorio" }, 400);
  }

  try {
    // Nunca consulta pelo token puro: primeiro transforma em SHA-256.
    const tokenHash = await sha256(token);
    const now = new Date().toISOString();
    const supabase = createServiceClient();

    // Marca e retorna em uma unica operacao para reduzir chance de reuso.
    const { data: loginToken, error } = await supabase
      .from("whatsapp_login_tokens")
      .update({ used: true, used_at: now })
      .eq("token_hash", tokenHash)
      .eq("used", false)
      .gt("expires_at", now)
      .select("id, barbershop_id, phone")
      .maybeSingle();

    if (error || !loginToken) {
      return jsonResponse({ error: "Token invalido ou expirado" }, 401);
    }

    const phoneVariants = getBrazilianPhoneVariants(loginToken.phone);

    // Garante que o login por WhatsApp esteja representado na tabela customers.
    // A tabela customers_auth sera descontinuada para este fluxo.
    const { data: existingCustomer, error: customerFetchError } = await supabase
      .from("customers")
      .select("id, barbershop_id, name, phone, auth")
      .eq("barbershop_id", loginToken.barbershop_id)
      .in("phone", phoneVariants)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (customerFetchError) {
      console.error("Failed to fetch WhatsApp customer", customerFetchError);
      return jsonResponse({ error: "Erro ao carregar cliente" }, 500);
    }

    const { data: customer, error: customerWriteError } = existingCustomer
      ? await supabase
        .from("customers")
        .update({
          auth: true,
          phone: loginToken.phone,
          updated_at: now,
        })
        .eq("id", existingCustomer.id)
        .select("id, barbershop_id, name, phone, auth")
        .single()
      : await supabase
        .from("customers")
        .insert({
          barbershop_id: loginToken.barbershop_id,
          phone: loginToken.phone,
          name: "",
          auth: true,
          updated_at: now,
        })
        .select("id, barbershop_id, name, phone, auth")
        .single();

    if (customerWriteError || !customer) {
      console.error("Failed to persist WhatsApp customer", customerWriteError);
      return jsonResponse({ error: "Erro ao criar sessao do cliente" }, 500);
    }

    // O frontend usa estes dados para criar a sessao local persistida.
    return jsonResponse({
      success: true,
      customer: {
        id: customer.id,
        name: customer.name ?? "",
        phone: customer.phone ?? loginToken.phone,
        barbershop_id: customer.barbershop_id,
        auth: customer.auth === true,
      },
      phone: customer.phone ?? loginToken.phone,
      barbershopId: customer.barbershop_id,
      expiresInDays: 7,
    });
  } catch (error) {
    console.error("consume-whatsapp-login-token failed", error);
    return jsonResponse({ error: "Erro interno ao validar token" }, 500);
  }
});
