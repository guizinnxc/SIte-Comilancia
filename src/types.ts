export interface NavItem {
  label: string;
  href: string;
}

export interface ImageRef {
  src: string;
  alt: string;
}

export interface GastronomyItem {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  // null enquanto a categoria não tiver fotografia oficial: o texto é exibido sem quadro.
  image: ImageRef | null;
  // Posição do enquadramento da fotografia (object-position), para valorizar o prato.
  imagePosition?: string;
  // Link de cardápio específico desta categoria. Só a gastronomia japonesa tem cardápio próprio.
  menuLink?: { label: string; href: string };
}

export interface ExperienceItem {
  title: string;
  description: string;
}

export type GalleryCategory = "ambiente" | "buffet" | "japonesa" | "sobremesas";

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category: GalleryCategory;
}

export interface MenuItem {
  name: string;
  description?: string;
  price?: string;
}

export interface MenuCategory {
  title: string;
  items: MenuItem[];
}

export interface Review {
  id: string;
  author: string;
  text: string;
  source: string;
  sourceUrl: string;
  date: string;
  rating?: number;
}
