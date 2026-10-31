import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { images, restaurant } from "../content/site";
import { heroVideo } from "../content/images";
import { EASE, riseItem, staggerContainer } from "../lib/motion";
import { useMediaQuery } from "../lib/useMediaQuery";
import { SafeImage } from "./SafeImage";
import { Button } from "./ui";

// Mesmo ponto de quebra md do Tailwind: abaixo dele, a versão para celular.
const DESKTOP_QUERY = "(min-width: 768px)";

// Enquadramento da capa, que é uma fotografia em retrato: mantém os pratos visíveis em cada tela.
const COVER_POSITION = { desktop: "50% 68%", mobile: "50% 50%" };

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  // Só o vídeo da tela atual é carregado.
  const src = isDesktop ? heroVideo.desktop : heroVideo.mobile;
  const position = isDesktop ? COVER_POSITION.desktop : COVER_POSITION.mobile;
  // Com movimento reduzido, ou se o arquivo não carregar, a capa estática é exibida no lugar.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showVideo = !reduce && failedSrc !== src;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      id="inicio"
      ref={ref}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-ink text-cream"
    >
      {/* Vídeo institucional em loop, sem áudio e sem controles; a fotografia é o pôster e o plano de reserva. */}
      <motion.div style={{ y: reduce ? 0 : imageY }} className="absolute inset-x-0 -top-[10%] h-[120%]">
        <motion.div
          initial={reduce ? false : { scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.6, ease: EASE }}
          className="relative h-full w-full"
        >
          {showVideo ? (
            <video
              key={src}
              src={src}
              poster={images.hero.src}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              tabIndex={-1}
              onError={() => setFailedSrc(src)}
              style={{ objectPosition: position }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <SafeImage
              src={images.hero.src}
              alt={images.hero.alt}
              loading="eager"
              sizes="100vw"
              objectPosition={position}
              className="h-full w-full"
            />
          )}
        </motion.div>
      </motion.div>

      {/* Sobreposição escura: legibilidade sem apagar a cena; mais intensa nas bordas e na parte inferior. */}
      <div className="pointer-events-none absolute inset-0 bg-ink/55" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/40" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_35%,_rgba(8,8,8,0.6)_100%)]" />

      <motion.div
        style={{ y: reduce ? 0 : copyY, opacity: reduce ? 1 : copyOpacity }}
        className="relative mx-auto w-full max-w-5xl px-6 pb-16 pt-32 text-center md:px-10 md:pb-24"
      >
        <motion.div variants={staggerContainer} initial={reduce ? false : "hidden"} animate="show">
          <motion.p
            variants={riseItem}
            className="text-[11px] font-medium uppercase tracking-eyebrow text-gold md:text-xs"
          >
            Restaurante Comilância
          </motion.p>

          <motion.p
            variants={riseItem}
            className="mt-3 font-serif text-2xl italic text-champagne md:text-3xl"
          >
            Desde {restaurant.foundedYear}
          </motion.p>

          <motion.h1
            variants={riseItem}
            className="mt-6 font-serif text-[3.2rem] font-medium leading-[0.98] sm:text-7xl md:text-8xl lg:text-[6.5rem]"
          >
            {restaurant.tagline}
          </motion.h1>

          <motion.p
            variants={riseItem}
            className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-cream/85 md:text-lg"
          >
            Tradição, sabor e momentos especiais no coração de Miguel Pereira.
          </motion.p>

          <motion.div
            variants={riseItem}
            className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button href="#gastronomia" variant="gold" showArrow>
              Conheça nossa gastronomia
            </Button>
            <Button href="#contato" variant="outline" className="text-cream">
              Como chegar
            </Button>
          </motion.div>

          <motion.p variants={riseItem} className="mt-10 text-[11px] uppercase tracking-eyebrow text-cream/65">
            {restaurant.hours.label}, das {restaurant.hours.range}
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Transição para a próxima seção: linha dourada que se estende e um indicador de rolagem. */}
      <motion.div
        aria-hidden="true"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="pointer-events-none absolute bottom-0 left-0 right-0 flex flex-col items-center gap-3 pb-6"
      >
        <span className="relative block h-12 w-px overflow-hidden bg-cream/20">
          <motion.span
            className="absolute inset-x-0 top-0 block h-1/2 bg-gold"
            animate={reduce ? undefined : { y: ["-100%", "200%"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
