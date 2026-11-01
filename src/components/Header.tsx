import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { navigation, restaurant } from "../content/site";
import { EASE } from "../lib/motion";
import { trapTab } from "../lib/trapTab";
import { useMediaQuery } from "../lib/useMediaQuery";
import { CloseIcon, InstagramIcon, MenuIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "./Icons";
import { Logo } from "./ui";

// Mesmo ponto de quebra xl do Tailwind: daqui para cima, a navegação fica no cabeçalho e o painel some.
const DESKTOP_QUERY = "(min-width: 1280px)";
// Depois desta rolagem (em px), o cabeçalho ganha fundo sólido e a marca diminui.
const SCROLL_THRESHOLD = 80;
// Uma seção vira ativa quando o topo dela passa desta fração da altura da tela.
const ACTIVE_LINE = 0.4;
// Tempo máximo de espera pelo fim da rolagem iniciada por um clique (ms).
const CLICK_RELEASE_MS = 3000;

const SECTION_IDS = navigation.map((item) => item.href.slice(1));
const FIRST_SECTION = SECTION_IDS[0] ?? "inicio";
const LAST_SECTION = SECTION_IDS[SECTION_IDS.length - 1] ?? FIRST_SECTION;

function isAtBottom() {
  return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
}

/* Seção ativa pela posição da rolagem. Lê só o topo de cada seção, uma vez por quadro. */
function readActiveSection(): string {
  if (isAtBottom()) return LAST_SECTION;

  const line = window.innerHeight * ACTIVE_LINE;
  let current = FIRST_SECTION;
  for (const id of SECTION_IDS) {
    const element = document.getElementById(id);
    if (element && element.getBoundingClientRect().top <= line) current = id;
  }
  return current;
}

/* A rolagem iniciada por um clique terminou quando a seção alcançou a altura de rolagem. */
function hasReachedSection(id: string) {
  if (isAtBottom()) return true;
  // A primeira seção não desce até a altura de rolagem: chegar ao topo da página já basta.
  if (id === FIRST_SECTION) return window.scrollY <= 0;
  const element = document.getElementById(id);
  if (!element) return true;
  const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  return Math.abs(element.getBoundingClientRect().top - offset) < 3;
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState(FIRST_SECTION);
  const reduce = useReducedMotion();
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);
  // Enquanto a rolagem de um clique não termina, o destaque fica no item clicado.
  const clickedRef = useRef<string | null>(null);
  const releaseTimerRef = useRef<number | undefined>(undefined);

  // Estado da rolagem e seção ativa. São poucas leituras por evento e o React ignora valores repetidos.
  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);

      const clicked = clickedRef.current;
      if (clicked) {
        if (hasReachedSection(clicked)) clickedRef.current = null;
        return;
      }
      setActive(readActiveSection());
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.clearTimeout(releaseTimerRef.current);
    };
  }, []);

  // Ao girar a tela ou ampliar a janela, o painel some: sem fechar o menu, a rolagem da página ficaria travada.
  useEffect(() => {
    if (isDesktop) setMenuOpen(false);
  }, [isDesktop]);

  // Trava a rolagem do fundo, fecha com Esc e mantém o foco dentro do painel enquanto o menu estiver aberto.
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (!toggleRef.current || !panelRef.current) return;
      trapTab(event, [toggleRef.current, ...panelRef.current.querySelectorAll<HTMLElement>("a[href], button")]);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  // Ao abrir, o foco vai para o primeiro link do painel; ao fechar, volta ao botão do menu.
  useEffect(() => {
    if (menuOpen) {
      panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    } else if (wasOpenRef.current) {
      toggleRef.current?.focus();
    }
    wasOpenRef.current = menuOpen;
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const selectSection = (id: string) => {
    clickedRef.current = id;
    setActive(id);
    window.clearTimeout(releaseTimerRef.current);
    releaseTimerRef.current = window.setTimeout(() => {
      clickedRef.current = null;
      setActive(readActiveSection());
    }, CLICK_RELEASE_MS);
  };

  // Com o menu aberto ou a página rolada, o cabeçalho fica sólido; no topo, transparente sobre o vídeo.
  const solid = scrolled || menuOpen;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 text-cream transition-[padding,box-shadow] duration-[250ms] ease-editorial motion-reduce:transition-none ${
          solid ? "py-3" : "py-5 md:py-7"
        } ${scrolled && !menuOpen ? "shadow-[0_14px_32px_-22px_rgba(0,0,0,0.85)]" : ""}`}
      >
        {/* Fundo sólido após a rolagem; no topo, só um degradê escuro discreto sobre o vídeo. */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 -z-10 border-b border-gold/15 bg-ink/95 backdrop-blur-md transition-opacity duration-[250ms] ease-editorial ${
            solid ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          aria-hidden="true"
          className={`absolute inset-0 -z-10 bg-gradient-to-b from-ink/70 to-transparent transition-opacity duration-[250ms] ease-editorial ${
            solid ? "opacity-0" : "opacity-100"
          }`}
        />

        <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 md:px-10 lg:px-12">
          <Logo
            compact={solid}
            onClick={() => {
              selectSection("inicio");
              closeMenu();
            }}
          />

          <nav aria-label="Principal" className="hidden items-center gap-5 xl:flex">
            {navigation.map((item) => {
              const id = item.href.slice(1);
              const isActive = active === id;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => selectSection(id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative py-2 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors duration-500 hover:text-gold after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:bg-gold after:transition-transform after:duration-500 after:ease-editorial ${
                    isActive ? "text-gold after:scale-x-100" : "text-cream/80 after:scale-x-0 hover:after:scale-x-100"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={restaurant.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Fale conosco pelo WhatsApp"
              className="hidden bg-gold px-5 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-500 ease-editorial hover:bg-champagne xl:inline-flex"
            >
              Fale conosco
            </a>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="menu-mobile"
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              className="flex h-11 w-11 items-center justify-center text-gold xl:hidden"
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="menu-mobile"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-ink px-6 pb-10 pt-32 text-cream xl:hidden"
          >
            <nav aria-label="Menu mobile">
              <ul>
                {navigation.map((item, index) => {
                  const id = item.href.slice(1);
                  const isActive = active === id;
                  return (
                    <motion.li
                      key={item.href}
                      initial={reduce ? false : { opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12 + index * 0.06, duration: 0.7, ease: EASE }}
                      className="border-b border-gold/15"
                    >
                      <a
                        href={item.href}
                        onClick={() => {
                          selectSection(id);
                          closeMenu();
                        }}
                        aria-current={isActive ? "true" : undefined}
                        className={`flex items-baseline gap-5 py-4 transition-colors duration-500 hover:text-gold ${
                          isActive ? "text-gold" : ""
                        }`}
                      >
                        <span className="font-serif text-4xl">{item.label}</span>
                      </a>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-auto space-y-6 pt-12"
            >
              <a
                href={restaurant.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center bg-gold px-6 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-500 hover:bg-champagne"
              >
                Fale conosco
              </a>

              <ul className="space-y-4 text-sm text-cream/80">
                <li>
                  <a href={restaurant.phoneHref} className="flex items-center gap-3">
                    <PhoneIcon className="text-gold" /> {restaurant.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a href={restaurant.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                    <WhatsAppIcon className="text-gold" /> WhatsApp
                  </a>
                </li>
                <li>
                  <a href={restaurant.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                    <InstagramIcon className="text-gold" /> {restaurant.instagramHandle}
                  </a>
                </li>
                <li className="flex items-start gap-3 text-cream/60">
                  <PinIcon className="mt-0.5 shrink-0 text-gold" /> {restaurant.address.full}
                </li>
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
