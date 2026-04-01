import { Header } from "./components/header";
import { Main } from "./components/main";
import { Footer } from "./components/footer";

export function PortalApp() {
  return (
    <div className="relative min-h-screen">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}
