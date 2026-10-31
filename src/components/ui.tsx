import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { restaurant } from "../content/site";
import { logo } from "../content/images";
import { EASE } from "../lib/motion";
import { SafeImage } from "./SafeImage";
import { ArrowIcon } from "./Icons";

/*
 * Revela o conteúdo com um leve deslize ao entrar na tela, uma vez por carregamento.
 * Padrão: 16 px e 600 ms. Cartões usam distance={20}. Com redução de movimento, não há animação.
 */
export function Reveal({
  children,
  delay = 0,
  distance = 16,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  distance?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* Imagem com parallax discreto conforme a seção atravessa a tela. */
export function ParallaxImage({
  src,
  alt,
  className = "",
  range = ["-6%", "6%"],
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  range?: [string, string];
  sizes?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], range);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y: reduce ? 0 : y }} className="absolute inset-x-0 -top-[8%] h-[116%]">
        <SafeImage src={src} alt={alt} sizes={sizes} className="h-full w-full" />
      </motion.div>
    </div>
  );
}

/* Marca oficial do restaurante (arquivo enviado pelo estabelecimento, com fundo transparente). */
export function Logo({
  className = "",
  onClick,
  compact = false,
}: {
  className?: string;
  onClick?: () => void;
  compact?: boolean;
}) {
  // Com o cabeçalho rolado, a marca diminui de tamanho sem alterar o layout do conteúdo.
  const size = compact ? "h-9 md:h-11" : "h-12 md:h-16";
  return (
    <a
      href="#inicio"
      onClick={onClick}
      aria-label={`${restaurant.name}, voltar ao início`}
      className={`group inline-flex ${className}`}
    >
      <img
        src={logo.src}
        alt=""
        width={412}
        height={249}
        decoding="async"
        className={`w-auto transition-[height,opacity] duration-[250ms] ease-editorial group-hover:opacity-80 ${size}`}
      />
    </a>
  );
}

type Tone = "dark" | "light";

/* Título de seção. "dark" é para fundos pretos; "light" para fundos champagne. */
export function SectionHeading({
  eyebrow,
  title,
  tone = "dark",
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  const light = tone === "light";
  return (
    <div className={className}>
      <p
        className={`mb-6 flex items-center gap-4 text-[11px] font-medium uppercase tracking-eyebrow ${
          light ? "text-ink/70" : "text-gold"
        }`}
      >
        <span aria-hidden="true" className={`h-px w-10 ${light ? "bg-ink/40" : "bg-gold"}`} />
        {eyebrow}
      </p>
      <h2
        className={`font-serif text-5xl font-medium leading-[1.02] md:text-6xl lg:text-7xl ${
          light ? "text-ink" : "text-cream"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}

type ButtonVariant = "gold" | "dark" | "outline";

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  external?: boolean;
  showArrow?: boolean;
  className?: string;
  ariaLabel?: string;
}

const variants: Record<ButtonVariant, string> = {
  gold: "bg-gold text-ink hover:bg-champagne",
  dark: "bg-ink text-cream hover:bg-graphite",
  outline: "border border-current bg-transparent hover:bg-current/10",
};

/* Botão editorial: texto em caixa-alta, espaçamento generoso e hover discreto. */
export function Button({
  href,
  children,
  variant = "gold",
  external = false,
  showArrow = false,
  className = "",
  ariaLabel,
}: ButtonProps) {
  const externalProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      {...externalProps}
      className={`group inline-flex items-center justify-center gap-3 px-7 py-4 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-500 ease-editorial ${variants[variant]} ${className}`}
    >
      {children}
      {showArrow && (
        <ArrowIcon className="transition-transform duration-500 ease-editorial group-hover:translate-x-1" />
      )}
    </a>
  );
}
