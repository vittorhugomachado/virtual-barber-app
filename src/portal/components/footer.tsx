export function Footer() {
  return (
    <footer className="relative flex w-full flex-col items-center gap-6 bg-zinc-100 px-4 py-8 transition-colors duration-600 sm:flex-row sm:justify-between sm:px-6 lg:px-8 dark:bg-zinc-950">
      <img src="/logo-dark.png" alt="" className="hidden w-60 dark:block" />
      <img src="/logo-light.png" alt="" className="w-60 dark:hidden" />
      <nav
        aria-label="Links institucionais"
        className="flex items-center gap-3 text-sm font-medium text-zinc-700 sm:mx-8 sm:flex-col sm:items-end dark:text-white/70"
      >
        <a
          href="https://virtualbarber.com.br/politica-de-privacidade"
          className="text-end transition hover:text-[#0458EE]"
        >
          Política de Privacidade
        </a>
        <a href="#" className="text-end transition hover:text-[#0458EE]">
          Termos e Condições
        </a>
        <a href="#" className="text-end transition hover:text-[#0458EE]">
          Contato
        </a>
      </nav>
    </footer>
  );
}
