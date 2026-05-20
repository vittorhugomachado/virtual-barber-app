export function PrivacyPolicyMain() {
  return (
    <main className="mx-auto my-8 flex max-w-5xl flex-col gap-6 px-4">
      <h2 className="mb-4 w-full text-center text-4xl font-bold text-[#050419]">
        Política de Privacidade
      </h2>
      <p className="mb-2 border-l-2 border-black pl-1.5">
        Última atualização: 20 de maio de 2026
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
          rel="noopener noreferrer"
          className="font-bold underline"
        >
          virtualbarber.com.br
        </a>{" "}
        e{" "}
        <a
          href="https://painel.virtualbarber.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold underline"
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
          barbearias, permitindo que estabelecimentos cadastrem serviços,
          gerenciem agendamentos, acompanhem clientes e se comuniquem via
          WhatsApp.
        </p>
        <p className="mt-2 ml-6">
          Para fins da LGPD, a controladora dos dados tratados nesta política é
          a Virtual Barber. O canal oficial para assuntos de privacidade é{" "}
          <a
            href="mailto:contato@virtualbarber.com.br"
            className="font-bold underline"
          >
            contato@virtualbarber.com.br
          </a>
          .
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
            serviço selecionado, profissional, data e horário do agendamento.
          </li>
          <li>
            <strong>Dados de integração com WhatsApp:</strong> número de
            telefone do WhatsApp Business, identificadores técnicos da conta,
            como WABA ID e Phone Number ID, e credenciais técnicas necessárias
            para integração e envio de mensagens.
          </li>
          <li>
            <strong>Dados de uso da plataforma:</strong> logs de acesso,
            endereço IP, informações sobre o dispositivo utilizado e eventos
            necessários para segurança e funcionamento da plataforma.
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
            Registrar, exibir e organizar agendamentos para os estabelecimentos
            cadastrados;
          </li>
          <li>
            Enviar notificações, confirmações e lembretes de agendamento via
            WhatsApp para clientes das barbearias;
          </li>
          <li>
            Executar automações configuradas pelas barbearias, como lembretes de
            horário e comunicações operacionais;
          </li>
          <li>
            Melhorar a experiência do usuário, a segurança e a performance da
            plataforma;
          </li>
          <li>Cumprir obrigações legais e regulatórias.</li>
        </ul>
      </div>

      <div>
        <h2 className="border-l-3 border-[#0557ED] pl-1.5 font-bold">
          4. Integração com WhatsApp Business (Meta)
        </h2>
        <p className="mb-3 ml-6">
          As mensagens enviadas pela plataforma possuem finalidade operacional e
          estão relacionadas a agendamentos, confirmações, lembretes e
          comunicações iniciadas ou esperadas pelos usuários.
        </p>
        <p className="mb-3 ml-6">
          Nossa plataforma pode utilizar a API oficial do WhatsApp Business,
          fornecida pela Meta Platforms, para permitir que barbearias enviem
          mensagens operacionais relacionadas aos seus agendamentos, conforme as
          configurações realizadas na Virtual Barber.
        </p>
        <p className="mb-3 ml-6">
          As credenciais técnicas necessárias para integração, assim como WABA
          ID e Phone Number ID, são armazenadas com medidas de segurança e
          utilizadas exclusivamente para a operação da plataforma. Não
          compartilhamos esses dados com terceiros, exceto quando necessário
          para funcionamento da API da Meta ou cumprimento de obrigação legal.
        </p>
        <p className="ml-6">
          O uso da API do WhatsApp Business está sujeito a{" "}
          <a
            href="https://www.whatsapp.com/legal/business-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline"
          >
            Política de Negócios do WhatsApp
          </a>{" "}
          e a{" "}
          <a
            href="https://www.facebook.com/privacy/policy/"
            target="_blank"
            rel="noopener noreferrer"
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
            hospedagem, banco de dados, segurança e processamento que sustentam
            nossa plataforma;
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
          em trânsito (HTTPS), controles de acesso e segregação de permissões.
        </p>
      </div>

      <div>
        <h2 className="border-l-3 border-[#0557ED] pl-1.5 font-bold">
          7. Seus direitos (LGPD)
        </h2>
        <p className="ml-6">
          Em conformidade com a{" "}
          <strong>Lei Geral de Proteção de Dados (Lei no 13.709/2018)</strong>,
          você tem direito a:
        </p>
        <ul className="ml-12 list-disc">
          <li>Acessar os dados que temos sobre você;</li>
          <li>Corrigir dados incompletos ou incorretos;</li>
          <li>Solicitar a exclusão de seus dados, quando aplicável;</li>
          <li>Revogar o consentimento para uso dos seus dados;</li>
          <li>Solicitar a portabilidade dos seus dados;</li>
          <li>
            Obter informações sobre tratamento e compartilhamento de dados
            pessoais.
          </li>
        </ul>

        <p className="mt-2 ml-6">
          Para exercer seus direitos, entre em contato pelo e-mail{" "}
          <a
            href="mailto:contato@virtualbarber.com.br"
            className="font-bold underline"
          >
            contato@virtualbarber.com.br
          </a>
          .
        </p>
      </div>

      <div>
        <h2 className="border-l-3 border-[#0557ED] pl-1.5 font-bold">
          8. Exclusão de Dados
        </h2>
        <p className="ml-6">
          O usuário pode solicitar a exclusão de seus dados pessoais a qualquer
          momento pelo e-mail{" "}
          <a
            href="mailto:contato@virtualbarber.com.br"
            className="font-bold underline"
          >
            contato@virtualbarber.com.br
          </a>{" "}
          ou pela página pública de solicitação de exclusão de dados em{" "}
          <a
            href="https://virtualbarber.com.br/data-deletion"
            className="font-bold underline"
          >
            https://virtualbarber.com.br/data-deletion
          </a>
          .
        </p>
        <p className="mt-2 ml-6">
          Após a solicitação, avaliaremos os dados vinculados a conta e
          realizaremos a exclusão ou anonimização das informações, exceto quando
          a manutenção for necessária para cumprimento de obrigações legais,
          prevenção a fraudes, segurança da plataforma ou exercício regular de
          direitos.
        </p>
      </div>

      <div>
        <h2 className="border-l-3 border-[#0557ED] pl-1.5 font-bold">
          9. Retenção de dados
        </h2>
        <p className="ml-6">
          Mantemos dados pessoais pelo tempo necessário para prestação dos
          serviços, funcionamento da conta, atendimento de solicitações,
          cumprimento de obrigações legais, prevenção a fraudes, segurança da
          plataforma e exercício regular de direitos.
        </p>
        <p className="mt-2 ml-6">
          Quando uma conta é encerrada ou uma solicitação de exclusão é aceita,
          os dados são removidos ou anonimizados em prazo razoável, ressalvadas
          informações que precisem ser mantidas por obrigação legal, fiscal,
          regulatória, antifraude ou para defesa de direitos.
        </p>
      </div>

      <div>
        <h2 className="border-l-3 border-[#0557ED] pl-1.5 font-bold">
          10. Cookies
        </h2>
        <p className="ml-6">
          Utilizamos cookies essenciais para o funcionamento da plataforma, como
          manutenção de sessão e preferências. Não utilizamos cookies de
          rastreamento ou publicidade de terceiros.
        </p>
      </div>

      <div>
        <h2 className="border-l-3 border-[#0557ED] pl-1.5 font-bold">
          11. Alterações nesta política
        </h2>
        <p className="ml-6">
          Podemos atualizar esta Política de Privacidade periodicamente.
          Notificaremos alterações significativas por e-mail ou por aviso na
          plataforma. O uso continuado dos nossos serviços após as alterações
          implica na aceitação da nova política.
        </p>
      </div>

      <div>
        <h2 className="border-l-3 border-[#0557ED] pl-1.5 font-bold">
          12. Contato
        </h2>
        <p className="ml-6">
          Em caso de dúvidas, solicitações ou reclamações relacionadas à
          privacidade, entre em contato:
        </p>
        <div className="ml-6 pt-2">
          <strong>Empresa:</strong> 62.203.455 VITOR HUGO ALVES MACHADO
          <br />
          <strong>CNPJ:</strong> 62.203.455/0001-61
          <br />
          <strong>E-mail:</strong>{" "}
          <a
            href="mailto:contato@virtualbarber.com.br"
            className="font-bold underline"
          >
            contato@virtualbarber.com.br
          </a>
          <br />
        </div>
      </div>

      <hr />
      <p className="mt-5 text-center">
        © 2026 Virtual Barber. Todos os direitos reservados.
      </p>
    </main>
  );
}
