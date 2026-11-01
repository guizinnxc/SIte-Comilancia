import { gastronomy, menuCategories } from "../content/site";
import type { GastronomyItem, MenuCategory } from "../types";
import { useMediaQuery } from "../lib/useMediaQuery";
import { ArrowIcon } from "./Icons";
import { SafeImage } from "./SafeImage";
import { Reveal, SectionHeading } from "./ui";

// Em telas largas os três cartões entram em sequência; no celular, cada um entra quando aparece.
const DESKTOP_QUERY = "(min-width: 1024px)";
const CARD_STAGGER = 0.1;

export function Gastronomy() {
  const isDesktop = useMediaQuery(DESKTOP_QUERY);

  // Sem padding inferior: a Galeria vem em seguida, no mesmo fundo, e o padding superior dela faz a separação.
  return (
    <section id="gastronomia" className="bg-ink pt-28 md:pt-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
        <Reveal>
          <SectionHeading
            className="max-w-3xl"
            eyebrow="Nossa gastronomia"
            title={
              <>
                Três caminhos <span className="italic text-champagne">para o seu almoço.</span>
              </>
            }
          />
        </Reveal>

        <div className="mt-16 grid gap-6 md:mt-20 md:gap-8 lg:grid-cols-3">
          {gastronomy.map((item, index) => (
            <GastronomyCard key={item.id} item={item} delay={isDesktop ? index * CARD_STAGGER : 0} />
          ))}
        </div>

        {menuCategories.length > 0 && (
          <div className="mt-28 md:mt-40">
            <MenuPreview categories={menuCategories} />
          </div>
        )}
      </div>
    </section>
  );
}

/*
 * Cartão fotográfico: a fotografia ocupa o cartão inteiro e o texto fica sobre a parte inferior,
 * em um degradê escuro. O texto é sempre visível, sem depender de mouse ou de passagem do cursor.
 */
function GastronomyCard({ item, delay }: { item: GastronomyItem; delay: number }) {
  return (
    <Reveal
      delay={delay}
      distance={20}
      className="group relative isolate flex aspect-[4/5] overflow-hidden bg-graphite lg:aspect-[3/4]"
    >
      {item.image && (
        <SafeImage
          src={item.image.src}
          alt={item.image.alt}
          objectPosition={item.imagePosition}
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="card-photo absolute inset-0 h-full w-full"
        />
      )}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/80 to-transparent px-6 pb-8 pt-40 md:px-8 md:pb-10">
        <p className="text-[11px] font-medium uppercase tracking-eyebrow text-gold">{item.eyebrow}</p>
        <h3 className="mt-3 font-serif text-3xl font-medium leading-tight text-cream md:text-4xl">{item.title}</h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/85 md:text-base">{item.description}</p>
        {/* Espaço reservado em todos os cartões, para que títulos e descrições fiquem alinhados entre si. */}
        <div className="mt-6 min-h-[2.25rem]">
          {item.menuLink && (
            <a
              href={item.menuLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-3 border-b border-gold/50 pb-1 text-[11px] font-medium uppercase tracking-[0.2em] text-gold transition-colors duration-500 hover:border-gold hover:text-champagne"
            >
              {item.menuLink.label}
              <ArrowIcon className="transition-transform duration-500 group-hover:translate-x-1" />
            </a>
          )}
        </div>
      </div>
    </Reveal>
  );
}

// Exibido automaticamente quando o cardápio próprio for preenchido em site.ts.
function MenuPreview({ categories }: { categories: MenuCategory[] }) {
  return (
    <div className="grid gap-14 border-t border-gold/20 pt-16 md:grid-cols-2">
      {categories.map((category) => (
        <Reveal key={category.title}>
          <h3 className="font-serif text-3xl font-medium text-cream">{category.title}</h3>
          <ul className="mt-8 divide-y divide-cream/10">
            {category.items.map((menuItem) => (
              <li key={menuItem.name} className="flex items-baseline justify-between gap-6 py-5">
                <div>
                  <p className="font-medium text-cream">{menuItem.name}</p>
                  {menuItem.description && <p className="mt-1 text-sm text-cream/60">{menuItem.description}</p>}
                </div>
                {menuItem.price && <p className="shrink-0 text-gold">{menuItem.price}</p>}
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </div>
  );
}
