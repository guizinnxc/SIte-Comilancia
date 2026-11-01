/*
 * Conteúdo editável do site.
 *
 * Tudo o que aparece no site vem deste arquivo, exceto os textos de cada seção,
 * que ficam nos componentes em src/components.
 * Fotografias ficam em ./images.ts. Não inserir preços, pratos ou avaliações sem origem oficial.
 */

import { images } from "./images";
import type { GastronomyItem, MenuCategory, NavItem, Review } from "../types";

export { images };

export const restaurant = {
  name: "Restaurante Comilância",
  shortName: "Comilância",
  foundedYear: "1991",
  tagline: "Da nossa família para a sua.",
  siteUrl: "https://www.comilancia.com/",
  instagramUrl: "https://www.instagram.com/restaurantecomilancia/",
  instagramHandle: "@restaurantecomilancia",
  facebookUrl: "https://www.facebook.com/restaurantecomilancia",
  menuUrl: "https://cardapioseguro.com.br/comilancia",
  // Página oficial para o cliente deixar sua avaliação.
  reviewFormUrl: "https://www.comilancia.com/deixe-a-sua-avalia%C3%A7%C3%A3o",
  phoneDisplay: "(24) 98806-1588",
  phoneHref: "tel:+5524988061588",
  whatsappUrl:
    "https://wa.me/5524988061588?text=" +
    encodeURIComponent("Olá! Gostaria de mais informações sobre o Comilância."),
  address: {
    street: "Rua Algecira Alarcão Ferreira, 39",
    neighborhood: "Centro",
    city: "Miguel Pereira",
    state: "RJ",
    full: "Rua Algecira Alarcão Ferreira, 39, Centro, Miguel Pereira – RJ",
  },
  // Usado no mapa incorporado e no botão "Como chegar".
  mapQuery: "Rua Algecira Alarcão Ferreira, 39, Centro, Miguel Pereira, RJ",
  hours: {
    label: "Funcionamos todos os dias",
    range: "11h às 16h",
  },
} as const;

// Ordem da navegação, conforme o briefing.
export const navigation: NavItem[] = [
  { label: "Início", href: "#inicio" },
  { label: "Nossa História", href: "#historia" },
  { label: "Gastronomia", href: "#gastronomia" },
  { label: "Galeria", href: "#galeria" },
  { label: "Avaliações", href: "#avaliacoes" },
  { label: "Localização", href: "#contato" },
];

// Descrições baseadas na apresentação oficial do perfil: buffet a quilo e culinária japonesa à la carte.
export const gastronomy: GastronomyItem[] = [
  {
    id: "buffet",
    eyebrow: "À quilo",
    title: "Buffet e culinária brasileira",
    description: "Buffet a quilo, com o sabor da cozinha brasileira de todos os dias.",
    image: images.buffet,
    imagePosition: "50% 42%",
  },
  {
    id: "japonesa",
    eyebrow: "À la carte",
    title: "Gastronomia japonesa",
    description: "Culinária japonesa à la carte, preparada com o mesmo cuidado da nossa casa.",
    image: images.japanese,
    imagePosition: "50% 40%",
    menuLink: { label: "Ver cardápio japonês", href: restaurant.menuUrl },
  },
  {
    id: "sobremesas",
    eyebrow: "Para finalizar",
    title: "Sobremesas e experiências doces",
    description: "Para encerrar a refeição com um momento especial.",
    image: images.dessert,
    imagePosition: "50% 55%",
  },
];

/*
 * Cardápio geral do restaurante: preparado para ser preenchido no futuro.
 * Enquanto a lista estiver vazia, nenhum cardápio geral é exibido. O cardápio japonês
 * aparece só na seção de gastronomia japonesa (menuLink).
 */
export const menuCategories: MenuCategory[] = [];

/*
 * Avaliações: somente avaliações reais, verificadas e com fonte identificada.
 * Formato: { id, author, text, source, sourceUrl, date, rating? }
 * Deixe vazio enquanto não houver avaliações verificadas.
 */
export const reviews: Review[] = [];
