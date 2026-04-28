export function PrivacyPolicyMain() {
  return (
    <main className="mx-auto my-8 flex max-w-5xl flex-col gap-6">
      <h2 className="mb-4 w-full text-center text-4xl font-bold text-[#050419]">
        Política de Privacidade
      </h2>
      <p className="mb-2 border-l-2 border-black pl-1.5">
        Última atualização: 23 de abril de 2025
      </p>

      <p>
        A <strong>Virtual Barber </strong>
        respeita a sua privacidade e está comprometida em proteger os dados
        pessoais que você nos fornece. Esta Política de Privacidade descreve
        como coletamos, usamos, armazenamos e compartilhamos informações ao
        utilizar nossa plataforma acessível em
        <a
          href="https://virtualbarber.com.br"
          target="_blank"
          className="font-bold"
        >
          {" "}
          virtualbarber.com.br{" "}
        </a>{" "}
        e
        <a
          href="https://painel.virtualbarber.com.br"
          target="_blank"
          className="ml-1 font-bold"
        >
          painel.virtualbarber.com.br
        </a>
        .
      </p>

      <div>
        <h2 className="border-l-3 border-[#0557ED] pl-1.5 font-bold">
          1. Quem somos
        </h2>
        <p className="ml-6">
          A Virtual Barber é uma plataforma SaaS voltada para a gestão de
          barbearias, permitindo que estabelecimentos cadastrem seus serviços,
          gerenciem agendamentos e se comuniquem com clientes via WhatsApp*
          (esta funcionalidade estará disponível em breve para os
          estabelecimentos cadastrados.).
        </p>
      </div>

      <div>
        <h2 className="border-l-3 border-[#0557ED] pl-1.5 font-bold">
          2. Dados que coletamos
        </h2>
        <p className="ml-6">Coletamos os seguintes tipos de informações:</p>
        <ul className="ml-12 list-disc">
          <li>
            <strong>Dados de contato das barbearias:</strong> nome do
            estabelecimento, nome do responsável, endereço de e-mail, telefone e
            endereço.
          </li>
          <li>
            <strong>Dados de agendamento:</strong> nome do cliente, telefone,
            serviço selecionado, data e horário do agendamento.
          </li>
          <li>
            <strong>Dados de integração com WhatsApp:</strong> número de
            telefone do WhatsApp Business, ID da conta WhatsApp Business (WABA
            ID) e tokens de acesso fornecidos pela Meta Platforms para envio de
            mensagens automatizadas.
          </li>
          <li>
            <strong>Dados de uso da plataforma:</strong> logs de acesso,
            endereço IP e informações sobre o dispositivo utilizado.
          </li>
        </ul>
      </div>

      <div>
        <h2 className="border-l-3 border-[#0557ED] pl-1.5 font-bold">
          3. Como usamos seus dados
        </h2>
        <p className="ml-6">Utilizamos as informações coletadas para:</p>
        <ul className="ml-12 list-disc">
          <li>Criar e gerenciar contas de barbearias na plataforma;</li>
          <li>
            Registrar e exibir agendamentos para os estabelecimentos
            cadastrados;
          </li>
          <li>
            Enviar notificações e lembretes de agendamento via WhatsApp para os
            clientes das barbearias* (esta funcionalidade estará disponível em
            breve para os estabelecimentos cadastrados.);
          </li>
          <li>
            Executar automações configuradas pelas barbearias (ex.: confirmação
            de agendamento, lembrete de horário);
          </li>
          <li>
            Melhorar a experiência do usuário e a performance da plataforma;
          </li>
          <li>Cumprir obrigações legais e regulatórias.</li>
        </ul>
      </div>

      <div>
        <h2 className="border-l-3 border-[#0557ED] pl-1.5 font-bold">
          4. Integração com WhatsApp Business (Meta)
        </h2>
        <p className="mb-3 ml-6">
          Nossa plataforma está em processo de integração com a API oficial do
          WhatsApp Business, fornecida pela Meta Platforms, por meio do fluxo de{" "}
          <strong>Embedded Signup</strong>. Esta funcionalidade estará
          disponível em breve e permitirá que as barbearias conectem sua conta
          do WhatsApp Business à Virtual Barber para envio de mensagens
          automatizadas em seu nome, conforme as automações configuradas
        </p>
        <p className="mb-3 ml-6">
          Os dados de integração (tokens de acesso, WABA ID e Phone Number ID)
          serão armazenados de forma segura e utilizados exclusivamente para a
          operação da plataforma. Não compartilhamos esses dados com terceiros,
          exceto conforme necessário para o funcionamento da API da Meta.
        </p>
        <p className="ml-6">
          O uso da API do WhatsApp Business está sujeito à
          <a
            href="https://www.whatsapp.com/legal/business-policy"
            target="_blank"
            className="mx-1.5 font-bold underline"
          >
            Política de Negócios do WhatsApp
          </a>
          e à{" "}
          <a
            href="https://www.facebook.com/privacy/policy/"
            target="_blank"
            className="font-bold underline"
          >
            Política de Privacidade da Meta
          </a>
          .
        </p>
      </div>

      <div>
        <h2 className="border-l-3 border-[#0557ED] pl-1.5 font-bold">
          5. Compartilhamento de dados
        </h2>
        <p className="ml-6">
          Não vendemos seus dados pessoais. Podemos compartilhá-los apenas nas
          seguintes situações:
        </p>
        <ul className="ml-12 list-disc">
          <li>
            <strong>Meta Platforms:</strong> para operação da API do WhatsApp
            Business;
          </li>
          <li>
            <strong>Provedores de infraestrutura:</strong> serviços de
            hospedagem e banco de dados que sustentam nossa plataforma, sujeitos
            a acordos de confidencialidade;
          </li>
          <li>
            <strong>Obrigação legal:</strong> quando exigido por lei, ordem
            judicial ou autoridade competente.
          </li>
        </ul>
      </div>

      <div>
        <h2 className="border-l-3 border-[#0557ED] pl-1.5 font-bold">
          6. Armazenamento e segurança
        </h2>
        <p className="ml-6">
          Seus dados são armazenados em servidores seguros e protegidos por
          medidas técnicas e organizacionais adequadas, incluindo criptografia
          em trânsito (HTTPS) e controles de acesso. Mantemos os dados pelo
          tempo necessário para a prestação dos serviços ou conforme exigido por
          lei.
        </p>
      </div>

      <div>
        <h2 className="border-l-3 border-[#0557ED] pl-1.5 font-bold">
          7. Seus direitos (LGPD)
        </h2>
        <p className="ml-6">
          Em conformidade com a{" "}
          <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018)</strong>,
          você tem direito a:
        </p>
        <ul className="ml-12 list-disc">
          <li>Acessar os dados que temos sobre você;</li>
          <li>Corrigir dados incompletos ou incorretos;</li>
          <li>Solicitar a exclusão de seus dados, quando aplicável;</li>
          <li>Revogar o consentimento para uso dos seus dados;</li>
          <li>Solicitar a portabilidade dos seus dados;</li>
          <li>
            Obter informações sobre compartilhamento de dados com terceiros.
          </li>
        </ul>

        <p className="mt-2 ml-6">
          Para exercer seus direitos, entre em contato pelo e-mail:{" "}
          <a href="mailto:contato@virtualbarber.com.br" className="font-bold underline">
            contato@virtualbarber.com.br
          </a>
        </p>
      </div>

      <div>
        <h2 className="border-l-3 border-[#0557ED] pl-1.5 font-bold">
          8. Cookies
        </h2>
        <p className="ml-6">
          Utilizamos cookies essenciais para o funcionamento da plataforma, como
          manutenção de sessão e preferências. Não utilizamos cookies de
          rastreamento ou publicidade de terceiros.
        </p>
      </div>

      <div>
        <h2 className="border-l-3 border-[#0557ED] pl-1.5 font-bold">
          9. Alterações nesta política
        </h2>
        <p className="ml-6">
          Podemos atualizar esta Política de Privacidade periodicamente.
          Notificaremos sobre alterações significativas por e-mail ou por aviso
          na plataforma. O uso continuado dos nossos serviços após as alterações
          implica na aceitação da nova política.
        </p>
      </div>

      <div>
        <h2 className="border-l-3 border-[#0557ED] pl-1.5 font-bold">
          10. Contato
        </h2>
        <p className="ml-6">
          Em caso de dúvidas, solicitações ou reclamações relacionadas à
          privacidade, entre em contato:
        </p>
        <div className="ml-6 pt-2">
          <strong>E-mail:</strong>{" "}
          <a href="mailto:contato@virtualbarber.com.br">
            contato@virtualbarber.com.br
          </a>
          <br />
          <strong>Telefone</strong>{" "}
          <a href="tel:+5551980560089">
            (51) 98056-0089
          </a>
        </div>
      </div>

      <hr />
      <p className="mt-5 text-center">
        © 2026 Virtual Barber. Todos os direitos reservados.
      </p>
    </main>
  );
}
