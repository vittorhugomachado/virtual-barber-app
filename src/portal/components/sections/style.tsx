import { ArrowRight } from "lucide-react";
import { PostCard } from "../cards/post-card";

export function SectionStyle() {
  return (
    <section className="relative mt-26 flex min-h-screen w-full flex-col items-center rounded-t-xl">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-4 w-full text-start text-4xl font-bold text-neutral-100">
          Estilo
        </h2>
        <div className="flex flex-col gap-12">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            <PostCard isSmall={false} />
            <PostCard isSmall={false} />
            <PostCard isSmall={false} />
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            <PostCard isSmall={true} />
            <PostCard isSmall={true} />
            <PostCard isSmall={true} />
          </div>
        </div>
      </div>
      <a
        href="/produtos"
        className="mt-4 flex items-center text-neutral-100 transition-all duration-300 hover:scale-103"
      >
        Ver mais{" "}
        <ArrowRight
          size={20}
          className="text-4xl transition-all duration-300 group-hover:-rotate-45"
        />
      </a>
    </section>
  );
}
