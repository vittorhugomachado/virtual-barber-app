import {
  BadgeCheck,
  BarChart3,
  CalendarDays,
  Check,
  Clock3,
  Scissors,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
} from "lucide-react";

const features = [
  {
    title: "Pagina de vendas com identidade visual",
    description:
      "Uma vitrine propria para sua barbearia, com visual profissional e pronta para receber clientes.",
    icon: Store,
  },
  {
    title: "Servicos ilimitados",
    description:
      "Cadastre todos os cortes, pacotes, combos e atendimentos sem travar o crescimento da operacao.",
    icon: Scissors,
  },
  {
    title: "Profissionais ilimitados",
    description:
      "Monte a agenda da equipe inteira, com espaco para cada profissional da casa.",
    icon: Users,
  },
  {
    title: "Clientes ilimitados",
    description:
      "Organize sua base de clientes e mantenha tudo pronto para reservas, historico e relacionamento.",
    icon: BadgeCheck,
  },
  {
    title: "Relatorios de vendas",
    description:
      "Acompanhe os numeros da barbearia para entender resultados e tomar decisoes com mais clareza.",
    icon: BarChart3,
  },
  {
    title: "Contas para colaboradores",
    description:
      "Crie acessos para a equipe operar junto, com uma experiencia pensada para o dia a dia.",
    icon: ShieldCheck,
  },
];

