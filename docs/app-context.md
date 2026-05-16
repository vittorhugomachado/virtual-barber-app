# Contexto especifico do projeto

Este projeto e o app do cliente final do SaaS Virtual Barber. Ele entrega a experiencia publica de cada barbearia em rotas por `slug`, permitindo que o cliente veja servicos, equipe, horarios, localizacao, escolha servicos, faca login pelo WhatsApp, agende horarios e acompanhe/cancele seus proprios agendamentos.

## Funcao deste projeto dentro do SaaS

- Frontend publico das barbearias cadastradas no SaaS.
- Renderiza lojas por rota `/:slug`, usando dados do Supabase.
- Resolve o tema visual da barbearia conforme `template`, `plan` e `store_style`.
- Oferece fluxo de carrinho/agendamento para clientes finais.
- Faz autenticacao do cliente por WhatsApp usando Supabase Auth e Edge Functions.
- Tambem contem uma landing page em `/` e uma politica de privacidade em `/politica-de-privacidade`.
- Ha uma area `src/portal`, mas as rotas do portal estao comentadas em `src/App.tsx`; portanto, ela nao e o foco ativo deste app.

## Principais paginas

- `/`: landing page em `src/landing-page/index.tsx`.
- `/politica-de-privacidade`: pagina de politica em `src/portal/pages/privacy-policy.tsx`.
- `/:slug`: home publica da barbearia, resolvida por `ThemeResolver`.
- `/:slug/agendar`: fluxo de agendamento do cliente.
- `/:slug/perfil`: area do cliente com agendamentos.
- `/:slug/entrar`: login por WhatsApp.
- `/auth/callback` e `/:slug/auth/callback`: callback de autenticacao.
- `*`: pagina de nao encontrado.

As paginas por `slug` passam por `src/app/themes/resolver.tsx`, que busca a barbearia, escolhe o tema correto e injeta providers de carrinho, estilo e dados da barbearia.

## Principais componentes

- `ThemeResolver`: ponto central das experiencias `/:slug`; carrega dados, aplica tema, bloqueia interacoes no modo preview e envia altura para o parent via `postMessage`.
- `Navbar`, `Footer`, `Logo`, `StatusBadge`: componentes compartilhados do app.
- `Gallery`, `Services`, `Team`, `BarberShopHours`, `Location`, `SectionNav`, `CartPanel`: compoem a home do tema default.
- `ExpiredLoginLinkModal`: exibido quando token de login por WhatsApp expira ou falha.
- `CustomerProfileCard`: cartao de dados do cliente no perfil.
- Componentes de agendamento:
  - `StepServices`: escolhe servicos e alimenta o carrinho.
  - `StepDate`: escolhe data, respeitando dias fechados e limite de 60 dias.
  - `StepBarberTime`: carrega slots disponiveis por servico e barbeiro.
  - `ServiceSlotCard`, `BarberGrid`, `TimeSlots`: selecao detalhada de profissional e horario.
  - `StepConfirm`: valida nome, conflitos locais e cria agendamentos no Supabase.
- Componentes UI em `src/app/components/ui`: wrappers de `button`, `dialog`, `sheet`, `carousel`, `avatar`.

## Principais hooks

- `useBarbershop(slug)`: busca a barbearia pelo slug via `getBarbershopBySlug` e usa `barbershop-store` como cache em memoria.
- `useAuth()`: expoe cliente autenticado, estado de loading e `signOut`.
- `useBookingSlots(params)`: chama o RPC `vb_get_booking_slots` para obter horarios disponiveis por servico, barbeiro e data.
- `useCart()`: acessa o `CartContext`; exige estar dentro de `CartProvider`.

## Principais stores

- `useAuthStore`: Zustand persistido no `localStorage` com chave `vb-auth`. Guarda `customer`, `isAuthenticated` e `isLoading`.
- `useBarbershopStore`: cache em memoria dos dados da barbearia atual. Nao persiste.
- `useBookingStore`: store de fluxo antigo/simples de agendamento. O fluxo atual do tema default usa estado local em `default/booking.tsx` mais `CartContext`, entao este store existe mas nao parece ser o eixo principal atual.

