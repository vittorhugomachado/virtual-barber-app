import { useEffect, useState } from "react";
import { useStyle } from "../../../contexts/style-context/style-context";

type Section = {
  id: string;
  label: string;
};

type SectionNavProps = {
  sections: Section[];
};

export function SectionNav({ sections }: SectionNavProps) {
  const { primaryColor } = useStyle();
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-130px 0px -50% 0px" },
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // limpa quando volta ao topo
    function handleScroll() {
      if (window.scrollY < 100) {
        setActiveSection("");
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sections]); // <-- adiciona sections como dependência

  function scrollTo(id: string) {
    const element = document.getElementById(id);
    if (element) {
      const offset = 130;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  return (
    <nav className="bg-background fixed top-14 right-0 left-0 z-40 flex w-full items-center py-1.5">
      <div className="scrollbar-none mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4">
        {sections.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            style={{ borderColor: primaryColor }}
            className={`text-md mb-2 shrink-0 px-4 py-1.5 font-medium transition-colors hover:text-white ${
              activeSection === id
                ? "border-b-2 border-white text-white"
                : "text-white/80"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}
