import {
  BadgeCheck,
  BarChart3,
  Check,
  Scissors,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";

const features = [
  {
    title: "Página de vendas com identidade visual",
    description:
      "Uma vitrine própria para sua barbearia, com visual profissional e pronta para receber clientes.",
    icon: Store,
  },
  {
    title: "Lembretes automáticos",
    description:
      "Reduza faltas e esquecimento com mensagens automáticas via WhatsApp para seus clientes.",
    icon: BadgeCheck,
  },
  {
    title: "Serviços ilimitados",
    description:
      "Cadastre todos os cortes, pacotes, combos e atendimentos sem travar o crescimento da operação.",
    icon: Scissors,
  },
  {
    title: "Profissionais ilimitados",
    description:
      "Monte a agenda da equipe inteira, com espaço para cada profissional da barbearia.",
    icon: Users,
  },
  {
    title: "Relatórios de vendas",
    description:
      "Acompanhe os números da barbearia para entender resultados e tomar decisoes com mais clareza.",
    icon: BarChart3,
  },
  {
    title: "Conta para colaboradores",
    description:
      "Cada profissional tem acesso à própria agenda para acompanha atendimentos com facilidade.",
    icon: ShieldCheck,
  },
];

const betaHighlights = [
  "Mais organizacao para sua barbearia",
  "Melhor experiência para seu cliente",
  "100% gratuito",
];

const heroResources = [
  "Lembretes automáticos via WhatsApp",
  "Serviços e profissionais ilimitados",
  "Equipe com acesso à agenda",
  "Página personalizada",
  "Relatórios",
];

const comparisonRows = [
  {
    title: "Gestao",
    without:
      "Agenda bagunçada, clientes perdidos e dificuldade para organizar a rotina da equipe.",
    with: "Agenda centralizada, clientes organizados e rotina mais previsível para a equipe.",
  },
  {
    title: "Lembretes via WhatsApp",
    without:
      "Confirmações feitas uma por uma, muitos clientes esquecendo do atendimento.",
    with: "Lembretes automáticos, reduzindo faltas e aumentando lucros.",
  },
  {
    title: "Página com identidade própria",
    without:
      "Cliente depende de mensagem direta, link improvisado ou rede social sem agendamento fácil.",
    with: "Página da barbearia com visual próprio e focada em melhorar experiência do cliente .",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#050419] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050419]/92 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 py-4 sm:flex-row sm:px-6 lg:px-8">
          <a href="/" aria-label="Virtual Barber" className="shrink-0">
            <img
              src="/logo-dark.png"
              alt="Virtual Barber"
              className="h-auto w-60"
            />
          </a>
          <div>
            <a
              href="https://painel.virtualbarber.com.br/entrar"
              className="mx-5 inline-flex items-center justify-center text-sm font-semibold text-white hover:border-b"
            >
              Entrar
            </a>
            <a
              href="https://painel.virtualbarber.com.br/cadastro"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#0458EE] px-5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#2d72ff]"
            >
              Criar conta
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="relative isolate">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#0458EE] to-transparent" />
          <div className="mx-auto grid min-h-[calc(100vh-4.5rem)] w-full max-w-7xl items-center justify-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1.04fr)_minmax(360px,0.96fr)] lg:px-8 lg:py-20">
            <div className="flex max-w-3xl flex-col items-center lg:items-start">
              <h2 className="max-w-4xl text-center text-3xl leading-[0.98] font-semibold tracking-normal text-white sm:text-6xl lg:w-full lg:text-start lg:text-7xl">
                Mais organização <br />{" "}
                <strong className="text-[#0458EE]">=</strong> Mais{" "}
                <strong className="font-bold3">LUCRO</strong>
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76 lg:w-full">
                Uma plataforma completa para sua barbearia faturar mais <br /> e
                se organizar melhor.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://painel.virtualbarber.com.br/cadastro"
                  className="inline-flex h-13 items-center justify-center rounded-full bg-white px-6 text-base font-bold text-[#050419] transition hover:bg-neutral-200"
                >
                  Começar agora
                </a>
                <a
                  href="#recursos"
                  className="inline-flex h-13 items-center justify-center rounded-full border border-white/18 px-6 text-base font-semibold text-white transition hover:border-white/38 hover:bg-white/8"
                >
                  Ver recursos
                </a>
              </div>

              <div className="mt-9 hidden gap-3 sm:grid sm:grid-cols-3">
                {betaHighlights.map(highlight => (
                  <div
                    key={highlight}
                    className="flex max-w-36 flex-col items-center gap-2 text-center text-sm font-medium text-white/72 lg:max-w-66 lg:flex-row lg:text-start"
                  >
                    <Check size={17} className="shrink-0 text-[#4ade80]" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex justify-center lg:block">
              <div className="mt-5 flex max-w-120 flex-col gap-3">
                {heroResources.map(resource => (
                  <div
                    key={resource}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-700 text-white">
                      <Check size={16} />
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {resource}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="frase-impacto" className="bg-white text-[#050419]">
          <div className="flex-colgap-8 mx-auto flex max-w-7xl flex-col px-4 py-14 sm:px-6 lg:items-center lg:px-8">
            <h2 className="max-w-3xl text-center text-3xl font-semibold sm:text-4xl">
              A experiência que sua barbearia merece.
            </h2>
            <h2 className="mt-3 max-w-3xl text-center text-3xl font-black sm:text-5xl">
              A gestão que sua rotina precisa.
            </h2>
          </div>
        </section>

        <section
          id="recursos"
          className="border-y border-white/10 bg-white/[0.03]"
        >
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-2xl">
              <p className="text-sm font-bold tracking-[0.18em] text-[#9bbcff] uppercase">
                O que você vai ter
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

        <section
          id="comparativo"
          className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
        >

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-red-400/20 bg-red-500/[0.06] p-5 sm:p-6">
              <p className="text-sm font-bold tracking-[0.16em] text-red-200 uppercase">
                Sem Virtual Barber
              </p>
              <div className="mt-6 flex flex-col gap-4">
                {comparisonRows.map(item => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-[#0b0922] p-4"
                  >
                    <h3 className="text-lg font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 leading-7 text-white/62">
                      {item.without}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-[#0458EE]/45 bg-[#0458EE]/10 p-5 sm:p-6">
              <p className="text-sm font-bold tracking-[0.16em] text-[#9bbcff] uppercase">
                Com Virtual Barber
              </p>
              <div className="mt-6 flex flex-col gap-4">
                {comparisonRows.map(item => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-[#0458EE]/30 bg-[#0b0922] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-700 text-white">
                        <Check size={14} />
                      </span>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {item.title}
                        </h3>
                        <p className="mt-2 leading-7 text-white/72">
                          {item.with}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="comece" className="bg-white text-[#050419]">
          <div className="flex-colgap-8 mx-auto flex max-w-7xl flex-col px-4 py-14 sm:px-6 lg:items-center lg:px-8">
            <h2 className="mt-3 mb-16 max-w-3xl text-3xl font-black sm:text-5xl">
              Comece agora a profissionalizar sua barbearia com mais controle
            </h2>

            <a
              href="https://painel.virtualbarber.com.br/cadastro"
              className="inline-flex h-14 w-full items-center justify-center rounded-full bg-[#0458EE] px-7 text-base font-bold text-white shadow-lg shadow-[#0458EE]/25 transition hover:bg-[#2d72ff] sm:w-auto"
            >
              Começar agora
            </a>
          </div>
        </section>
      </main>

      <footer className="relative flex w-full flex-col items-center bg-[#050419] px-4 py-8 sm:px-6 lg:px-8">
        <img src="/logo-dark.png" alt="" className="w-60" />
      </footer>
    </div>
  );
}
