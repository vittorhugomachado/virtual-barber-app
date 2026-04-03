function SkeletonBlock({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-neutral-300/70 ${className}`}
    />
  );
}

function PostCardSkeleton() {
  return (
    <div className="w-full rounded-lg border border-neutral-200 bg-white p-2">
      <SkeletonBlock className="h-50 w-full" />
      <div className="px-3 pt-3 pb-3">
        <div className="flex items-center justify-between gap-4">
          <SkeletonBlock className="h-6 w-24" />
          <SkeletonBlock className="h-4 w-28" />
        </div>
        <SkeletonBlock className="mt-4 h-7 w-full" />
        <SkeletonBlock className="mt-2 h-7 w-4/5" />
        <SkeletonBlock className="mt-5 mb-6 h-4 w-full" />
        <SkeletonBlock className="h-4 w-10/12" />
        <div className="mt-6 flex items-center justify-between gap-4">
          <SkeletonBlock className="h-4 w-28" />
          <SkeletonBlock className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function PostsSkeleton({ bgDark }: { bgDark: boolean }) {
  return (
    <section
      style={{ backgroundColor: bgDark ? "#050419" : "#FFFFFF" }}
      className="relative mt-6 flex min-h-screen w-full flex-col items-center rounded-xl bg-[#050419] pb-16"
    >
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SkeletonBlock className="mb-4 h-10 w-44" />
        <div className="flex flex-col gap-12">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <SkeletonBlock className="h-5 w-20" />
        <SkeletonBlock className="h-6 w-6 rounded-full" />
      </div>
    </section>
  );
}