## Integracao com Supabase

- Cliente Supabase centralizado em `src/app/lib/supabase.ts`, configurado por:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- `src/app/lib/queries.ts` consulta `barbershops` por `slug`, filtra barbearias ativas, servicos ativos e barbeiros ativos, e monta o contrato usado pelos temas.
- `src/app/lib/booking-queries.ts` contem:
  - `getCurrentCustomer`
  - `getCustomerAppointments`
  - `updateCustomerAppointmentStatus`
  - `getAppointmentErrorMessage`
- RPCs usados pelo frontend:
  - `vb_get_booking_slots`
  - `vb_create_appointments`
  - `vb_get_customer_appointments`
  - `vb_cancel_customer_appointment`
- Edge Functions presentes:
  - `request-whatsapp-login`: gera codigo de login e link `wa.me`.
  - `whatsapp-webhook`: recebe mensagem da Meta, valida codigo e envia link com token.
  - `consume-whatsapp-login-token`: consome token, cria/atualiza customer, cria sessao Supabase Auth e retorna tokens.
- As functions usam service role internamente via `supabase/functions/shared/helpers.ts`.
- O banco tem protecoes importantes contra sobreposicao de agendamentos descritas em `database/prevent-overlapping-appointments.sql`, incluindo exclusion constraints por barbeiro e cliente.

## Fluxos principais

### Carregamento da barbearia

1. Usuario acessa `/:slug`.
2. `ThemeResolver` chama `useBarbershop(slug)`.
3. `getBarbershopBySlug` busca dados no Supabase.
4. O app filtra entidades ativas e normaliza dados para `BarbershopPageProps`.
5. O template e resolvido conforme plano:
   - `iniciante`: apenas `default`.
   - `profissional` e `master`: `vintage`, `modern`, `minimalist`.
   - Se o template nao for permitido, cai para `default`.

### Login por WhatsApp

1. Cliente acessa `/:slug/entrar`.
2. Informa telefone com DDD.
3. Frontend chama `request-whatsapp-login`.
4. Cliente envia o codigo pelo WhatsApp.
5. `whatsapp-webhook` valida o codigo e envia um link com token.
6. O frontend consome o token via `consume-whatsapp-login-token`.
7. A function cria/atualiza customer, cria sessao Supabase Auth e o app persiste o cliente em `useAuthStore`.

### Agendamento

1. Cliente seleciona servicos na home ou no fluxo de agendamento.
2. Servicos ficam no carrinho por slug em `localStorage`, chave `vb_cart_${slug}`.
3. Para acessar `/:slug/agendar`, precisa estar autenticado; se nao estiver, vai para `/:slug/entrar?from=agendar`.
4. Escolhe data, respeitando dias fechados e janela maxima de 60 dias.
5. `useBookingSlots` chama `vb_get_booking_slots`.
6. Cliente escolhe profissional e horario para cada servico.
7. `StepConfirm` valida nome, evita sobreposicao local entre servicos escolhidos e chama `vb_create_appointments`.
8. Ao sucesso, limpa carrinho e mostra confirmacao.

### Perfil do cliente

1. Cliente acessa `/:slug/perfil`.
2. Se nao autenticado, e redirecionado para `/:slug/entrar`.
3. O app chama `vb_get_customer_appointments`.
4. Agendamentos sao normalizados, filtrados por status e agrupados por data.
5. Cliente pode cancelar apenas agendamentos `scheduled`; o cancelamento chama `vb_cancel_customer_appointment`.

### Preview de tema

1. Query string `?preview=true` ativa modo preview.
2. Cliques e submits sao bloqueados.
3. Estilo pode ser atualizado por `postMessage` com tipo `BARBERSHOP_PREVIEW_STYLE`.
4. A altura do documento e enviada ao parent com tipo `BARBERSHOP_PREVIEW_HEIGHT`.

