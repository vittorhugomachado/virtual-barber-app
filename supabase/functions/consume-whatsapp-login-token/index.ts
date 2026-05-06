import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {
  corsHeaders,
  createServiceClient,
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

    // O frontend usara estes dados para criar a sessao local de 7 dias depois.
    return jsonResponse({
      success: true,
      phone: loginToken.phone,
      barbershopId: loginToken.barbershop_id,
      expiresInDays: 7,
    });
  } catch (error) {
    console.error("consume-whatsapp-login-token failed", error);
    return jsonResponse({ error: "Erro interno ao validar token" }, 500);
  }
});
