import {
  corsHeaders,
  createServiceClient,
  generateSecureToken, // ← ADICIONAR ESTE
  getBrazilianPhoneVariants,
  jsonResponse,
  sha256,
} from "../shared/helpers.ts";

interface RequestBody {
  token?: string;
}

interface authUserResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

async function createOrGetAuthUserWithSession(
  supabase: ReturnType<typeof createServiceClient>,
  customer: {
    id: string;
    barbershop_id: string;
    name?: string | null;
    phone: string;
  },
): Promise<{
  userId: string;
  access_token: string;
  refresh_token: string;
} | null> {
  const email = `${customer.barbershop_id}.${customer.phone}@whatsapp-login.virtualbarber.com.br`;
  const password = generateSecureToken();

  // Tenta criar usuário no Auth
  const { data: createdUser, error: createError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        customer_id: customer.id,
        barbershop_id: customer.barbershop_id,
        phone: customer.phone,
        login_provider: "whatsapp",
      },
    });

  let userId: string | null = null;

  if (createdUser?.user) {
    userId = createdUser.user.id;
  } else if (createError) {
    // Busca usuário existente
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const user = existingUser.users.find(u => u.email === email);
    if (user) {
      userId = user.id;
      // Atualiza senha do usuário existente
      await supabase.auth.admin.updateUserById(userId, { password });
    }
  }

  if (!userId) return null;

  // 🔑 FAZ LOGIN para obter os tokens
  const { data: signIn, error: signInError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (signInError || !signIn.session) {
    console.error("Failed to sign in:", signInError);
    return null;
  }

  return {
    userId,
    access_token: signIn.session.access_token,
    refresh_token: signIn.session.refresh_token,
  };
}

Deno.serve(async req => {
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
      .select("id, barbershop_id, name, phone, auth, auth_user_id")
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

    const authSession = await createOrGetAuthUserWithSession(
      supabase,
      customer,
    );

    if (!authSession) {
      return jsonResponse({ error: "Erro ao criar sessão" }, 500);
    }

    await supabase
      .from("customers")
      .update({ auth_user_id: authSession.userId })
      .eq("id", customer.id);

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
      session: {
        access_token: authSession.access_token,
        refresh_token: authSession.refresh_token,
      },
      userId: authSession.userId,
      expiresInDays: 7,
    });
  } catch (error) {
    console.error("consume-whatsapp-login-token failed", error);
    return jsonResponse({ error: "Erro interno ao validar token" }, 500);
  }
});
