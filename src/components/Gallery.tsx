import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { galleryPhotos as gallery } from "../content/images";
import type { GalleryCategory, GalleryItem } from "../types";
import { EASE } from "../lib/motion";
import { ChevronIcon, CloseIcon } from "./Icons";
import { SafeImage } from "./SafeImage";
import { Reveal, SectionHeading } from "./ui";

type Filter = "todos" | GalleryCategory;

const categoryLabels: Record<GalleryCategory, string> = {
  ambiente: "Ambiente",
  buffet: "Buffet",
  japonesa: "Japonesa",
  sobremesas: "Sobremesas",
};

// Só aparecem filtros de categorias que já têm fotografias reais.
const filters: { value: Filter; label: string }[] = [
  { value: "todos", label: "Todos" },
  ...(Object.keys(categoryLabels) as GalleryCategory[])
    .filter((category) => gallery.some((item) => item.category === category))
    .map((category) => ({ value: category, label: categoryLabels[category] })),
];

// Ritmo do mosaico: os tamanhos alternam para criar composição editorial.
const tileSpans = [
  "col-span-2 row-span-2 md:col-span-3",
  "md:col-span-3",
  "md:col-span-2",
  "md:col-span-2",
  "col-span-2 md:col-span-4",
];

// Revelação ao entrar na tela: a foto sobe 24 px com opacidade, e a moldura acomoda a imagem de 1.04 para 1.0.
const REVEAL_DURATION = 0.65;
const REVEAL_OFFSET = 24;
const REVEAL_SCALE = 1.04;
// No desktop, as fotos de uma mesma linha que entram juntas são escalonadas em 90 ms.
const ROW_STAGGER = 0.09;
const ROW_TOLERANCE = 40;
const DESKTOP_QUERY = "(min-width: 768px)";
const canObserve = typeof window !== "undefined" && "IntersectionObserver" in window;

// id da fotografia → atraso da revelação em segundos. Depois de revelada, a foto permanece visível.
type Reveals = Record<string, number>;

/* Atraso de cada foto dentro da própria linha. A sequência recomeça em cada linha e em cada grupo que entra junto. */
function rowDelays(elements: HTMLElement[]) {
  const boxes = elements
    .map((element) => ({ element, rect: element.getBoundingClientRect() }))
    .sort((a, b) => a.rect.top - b.rect.top || a.rect.left - b.rect.left);

  const delays = new Map<HTMLElement, number>();
  let rowTop = Number.NEGATIVE_INFINITY;
  let column = 0;
  for (const { element, rect } of boxes) {
    if (rect.top - rowTop > ROW_TOLERANCE) {
      rowTop = rect.top;
      column = 0;
    }
    delays.set(element, column * ROW_STAGGER);
    column += 1;
  }
  return delays;
}

