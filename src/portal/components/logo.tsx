type logoProps = {
  isDarkLogo: boolean;
};

export function Logo({ isDarkLogo }: logoProps) {
  return (
    <a href="/" className="flex items-center gap-3">
      <img
        src={isDarkLogo ? "/logo-dark.png" : "/logo-light.png"}
        alt="logo virtual barber"
        className="w-59 min-w-43"
      />
    </a>
  );
}