const betaHighlights = [
  "100% gratis durante a versao beta",
  "Ambiente de testes em evolucao constante",
  "Disponivel por tempo limitado para novas barbearias",
];

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#050419] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050419]/92 backdrop-blur">
        <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <a href="/" aria-label="Virtual Barber" className="shrink-0">
            <img
              src="/logo-light.png"
              alt="Virtual Barber"
              className="h-auto w-44 sm:w-56"
            />
          </a>

          <nav
            aria-label="Navegacao principal"
            className="hidden items-center gap-7 text-sm font-medium text-white/72 md:flex"
          >
            <a href="#recursos" className="transition hover:text-white">
              Recursos
            </a>
            <a href="#beta" className="transition hover:text-white">
              Beta gratis
            </a>
            <a href="#comece" className="transition hover:text-white">
              Comecar
            </a>
          </nav>

          <a
            href="#comece"
            className="inline-flex h-11 items-center justify-center rounded-full bg-[#0458EE] px-5 text-sm font-semibold text-white shadow-lg shadow-[#0458EE]/25 transition hover:bg-[#2d72ff]"
          >
            Entrar na beta
          </a>
        </div>
      </header>

      <main>
        <section className="relative isolate">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#0458EE] to-transparent" />
          <div className="mx-auto grid min-h-[calc(100vh-4.5rem)] w-full max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1.04fr)_minmax(360px,0.96fr)] lg:px-8 lg:py-20">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#0458EE]/40 bg-[#0458EE]/12 px-4 py-2 text-sm font-semibold text-[#9bbcff]">
                <Sparkles size={16} />
                Versao beta 100% gratis
              </div>

              <h1 className="max-w-4xl text-5xl leading-[0.98] font-black tracking-normal text-white sm:text-6xl lg:text-7xl">
                Virtual Barber
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76 sm:text-xl">
                A plataforma para barbearias criarem sua pagina de vendas,
                organizarem profissionais, servicos, clientes e acompanharem
                vendas em um unico lugar.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#comece"
                  className="inline-flex h-13 items-center justify-center rounded-full bg-white px-6 text-base font-bold text-[#050419] transition hover:bg-neutral-200"
                >
                  Quero testar gratis
                </a>
                <a
                  href="#recursos"
                  className="inline-flex h-13 items-center justify-center rounded-full border border-white/18 px-6 text-base font-semibold text-white transition hover:border-white/38 hover:bg-white/8"
                >
                  Ver recursos
                </a>
              </div>

              <div className="mt-9 grid gap-3 sm:grid-cols-3">
                {betaHighlights.map(highlight => (
                  <div
                    key={highlight}
                    className="flex items-center gap-2 text-sm font-medium text-white/72"
                  >
                    <Check size={17} className="shrink-0 text-[#4ade80]" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl border border-white/12 bg-white/[0.04] p-4 shadow-2xl shadow-black/30">
                <div className="rounded-2xl border border-white/10 bg-[#0b0922] p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
                    <div>
                      <p className="text-sm font-semibold text-[#9bbcff]">
                        Painel da barbearia
                      </p>
                      <h2 className="mt-1 text-2xl font-bold text-white">
                        Beta ativa
                      </h2>
                    </div>
                    <div className="rounded-full bg-[#0458EE] p-3">
                      <CalendarDays size={24} />
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <Metric label="Servicos" value="Ilimitado" />
                    <Metric label="Profissionais" value="Ilimitado" />
                    <Metric label="Clientes" value="Ilimitado" />
                    <Metric label="Custo beta" value="R$ 0" />
                  </div>

                  <div className="mt-5 rounded-2xl border border-[#0458EE]/35 bg-[#0458EE]/10 p-4">
                    <div className="flex items-center gap-3">
                      <Clock3 size={20} className="text-[#9bbcff]" />
                      <p className="text-sm font-semibold text-white">
                        Disponivel por tempo limitado
                      </p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/68">
                      A versao beta e gratuita para testes enquanto a Virtual
                      Barber evolui com as primeiras barbearias parceiras.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="recursos" className="border-y border-white/10 bg-white/[0.03]">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9bbcff]">
                Tudo incluso na beta
              </p>
              <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">
                Recursos para vender, organizar e acompanhar sua barbearia.
              </h2>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features.map(({ title, description, icon: Icon }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-white/10 bg-[#0b0922] p-5 transition hover:border-[#0458EE]/60"
                >
                  <div className="mb-5 inline-flex rounded-2xl bg-[#0458EE]/14 p-3 text-[#9bbcff]">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{title}</h3>
                  <p className="mt-3 leading-7 text-white/68">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="beta" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9bbcff]">
                Beta de testes
              </p>
              <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">
                Gratis agora. Limitado enquanto a beta estiver aberta.
              </h2>
              <p className="mt-5 text-lg leading-8 text-white/70">
                A Virtual Barber esta em fase beta. Isso significa acesso
                gratuito para testar, validar recursos e ajudar a moldar a
                ferramenta antes da versao final.
              </p>
            </div>

            <div className="rounded-3xl border border-white/12 bg-white/[0.04] p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <BetaPoint value="100%" label="gratis na beta" />
                <BetaPoint value="0" label="limite de cadastros" />
                <BetaPoint value="1" label="pagina para vender" />
              </div>
            </div>
          </div>
        </section>

        <section id="comece" className="bg-white text-[#050419]">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-8 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0458EE]">
                Teste gratuito
              </p>
              <h2 className="mt-3 text-3xl font-black sm:text-5xl">
                Coloque sua barbearia na beta da Virtual Barber.
              </h2>
              <p className="mt-4 text-lg leading-8 text-neutral-700">
                A versao beta e gratuita, experimental e disponivel por tempo
                limitado para quem quer testar a plataforma desde o inicio.
              </p>
            </div>

            <a
              href="mailto:contato@virtualbarber.com.br?subject=Quero%20testar%20a%20beta%20da%20Virtual%20Barber"
              className="inline-flex h-14 w-full items-center justify-center rounded-full bg-[#0458EE] px-7 text-base font-bold text-white shadow-lg shadow-[#0458EE]/25 transition hover:bg-[#2d72ff] sm:w-auto"
            >
              Solicitar acesso beta
            </a>
          </div>
        </section>
      </main>

      <footer className="relative flex min-h-64 w-full flex-col justify-end bg-[#050419] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl items-end justify-between gap-6">
          <div>
            <img
              src="/logo-text-virtual.png"
              alt="Virtual"
              className="w-34 sm:w-44"
            />
            <img
              src="/logo-text-barber.png"
              alt="Barber"
              className="-mt-3 w-34 sm:w-44"
            />
          </div>
          <p className="max-w-xs text-right text-sm text-white/45">
            Beta gratuita para testes. Direitos autorais 2026 Virtual Barber.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/45">
        {label}
      </p>
      <p className="mt-2 text-lg font-black text-white">{value}</p>
    </div>
  );
}

function BetaPoint({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b0922] p-5">
      <p className="text-4xl font-black text-white">{value}</p>
      <p className="mt-2 text-sm font-semibold text-white/62">{label}</p>
    </div>
  );
}
