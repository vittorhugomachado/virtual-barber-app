import { Footer } from "../components/footer";
import { Logo } from "../components/logo";
import { TermsMain } from "../components/main/terms";

export function TermsPage() {
  return (
    <>
      <div className="flex w-full items-center justify-center py-4">
        <Logo isDarkLogo={false} />
      </div>
      <TermsMain />
      <Footer />
    </>
  );
}
