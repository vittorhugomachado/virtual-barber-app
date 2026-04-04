type ErrorStateProps = {
  isDark: boolean;
  message?: string;
};

export function ErrorState({
  isDark,
  message = "Ocorreu um erro ao carregar esta página.",
}: ErrorStateProps) {
  return (
    <div
      className={`flex h-[90vh] w-screen items-center justify-center px-6 text-center ${
        isDark
          ? "bg-[#050419] text-neutral-100"
          : "bg-neutral-100 text-neutral-900"
      }`}
    >
      <div className=" flex flex-col items-center max-w-2xl rounded-2xl border border-current/15 bg-current/5 px-8 py-10">
        <img
          src={isDark ? "/image-error-dark.png" : "/image-error-light.png"}
          alt="imagem de erro"
          width={70}
        />
        <h2 className="text-2xl font-semibold mt-4">Algo deu errado</h2>
        <p className="mt-3 text-base leading-relaxed opacity-80">{message}</p>
      </div>
    </div>
  );
}
