import { FeaturedCard } from "../cards/featured-card";
import { type FeaturedPortalPost } from "@/portal/types/portal-types";

const featuredPosts: FeaturedPortalPost[] = [
  {
    id: 1,
    title: "Social Media Engagement: 11 Ways to Boost Yours + Why it Matters",
    isPrimary: true,
    order: 1,
    imageUrl: "/image.png",
    category: "tendencias",
    date: "30 de abril, 2026",
    description: "Without engagement, social media is just media...",
    readTime: "25 minutos",
  },
  {
    id: 2,
    title: "Como Criar Conteúdo que Viraliza nas Redes Sociais",
    isPrimary: false,
    order: 2,
    imageUrl: "/images/post2.jpg",
    category: "dicas",
    date: "28 de abril, 2026",
    description: "Descubra os segredos para criar conteúdo que engaja...",
    readTime: "15 minutos",
  },
  {
    id: 3,
    title: "O Futuro do Marketing de Influência em 2026",
    isPrimary: false,
    order: 3,
    imageUrl: "/images/post3.jpg",
    category: "tendencias",
    date: "25 de abril, 2026",
    description: "Análise das principais tendências para o próximo ano...",
    readTime: "18 minutos",
  },
  {
    id: 4,
    title: "SEO para Blogs: Guia Completo para Iniciantes",
    isPrimary: false,
    order: 4,
    imageUrl: "/images/post4.jpg",
    category: "produtos",
    date: "22 de abril, 2026",
    description: "Aprenda as melhores práticas de SEO para seu blog...",
    readTime: "30 minutos",
  },
  {
    id: 5,
    title: "Ferramentas Essenciais para Gestão de Redes Sociais",
    isPrimary: false,
    order: 5,
    imageUrl: "/images/post5.jpg",
    category: "estilo",
    date: "20 de abril, 2026",
    description:
      "Conheça as melhores ferramentas para otimizar seu trabalho...",
    readTime: "12 minutos",
  },
];

export function SectionHero() {
  const primaryPost = featuredPosts.find(post => post.isPrimary);

  const secondaryPosts = featuredPosts
    .filter(post => !post.isPrimary)
    .sort((a, b) => a.order - b.order);

  return (
    <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 className="mb-4 w-full text-start text-4xl font-bold text-white">
        Destaques
      </h2>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.76fr)_minmax(0,1fr)]">
        <FeaturedCard
          isSmall={false}
          title={primaryPost?.title || ""}
          category={primaryPost?.category || "produtos"}
          date={primaryPost?.date || ""}
          imageUrl={primaryPost?.imageUrl || ""}
          description={primaryPost?.description || ""}
          readTime={primaryPost?.readTime || ""}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-1">
          {secondaryPosts.map(post => (
            <FeaturedCard
              key={post.id}
              isSmall={true}
              title={post.title}
              category={post.category}
              date={post.date}
              imageUrl={post.imageUrl}
              description={post.description}
              readTime={post.readTime}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
