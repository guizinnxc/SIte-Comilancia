import type { GalleryItem, ImageRef } from "../types";

/*
 * Mapeamento central das fotografias do site.
 * Os arquivos ficam em public/images, uma pasta por seção, e cada foto aparece uma única vez.
 * Um slot com null significa que ainda não há fotografia oficial: a seção se monta sem quadro provisório.
 */

export const logo: ImageRef = {
  src: "/images/logo/comilancia-logo.webp",
  alt: "Logotipo oficial do Restaurante Comilância, desde 1991",
};

// Vídeos do Hero, um por formato de tela. Cada um é carregado somente quando a tela corresponde.
// Enquanto o arquivo não existir (ou com redução de movimento), a fotografia de capa é exibida.
export const heroVideo = {
  desktop: "/videos/comilancia-fundo-desktop.mp4",
  mobile: "/videos/comilancia-fundo-celular.mp4",
} as const;

export const images = {
  hero: {
    src: "/images/hero/cozido-carne-legumes.webp",
    alt: "Prato com carne, legumes e arroz, servido no Restaurante Comilância",
  },
  story: {
    src: "/images/historia/cozinha-ovos-torta.webp",
    alt: "Torta salgada, couve refogada e ovos mexidos no buffet do Comilância",
  },
  buffet: {
    src: "/images/buffet/batata-palha-camarao.webp",
    alt: "Batata palha gratinada com camarão empanado no buffet a quilo do Comilância",
  },
  japanese: {
    src: "/images/japonesa/sushi-prato-da-casa.webp",
    alt: "Prato japonês com sushi, sashimi e camarão empanado, servido no Comilância",
  },
  dessert: {
    src: "/images/sobremesas/torta-maca-canela.webp",
    alt: "Torta de maçã com canela, sobremesa do Restaurante Comilância",
  },
} satisfies Record<string, ImageRef | null>;

// Galeria: somente fotografias reais. Ambiente aparece quando houver foto do salão.
export const galleryPhotos: GalleryItem[] = [
  {
    id: "sushi-sake",
    src: "/images/japonesa/sushi-sake.webp",
    alt: "Sushi, sashimi e saquê servidos no Comilância",
    caption: "Japonesa",
    category: "japonesa",
  },
  {
    id: "couve-linguica-carne",
    src: "/images/galeria/couve-linguica-carne.webp",
    alt: "Couve refogada, linguiça e carne no buffet do Comilância",
    caption: "Carnes do buffet",
    category: "buffet",
  },
  {
    id: "batatas-recheadas-camarao",
    src: "/images/buffet/batatas-recheadas-camarao.webp",
    alt: "Batatas recheadas com camarão e queijo gratinadas no buffet do Comilância",
    caption: "Gratinados",
    category: "buffet",
  },
  {
    id: "entradas-mezze",
    src: "/images/buffet/entradas-mezze.webp",
    alt: "Prato de entradas com homus, falafel e tabule, servido no Comilância",
    caption: "Entradas",
    category: "buffet",
  },
  {
    id: "carne-queijo-tomate",
    src: "/images/galeria/carne-queijo-tomate.webp",
    alt: "Carne gratinada com queijo, tomate e manjericão no buffet do Comilância",
    caption: "Gratinados",
    category: "buffet",
  },
  {
    id: "torradas-tomate",
    src: "/images/galeria/torradas-tomate.webp",
    alt: "Torradas com tomate temperado no buffet do Comilância",
    caption: "Aperitivos",
    category: "buffet",
  },
  {
    id: "ovos-quiche-linguica",
    src: "/images/galeria/ovos-quiche-linguica.webp",
    alt: "Ovos mexidos, quiche e linguiça no buffet do Comilância",
    caption: "Quiches e ovos",
    category: "buffet",
  },
  {
    id: "sobremesa-morango",
    src: "/images/galeria/sobremesa-morango.webp",
    alt: "Sobremesa com morangos e creme, servida no Comilância",
    caption: "Sobremesas",
    category: "sobremesas",
  },
  {
    id: "nhoque-ragu-manjericao",
    src: "/images/galeria/nhoque-ragu-manjericao.webp",
    alt: "Nhoque com ragu e manjericão, servido no Comilância",
    caption: "Massas",
    category: "buffet",
  },
  {
    id: "saladas-antepasto",
    src: "/images/galeria/saladas-antepasto.webp",
    alt: "Saladas e antepastos servidos no buffet do Restaurante Comilância",
    caption: "Saladas e antepastos",
    category: "buffet",
  },
];
