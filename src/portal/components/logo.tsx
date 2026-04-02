type logoProps = {
  isDarkLogo: boolean;
};

export function Logo({ isDarkLogo }: logoProps) {
  return (
    <a href="/" className="flex min-w-0 items-center gap-3">
      <img
        src={isDarkLogo ? "/logo-dark.png" : "/logo-light.png"}
        alt="logo virtual barber"
        className="h-auto w-47.5 max-w-full sm:w-60 lg:w-65"
      />
    </a>
  );
}
