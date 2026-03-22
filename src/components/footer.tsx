export function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-200 py-8 dark:border-neutral-800">
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-neutral-400">Desenvolvido por</span>
        <a href="/" target="_blank" rel="noopener noreferrer">
          <img src="/logo-light.png" alt="logo" className="h-8 w-auto object-contain dark:hidden" />
          <img src="/logo-dark.png" alt="logo" className="hidden h-8 w-auto object-contain dark:block" />
        </a>
      </div>
    </footer>
  );
}
