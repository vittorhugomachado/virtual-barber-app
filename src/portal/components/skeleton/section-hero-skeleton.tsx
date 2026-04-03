function SkeletonBlock({ className }: { className: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-neutral-300/70 ${className}`} />
  );
}

function FeaturedCardLargeSkeleton() {
  return (
    <div className="h-fit w-full max-w-176 mx-auto rounded-lg bg-white p-2">
      {/* Imagem */}
      <SkeletonBlock className="h-80 w-full rounded-md" />
      <div className="px-3 pt-3 pb-3">
        {/* Badge + data */}
        <div className="flex w-full justify-between">
          <SkeletonBlock className="h-6 w-20" />
          <SkeletonBlock className="h-4 w-24" />
        </div>
        {/* Título */}
        <SkeletonBlock className="mt-4 h-7 w-full" />
        <SkeletonBlock className="mt-2 h-7 w-4/5" />
        {/* Excerpt */}
        <SkeletonBlock className="mt-5 h-4 w-full" />
        <SkeletonBlock className="mt-2 h-4 w-10/12" />
        <SkeletonBlock className="mt-2 mb-6 h-4 w-3/4" />
        {/* Arrow */}
        <div className="flex justify-end">
          <SkeletonBlock className="h-7 w-7 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function FeaturedCardSmallSkeleton() {
  return (
    <div className="h-fit w-full rounded-lg bg-white p-2">
      <div className="px-3 pt-3 pb-3">
        {/* Badge + data */}
        <div className="flex w-full justify-between">
          <SkeletonBlock className="h-6 w-20" />
          <SkeletonBlock className="h-4 w-24" />
        </div>
        {/* Título */}
        <SkeletonBlock className="mt-4 h-5 w-full" />
        <SkeletonBlock className="mt-2 mb-2.5 h-5 w-3/4" />
        {/* Arrow */}
        <div className="flex justify-end">
          <SkeletonBlock className="h-7 w-7 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function SectionHeroSkeleton() {
  return (
    <section className="w-full max-w-7xl pt-8 mx-auto px-4 sm:px-6 lg:px-8">
      {/* Título "Destaques" */}
      <SkeletonBlock className="mb-4 h-10 w-44" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.76fr)_minmax(0,1fr)]">
        {/* Card primário (grande) */}
        <FeaturedCardLargeSkeleton />

        {/* Cards secundários (pequenos) */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-1">
          <FeaturedCardSmallSkeleton />
          <FeaturedCardSmallSkeleton />
          <FeaturedCardSmallSkeleton />
          <FeaturedCardSmallSkeleton />
        </div>
      </div>
    </section>
  );
}
