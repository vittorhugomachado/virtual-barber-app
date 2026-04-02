import { FeaturedCard } from "../cards/featured-card";

export function SectionHero() {
  return (
    <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 className="mb-4 w-full text-start text-4xl font-bold text-white">
        Destaques
      </h2>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.76fr)_minmax(0,1fr)]">
        <FeaturedCard isSmall={false} />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-1">
          <FeaturedCard isSmall={true} />
          <FeaturedCard isSmall={true} />
          <FeaturedCard isSmall={true} />
          <FeaturedCard isSmall={true} />
        </div>
      </div>
    </section>
  );
}
