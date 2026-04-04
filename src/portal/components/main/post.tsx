import { Calendar, ChevronRight } from "lucide-react";
import { SocialBar } from "@/portal/components/social-bar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import type { Components } from "react-markdown";
import type { Post } from "@/portal/types/portal-types";
import { PORTAL_CATEGORIES } from "@/portal/types/portal-types";
import { formatDate } from "@/portal/utils/format-date";

type PostMainProps = {
  post: Post;
};

// extrai o ID do YouTube de qualquer formato de URL
function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[1] : null;
}

// converte markdown inline (negrito, itálico) para HTML dentro dos callouts
function processInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/_(.+?)_/g, "<em>$1</em>");
}

// processa blocos especiais: :::info, :::warning, :::tip e ::youtube
function processContent(content: string): string {
  return (
    content
      // bloco info — fundo rosa #FEDCEA
      .replace(/:::info\r?\n([\s\S]*?):::/g, (_, inner) => `<div class="callout-info">${processInlineMarkdown(inner)}</div>`)
      // bloco warning — fundo amarelo #FFEBC2
      .replace(
        /:::warning\r?\n([\s\S]*?):::/g,
        (_, inner) => `<div class="callout-warning">${processInlineMarkdown(inner)}</div>`,
      )
      // bloco tip — fundo azul #D6EDFF
      .replace(/:::tip\r?\n([\s\S]*?):::/g, (_, inner) => `<div class="callout-tip">${processInlineMarkdown(inner)}</div>`)
      // embed YouTube
      .replace(/::youtube\[([^\]]+)\]/g, (_, url) => {
        const id = getYouTubeId(url);
        if (!id) return "";
        return `<div class="youtube-embed"><iframe src="https://www.youtube.com/embed/${id}" title="YouTube video" allowfullscreen></iframe></div>`;
      })
  );
}

const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "iframe"],
  attributes: {
    ...defaultSchema.attributes,
    div: ["className"],
    iframe: ["src", "title", "allowFullScreen", "className"],
  },
};

const markdownComponents: Components = {
  // imagens responsivas
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt ?? ""}
      className="my-6 w-full rounded-xl object-cover"
    />
  ),
  // tabelas com scroll em mobile
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-neutral-700">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-neutral-100 border-b-neutral-700">{children}</thead>,
  th: ({ children }) => (
    <th className="border-b border-neutral-700 px-4 py-3 text-left font-semibold text-neutral-700">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-neutral-300 px-4 py-3 text-neutral-600">
      {children}
    </td>
  ),
  // parágrafo — renderiza HTML para suportar divs dos blocos especiais
  p: ({ children }) => (
    <p className="mb-4 leading-relaxed text-neutral-700">{children}</p>
  ),
  h2: ({ children }) => (
    <h2 className="mt-10 mb-4 text-2xl font-bold text-neutral-900">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 mb-3 text-xl font-semibold text-neutral-900">
      {children}
    </h3>
  ),
  ul: ({ children }) => <ul className="my-4 space-y-2 pl-4">{children}</ul>,
  ol: ({ children }) => (
    <ol className="my-4 list-decimal space-y-2 pl-6">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed text-neutral-700">{children}</li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-inherit">{children}</strong>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-4 border-neutral-300 pl-4 text-neutral-500 italic">
      {children}
    </blockquote>
  ),
};

export function PostMain({ post }: PostMainProps) {
  const categoryMeta = PORTAL_CATEGORIES[post.category];
  const processedContent = processContent(post.content);

  return (
    <main>
      <nav
        aria-label="Breadcrumb"
        className="flex w-full items-center bg-[#050419] px-3 pt-8 text-sm text-neutral-300 md:px-8"
      >
        <a
          href="/"
          className="hover:text-neutral-100 hover:shadow-[0_-1px_0_0_#F5F5F5_inset]"
        >
          Portal
        </a>
        <ChevronRight size={15} />
        <a
          href={`/portal/${post.category}`}
          className="hover:text-neutral-100 hover:shadow-[0_-1px_0_0_#F5F5F5_inset]"
        >
          {categoryMeta.label}
        </a>
      </nav>

      {/* Hero */}
      <section className="w-full bg-[#050419]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pt-6 pb-12 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-8 lg:py-20">
          <div className="flex flex-1 flex-col gap-6">
            <span
              style={{
                backgroundColor: categoryMeta.colors.background,
                color: categoryMeta.colors.text,
              }}
              className="w-fit rounded-sm px-2 py-1 text-[13px] font-medium"
            >
              {categoryMeta.label}
            </span>

            <h1 className="text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            <p className="text-lg leading-relaxed text-neutral-300">
              {post.excerpt}
            </p>

            <div className="flex items-center gap-5 text-sm text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Calendar size={15} className="translate-y-px" />
                {formatDate(post.published_at)}
              </span>
            </div>
          </div>

          <div className="w-full lg:w-120 lg:shrink-0">
            <img
              src={post.cover_url}
              alt={post.title}
              className="h-64 w-full rounded-xl object-cover sm:h-80 lg:h-90"
            />
          </div>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="relative w-full bg-neutral-100">
        <SocialBar variant="sidebar" />
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">

          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
            components={markdownComponents}
          >
            {processedContent}
          </ReactMarkdown>
        </div>
      </section>
    </main>
  );
}
