export function TermsMain() {
  return (
    <main className="mx-auto my-8 flex max-w-4xl flex-col gap-6 px-4">
      <h1 className="text-center text-4xl font-bold text-[#050419]">
        Termos de Serviço
      </h1>

      <p className="mb-2 border-l-2 border-black pl-1.5">
        Última atualização: 20 de maio de 2026
      </p>

      <p>
        Estes Termos de Serviço regulam o acesso e uso da plataforma Virtual
        Barber. Ao utilizar nossos serviços, você concorda com os termos
        descritos nesta página.
      </p>

      <div>
        <h2 className="border-l-3 border-[#0557ED] pl-1.5 font-bold">
          Sobre a plataforma
        </h2>

        <p className="mt-2 ml-6">
          A Virtual Barber é uma plataforma voltada para gestão de barbearias,
          permitindo o gerenciamento de agendamentos, clientes, barbeiros,
          serviços, lembretes automáticos, relatórios e outras funcionalidades
          relacionadas à operação do estabelecimento.
        </p>
      </div>

      <div>
        <h2 className="border-l-3 border-[#0557ED] pl-1.5 font-bold">
          Uso da plataforma
        </h2>

        <p className="mt-2 ml-6">
          O usuário concorda em utilizar a plataforma de forma legal,
          responsável e em conformidade com a legislação aplicável, incluindo
          normas relacionadas à privacidade e proteção de dados.
        </p>

        <p className="mt-2 ml-6">É proibido utilizar a plataforma para:</p>

        <ul className="mt-2 ml-12 list-disc">
          <li>atividades ilegais;</li>
          <li>tentativas de acesso não autorizado;</li>
          <li>envio de spam ou conteúdo abusivo;</li>
          <li>violação de segurança da plataforma;</li>
          <li>uso indevido das integrações com terceiros.</li>
        </ul>
      </div>

      <div>
        <h2 className="border-l-3 border-[#0557ED] pl-1.5 font-bold">
          Conta do usuário
        </h2>

        <p className="mt-2 ml-6">
          O usuário é responsável pelas informações fornecidas durante o
          cadastro e pela segurança da própria conta.
        </p>

        <p className="mt-2 ml-6">
          A Virtual Barber poderá suspender ou limitar contas em caso de uso
          indevido, atividades suspeitas, fraude ou violação destes termos.
        </p>
      </div>

      <div>
        <h2 className="border-l-3 border-[#0557ED] pl-1.5 font-bold">
          Integrações com terceiros
        </h2>

        <p className="mt-2 ml-6">
          A plataforma poderá utilizar integrações com serviços de terceiros,
          incluindo APIs de comunicação, autenticação e notificações.
        </p>

        <p className="mt-2 ml-6">
          O uso dessas integrações está sujeito também aos termos e políticas
          dos respectivos provedores.
        </p>
      </div>

      <div>
        <h2 className="border-l-3 border-[#0557ED] pl-1.5 font-bold">
          Privacidade e proteção de dados
        </h2>

        <p className="mt-2 ml-6">
          O tratamento de dados pessoais é realizado conforme descrito na nossa
          Política de Privacidade.
        </p>

        <p className="mt-2 ml-6">
          A Virtual Barber adota medidas técnicas e organizacionais voltadas à
          proteção das informações e segurança da plataforma.
        </p>
      </div>

      <div>
        <h2 className="border-l-3 border-[#0557ED] pl-1.5 font-bold">
          Exclusão de conta e dados
        </h2>

        <p className="mt-2 ml-6">
          O usuário poderá solicitar a exclusão da conta e dos dados vinculados
          à plataforma a qualquer momento através dos canais oficiais de
          atendimento.
        </p>

        <p className="mt-2 ml-6">
          Algumas informações poderão ser mantidas temporariamente quando
          necessário para cumprimento de obrigações legais, prevenção a fraudes,
          segurança da plataforma ou exercício regular de direitos.
        </p>
      </div>

      <div>
        <h2 className="border-l-3 border-[#0557ED] pl-1.5 font-bold">
          Limitação de responsabilidade
        </h2>

        <p className="mt-2 ml-6">
          A Virtual Barber busca manter a plataforma segura e disponível, porém
          não garante funcionamento ininterrupto ou livre de falhas.
        </p>

        <p className="mt-2 ml-6">
          O usuário reconhece que serviços digitais podem sofrer interrupções,
          atualizações, manutenções ou falhas ocasionais.
        </p>
      </div>

      <div>
        <h2 className="border-l-3 border-[#0557ED] pl-1.5 font-bold">
          Alterações nos termos
        </h2>

        <p className="mt-2 ml-6">
          Estes Termos de Serviço poderão ser atualizados periodicamente para
          refletir melhorias, mudanças legais ou alterações na plataforma.
        </p>
      </div>

      <div>
        <h2 className="border-l-3 border-[#0557ED] pl-1.5 font-bold">
          Contato
        </h2>

        <p className="mt-2 ml-6">
          Em caso de dúvidas sobre estes Termos de Serviço, entre em contato
          através do e-mail{" "}
          <a
            href="mailto:contato@virtualbarber.com.br"
            className="font-bold underline"
          >
            contato@virtualbarber.com.br
          </a>
          .
        </p>
      </div>

    </main>
  );
}
