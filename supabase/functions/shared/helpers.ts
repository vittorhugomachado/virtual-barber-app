import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient, type SupabaseClient } from "jsr:@supabase/supabase-js@2";

export const APP_BASE_URL =
  Deno.env.get("APP_BASE_URL") ?? "https://virtualbarber.com.br";
export const WHATSAPP_GRAPH_VERSION =
  Deno.env.get("WHATSAPP_GRAPH_VERSION") ?? "v25.0";

// Headers compartilhados para permitir chamadas do frontend e preflight OPTIONS.
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

// Padroniza respostas JSON das functions com CORS e Content-Type corretos.
export function jsonResponse(
  body: unknown,
  status = 200,
  headers: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      ...headers,
      "Content-Type": "application/json",
    },
  });
}

// Le variavel obrigatoria e falha cedo quando a function estiver mal configurada.
export function getRequiredEnv(name: string): string {
  const value = Deno.env.get(name);

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

// Cria cliente Supabase com service role para operacoes protegidas por RLS.
// Este cliente so roda dentro da Edge Function, nunca no frontend.
export function createServiceClient(): SupabaseClient {
  return createClient(
    getRequiredEnv("SUPABASE_URL"),
    getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

// Normaliza telefones brasileiros para o formato esperado pelo WhatsApp: 55 + DDD + numero.
// Aceita entradas com mascara, com ou sem DDI 55, e remove prefixo 0 quando informado.
export function normalizeBrazilianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const withoutTrunkPrefix = digits.startsWith("0") ? digits.slice(1) : digits;

  if (
    withoutTrunkPrefix.startsWith("55") &&
    (withoutTrunkPrefix.length === 12 || withoutTrunkPrefix.length === 13)
  ) {
    return withoutTrunkPrefix;
  }

  if (withoutTrunkPrefix.length === 10 || withoutTrunkPrefix.length === 11) {
    return `55${withoutTrunkPrefix}`;
  }

  throw new Error("Numero de WhatsApp invalido. Informe DDD + numero.");
}

// Retorna variantes brasileiras equivalentes com e sem o nono digito.
// Alguns webhooks da Meta podem entregar o remetente sem o 9 apos o DDD.
export function getBrazilianPhoneVariants(phone: string): string[] {
  const normalized = normalizeBrazilianPhone(phone);
  const variants = new Set([normalized]);

  if (normalized.startsWith("55") && normalized.length === 13) {
    variants.add(`${normalized.slice(0, 4)}${normalized.slice(5)}`);
  }

  if (normalized.startsWith("55") && normalized.length === 12) {
    variants.add(`${normalized.slice(0, 4)}9${normalized.slice(4)}`);
  }

  return Array.from(variants);
}

// Gera um codigo numerico de 6 digitos usando crypto.getRandomValues.
// O codigo e mostrado ao usuario e depois validado pelo webhook.
export function generateSixDigitCode(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);

  return (array[0] % 1_000_000).toString().padStart(6, "0");
}

// Gera token de login unico com 32 bytes aleatorios, retornado em hexadecimal.
// O token puro so aparece no link enviado ao cliente; no banco fica apenas o hash.
export function generateSecureToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);

  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

// Calcula SHA-256 em hexadecimal para comparar tokens sem armazenar o valor puro.
export async function sha256(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hashBuffer), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}

// Procura exatamente um codigo de 6 digitos dentro da mensagem recebida.
// Mensagens sem esse padrao sao ignoradas pelo webhook.
export function extractSixDigitCode(text: string): string | null {
  const match = text.match(/(?:^|\D)(\d{6})(?!\d)/);

  return match?.[1] ?? null;
}

// Monta o link publico de entrada da barbearia, com token quando for o link final.
export function buildLoginUrl(slug?: string | null, token?: string): string {
  const safeSlug = slug?.trim();
  const path = safeSlug ? `/${encodeURIComponent(safeSlug)}/entrar` : "/entrar";
  const url = new URL(path, APP_BASE_URL);

  if (token) {
    url.searchParams.set("token", token);
  }

  return url.toString();
}

// Envia texto pelo WhatsApp Cloud API usando o phone_number_id que recebeu a mensagem.
export async function sendWhatsAppText(
  phoneNumberId: string,
  to: string,
  text: string,
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://graph.facebook.com/${WHATSAPP_GRAPH_VERSION}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getRequiredEnv("WHATSAPP_TOKEN")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: {
            preview_url: true,
            body: text,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("WhatsApp API send failed", {
        status: response.status,
        body: errorBody,
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error("WhatsApp API send error", error);
    return false;
  }
}