## Regras de negocio

- Apenas barbearias `is_active = true` sao exibidas.
- Apenas servicos ativos aparecem para o cliente.
- Apenas barbeiros ativos aparecem.
- O plano limita quais templates podem ser usados.
- Datas passadas, datas acima de 60 dias e dias fechados nao podem ser selecionados.
- O cliente precisa estar autenticado para agendar e acessar perfil.
- Login por WhatsApp usa codigos/tokens com expiracao de 10 minutos.
- Codigos anteriores de login por WhatsApp sao invalidados ao solicitar novo codigo.
- Cliente so pode cancelar o proprio agendamento e apenas com status `cancelled_by_customer`.
- O frontend valida conflito entre servicos selecionados no mesmo fluxo antes de confirmar.
- O banco tambem deve impedir sobreposicoes reais de agenda por barbeiro e por cliente.
- Nome do cliente e obrigatorio na confirmacao quando o customer salvo nao tem nome valido.
- Carrinho e separado por slug da barbearia.

## Problemas encontrados

- Ha textos/documentos com encoding quebrado, com palavras acentuadas aparecendo em formato mojibake.
- Existem `console.log` em fluxos sensiveis ou de producao, especialmente em `use-booking-slots.ts`, `step-barber-time.tsx`, `default/auth.tsx` e home default.
- `useBookingStore` existe, mas o fluxo atual de agendamento usa principalmente estado local e `CartContext`, o que pode confundir manutencoes futuras.
- A documentacao antiga em `src/app/hooks/README.md` menciona `useBooking`, mas o arquivo atual relevante e `useBookingSlots`.
- O arquivo `src/app/lib/queries.ts` ainda contem um bloco grande comentado com consulta completa do banco e logs de debug.
- Ha strings de erro genericas no login que escondem detalhes do erro real do usuario.
- Algumas mensagens e comentarios misturam portugues sem acento e texto com encoding quebrado.
- O status do `git status` retornou apenas avisos de permissao ao acessar `C:\Users\Vitor Hugo/.config/git/ignore`; nao foi possivel confirmar por ele se ha alteracoes pendentes.

## O que uma IA precisa saber antes de mexer neste projeto

- Este e o projeto do cliente final, entao documentacoes especificas devem ir em `docs/app-context.md`.
- Nao confundir com o projeto da barbearia/gestor nem com console interno do SaaS.
- A fonte de verdade para dados da loja e `getBarbershopBySlug`; componentes devem receber dados por hooks/contexts, evitando queries diretas.
- Nao instanciar Supabase fora de `src/app/lib/supabase.ts`.
- Mudancas em agendamento devem considerar frontend, RPCs e constraints do banco ao mesmo tempo.
- Mudancas em login devem considerar as tres Edge Functions do WhatsApp e o `useAuthStore`.
- O tema default e o mais completo; os temas premium importam paginas proprias, mas o resolver decide se podem ser usados pelo plano.
- Cuidado com timezone: o projeto tem utilitarios em `src/utils/date-time.ts` e um `TIMEZONE_AUDIT.md`; nao criar conversoes manuais sem verificar estes arquivos.
- Cuidado com encoding ao editar arquivos existentes; varios textos ja estao corrompidos.
- O modo preview usa `postMessage` e bloqueia interacoes. Alteracoes em `ThemeResolver` podem afetar integracao com algum painel externo.
- O carrinho persiste por slug em `localStorage`; nao trocar a chave sem migracao.
- O perfil depende de RPCs para respeitar permissoes e escopo por barbearia.
- Ao alterar regras de disponibilidade, verificar `useBookingSlots`, componentes do step 3, utilitarios de data/hora e RPC `vb_get_booking_slots`.
- Antes de mudar UI compartilhada, lembrar que ela impacta todos os templates resolvidos pelo `ThemeResolver`.
