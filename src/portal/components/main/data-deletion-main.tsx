export function DataDeletionMain() {
  return (
    <main className="mx-auto my-8 flex max-w-4xl flex-col gap-6 px-4">
      <h1 className="text-center text-4xl font-bold text-[#050419]">
        Exclusao de Dados
      </h1>
      <p>
        Voce pode solicitar a exclusao dos seus dados pessoais vinculados a
        Virtual Barber a qualquer momento.
      </p>
      <div>
        <h2 className="border-l-3 border-[#0557ED] pl-1.5 font-bold">
          Como solicitar
        </h2>
        <p className="mt-2 ml-6">
          Envie um e-mail para{" "}
          <a
            href="mailto:contato@virtualbarber.com.br"
            className="font-bold underline"
          >
            contato@virtualbarber.com.br
          </a>{" "}
          informando o telefone, e-mail ou dados que ajudem a localizar sua
          conta.
        </p>
      </div>
      <div>
        <h2 className="border-l-3 border-[#0557ED] pl-1.5 font-bold">
          O que acontece depois
        </h2>
        <p className="mt-2 ml-6">
          Apos a solicitacao, avaliaremos os dados vinculados a conta e
          realizaremos a exclusao ou anonimizacao das informacoes, exceto quando
          a manutencao for necessaria para cumprimento de obrigacoes legais,
          prevencao a fraudes, seguranca da plataforma ou exercicio regular de
          direitos.
        </p>
      </div>
      
    </main>
  );
}