export function Gallery() {
  const [filter, setFilter] = useState<Filter>("todos");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [reveals, setReveals] = useState<Reveals>({});
  const revealsRef = useRef<Reveals>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const visible = filter === "todos" ? gallery : gallery.filter((item) => item.category === filter);

  const closeLightbox = useCallback(() => setOpenIndex(null), []);

  // Atualiza a referência e o estado juntos, para que a observação nunca revele a mesma foto duas vezes.
  const addReveals = useCallback((entries: Reveals) => {
    revealsRef.current = { ...revealsRef.current, ...entries };
    setReveals(revealsRef.current);
  }, []);

  // Um único observador para a galeria. Cada lote de fotos que entra junto recebe a sequência a partir do zero.
  const observe = useCallback(
    (element: HTMLElement) => {
      if (!observerRef.current) {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            const fresh: HTMLElement[] = [];
            for (const entry of entries) {
              const target = entry.target as HTMLElement;
              if (!entry.isIntersecting || (target.dataset.revealId ?? "") in revealsRef.current) continue;
              fresh.push(target);
              observerRef.current?.unobserve(target);
            }
            if (fresh.length === 0) return;

            const delays = window.matchMedia(DESKTOP_QUERY).matches
              ? rowDelays(fresh)
              : new Map<HTMLElement, number>();
            const next: Reveals = {};
            for (const target of fresh) {
              next[target.dataset.revealId ?? ""] = delays.get(target) ?? 0;
            }
            addReveals(next);
          },
          { threshold: 0 },
        );
      }
      observerRef.current.observe(element);
    },
    [addReveals],
  );

  const unobserve = useCallback((element: HTMLElement) => observerRef.current?.unobserve(element), []);

  // Foto que recebe foco pelo teclado aparece na hora, sem esperar a rolagem.
  const revealNow = useCallback(
    (id: string) => {
      if (!(id in revealsRef.current)) addReveals({ [id]: 0 });
    },
    [addReveals],
  );

  useEffect(() => () => observerRef.current?.disconnect(), []);

  return (
    <section id="galeria" className="bg-ink py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <Reveal distance={10}>
            <SectionHeading
              eyebrow="Galeria"
              title={
                <>
                  Um olhar sobre <span className="italic text-champagne">a casa.</span>
                </>
              }
            />
          </Reveal>
          {/* Os filtros não têm revelação: ficam visíveis e disponíveis desde o primeiro instante. */}
          <div role="group" aria-label="Filtrar fotos por categoria" className="flex flex-wrap gap-2">
            {filters.map((option) => {
              const active = filter === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setFilter(option.value);
                    setOpenIndex(null);
                  }}
                  className={`px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-500 ease-editorial ${
                    active ? "bg-gold text-ink" : "border border-cream/20 text-cream/70 hover:border-gold hover:text-gold"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <motion.ul
          layout
          className="mt-16 grid auto-rows-[200px] grid-cols-2 gap-3 md:auto-rows-[260px] md:grid-cols-6 md:gap-5"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((item, index) => (
              <GalleryTile
                key={item.id}
                item={item}
                span={tileSpans[index % tileSpans.length] ?? ""}
                revealAt={reveals[item.id]}
                onOpen={() => setOpenIndex(index)}
                onFocusReveal={revealNow}
                observe={observe}
                unobserve={unobserve}
              />
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>

      <AnimatePresence>
        {openIndex !== null && visible[openIndex] && (
          <Lightbox
            key="lightbox"
            items={visible}
            index={openIndex}
            onIndexChange={setOpenIndex}
            onClose={closeLightbox}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

interface GalleryTileProps {
  item: GalleryItem;
  span: string;
  revealAt: number | undefined;
  onOpen: () => void;
  onFocusReveal: (id: string) => void;
  observe: (element: HTMLElement) => void;
  unobserve: (element: HTMLElement) => void;
}

/*
 * Fotografia da galeria, com três camadas que não disputam transformações: a entrada (opacidade e deslocamento),
 * a acomodação da imagem dentro da moldura (escala 1.04 → 1.0) e o zoom discreto do hover, só com mouse.
 */
function GalleryTile({ item, span, revealAt, onOpen, onFocusReveal, observe, unobserve }: GalleryTileProps) {
  const reduce = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Com redução de movimento ou sem IntersectionObserver, a fotografia aparece diretamente.
  const shown = reduce || !canObserve || revealAt !== undefined;
  const transition = reduce ? { duration: 0 } : { duration: REVEAL_DURATION, delay: revealAt ?? 0, ease: EASE };

  // O wrapper não sofre transformação, então a observação mede a posição real da foto.
  useEffect(() => {
    const element = wrapperRef.current;
    if (!element || !canObserve) return;
    observe(element);
    return () => unobserve(element);
  }, [observe, unobserve]);

  return (
    <motion.li
      layout
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: reduce ? 0 : 0.6, ease: EASE }}
      className={span}
    >
      <div ref={wrapperRef} data-reveal-id={item.id} className="h-full w-full">
        <motion.div
          initial={shown ? false : { opacity: 0, y: REVEAL_OFFSET }}
          animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: REVEAL_OFFSET }}
          transition={transition}
          className="h-full w-full"
        >
          <button
            type="button"
            onClick={onOpen}
            onFocus={() => onFocusReveal(item.id)}
            aria-label={`Ampliar foto: ${item.alt}`}
            className="group relative block h-full w-full overflow-hidden text-left"
          >
            <motion.div
              initial={shown ? false : { scale: REVEAL_SCALE }}
              animate={shown ? { scale: 1 } : { scale: REVEAL_SCALE }}
              transition={transition}
              className="absolute inset-0"
            >
              <SafeImage
                src={item.src}
                alt={item.alt}
                sizes="(min-width: 768px) 40vw, 50vw"
                className="card-photo h-full w-full"
              />
            </motion.div>
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent px-4 pb-4 pt-14 font-serif text-lg italic text-champagne opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              {item.caption}
            </span>
          </button>
        </motion.div>
      </div>
    </motion.li>
  );
}

interface LightboxProps {
  items: GalleryItem[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

function Lightbox({ items, index, onIndexChange, onClose }: LightboxProps) {
  const item = items[index];
  const total = items.length;
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  // Trava a rolagem, move o foco para o botão de fechar e devolve o foco à foto de origem ao sair.
  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onIndexChange((index + 1) % total);
      if (event.key === "ArrowLeft") onIndexChange((index - 1 + total) % total);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [index, total, onClose, onIndexChange]);

  if (!item) return null;

  const step = (direction: 1 | -1) => onIndexChange((index + direction + total) % total);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Visualização da fotografia"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-ink/95 p-4 backdrop-blur-sm md:p-10"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Fechar visualização"
        className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center text-cream/80 transition-colors hover:text-gold md:right-8 md:top-8"
      >
        <CloseIcon />
      </button>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              step(-1);
            }}
            aria-label="Foto anterior"
            className="absolute left-1 top-1/2 z-10 -translate-y-1/2 p-3 text-cream/70 transition-colors hover:text-gold md:left-6"
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              step(1);
            }}
            aria-label="Próxima foto"
            className="absolute right-1 top-1/2 z-10 -translate-y-1/2 p-3 text-cream/70 transition-colors hover:text-gold md:right-6"
          >
            <ChevronIcon direction="right" />
          </button>
        </>
      )}

      <AnimatePresence mode="wait">
        <motion.figure
          key={item.id}
          initial={reduce ? false : { opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          onClick={(event) => event.stopPropagation()}
          className="flex w-full max-w-6xl flex-col items-center"
        >
          <SafeImage src={item.src} alt={item.alt} fit="contain" loading="eager" className="h-[70vh] w-full" />
          <figcaption className="mt-5 font-serif text-xl italic text-champagne">
            {item.caption}
            <span className="ml-4 font-sans text-xs not-italic tracking-widest text-cream/50">
              {index + 1} / {total}
            </span>
          </figcaption>
        </motion.figure>
      </AnimatePresence>
    </motion.div>
  );
}
