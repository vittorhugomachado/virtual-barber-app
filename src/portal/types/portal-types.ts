export const PORTAL_CATEGORIES = {
  produtos: {
    id: 1,
    key: "produtos",
    label: "Produtos",
    href: "/produtos",
    colors: {
      background: "#BEE0FD",
      text: "#1A5F8C",
    },
  },
  tendencias: {
    id: 2,
    key: "tendencias",
    label: "Tendências",
    href: "/tendencias",
    colors: {
      background: "#FDBDBD",
      text: "#9B2C2C",
    },
  },
  dicas: {
    id: 3,
    key: "dicas",
    label: "Dicas",
    href: "/dicas",
    colors: {
      background: "#FFF0B3",
      text: "#7B5B14",
    },
  },
  estilo: {
    id: 4,
    key: "estilo",
    label: "Estilo",
    href: "/estilo",
    colors: {
      background: "#E8C8FF",
      text: "#6B2D8E",
    },
  },
  saude: {
    id: 5,
    key: "saude",
    label: "Saúde",
    href: "/saude",
    colors: {
      background: "#B8F0A8",
      text: "#2D6A2E",
    },
  },
} as const;

export type PortalCategoryKey = keyof typeof PORTAL_CATEGORIES;
export type PortalCategory = (typeof PORTAL_CATEGORIES)[PortalCategoryKey];
export type PortalCategoryLabel = PortalCategory["label"];

export type Tag = PortalCategory;

export type PortalPost = {
  id: number;
  title: string;
  category: PortalCategoryKey;
  date: string;
  imageUrl: string;
  description: string;
  readTime: string;
};

export type FeaturedPortalPost = PortalPost & {
  isPrimary?: boolean;
  order: number;
};
