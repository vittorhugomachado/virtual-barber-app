import { ArrowRight, BookOpenText } from "lucide-react";

type FeaturedCardProps = {
//   // title: string;
//   // tag: string;
//   // date: string;
//   // imageUrl: string;
//   // description: string;
isSmall: boolean;
};

export function PostCard({
//   {
//   //   title,
//   //   tag,
//   //   date,
//   //   imageUrl,
//   //   description,
   isSmall,
}: FeaturedCardProps) 
{
  return (
    <div
      className="group h-fit w-full cursor-pointer rounded-lg border border-neutral-200 bg-white p-2 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-800"
    >
      {!isSmall && (
        <img
        src="/image.png"
        alt=""
        className="h-50 w-full rounded-md object-cover"
        />
      )}
      <div className="px-3 pt-3 pb-3">
        <div className="flex w-full justify-between">
          <span className="rounded-sm bg-[#bee0fd] px-1.5 py-1 text-[13px] text-[#213130]">
            Social
          </span>
          <span className="text-[13px] text-neutral-500">
            30 de abril, 2026
          </span>
        </div>
        <h3
          className="mt-4 text-xl font-semibold text-[#212039]"
        >
          Social Media Engagement: 11 Ways to Boost Yours + Why it Matters
        </h3>
          <p className="text-sm font-semilight mb-6 text-neutral-500">
            Without engagement, social media is just media. In this article,
            you’ll learn nine actionable and authentic ways to boost your
            content’s engagement.
          </p>
        <div className="flex justify-between">
          <span
            className="flex items-center gap-1 text-[12px] text-neutral-500"
          >
            {" "}
            <BookOpenText size={15} className="translate-y-px" /> 25 minutos de
            leitura
          </span>
          <ArrowRight
            size={30}
            className="text-4xl transition-all duration-300 group-hover:-rotate-45"
          />
        </div>
      </div>
    </div>
  );
}
