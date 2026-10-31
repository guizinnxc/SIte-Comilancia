import { navigation, restaurant } from "../content/site";
import { FacebookIcon, InstagramIcon, PhoneIcon, WhatsAppIcon } from "./Icons";
import { Logo } from "./ui";

// Ícone claro que passa ao dourado da marca com hover ou foco por teclado.
const contactLink =
  "flex h-11 w-11 items-center justify-center text-cream transition-colors duration-300 hover:text-gold focus-visible:text-gold";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gold/15 bg-ink text-cream/70">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 md:grid-cols-12 md:px-10 lg:px-12">
        <div className="md:col-span-4">
          <Logo />
          <p className="mt-8 max-w-xs font-script text-3xl leading-snug text-gold">{restaurant.tagline}</p>
        </div>

        <nav aria-label="Rodapé" className="md:col-span-2 md:col-start-6">
          <p className="text-[11px] font-medium uppercase tracking-eyebrow text-gold">Navegação</p>
          <ul className="mt-6 space-y-3 text-sm">
            {navigation.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="transition-colors hover:text-gold">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-3 text-sm leading-relaxed md:col-span-3">
          <p className="text-[11px] font-medium uppercase tracking-eyebrow text-gold">Localização</p>
          <p className="mt-6">{restaurant.address.full}</p>
          <p className="pt-2 text-[11px] font-medium uppercase tracking-eyebrow text-gold">Funcionamento</p>
          <p>
            {restaurant.hours.label}, das {restaurant.hours.range}
          </p>
        </div>

        <div className="md:col-span-3">
          <p className="text-[11px] font-medium uppercase tracking-eyebrow text-gold">Contato</p>
          {/* Canais de contato em ícones: área de toque de 44 px, ícones de 24 px, sem caixas decorativas. */}
          <ul className="-ml-3 mt-6 flex flex-wrap items-center gap-1">
            <li>
              <a href={restaurant.phoneHref} aria-label="Ligar para a Comilância" className={contactLink}>
                <PhoneIcon width={24} height={24} />
              </a>
            </li>
            <li>
              <a
                href={restaurant.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Falar pelo WhatsApp"
                className={contactLink}
              >
                <WhatsAppIcon width={24} height={24} />
              </a>
            </li>
            <li>
              <a
                href={restaurant.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da Comilância"
                className={contactLink}
              >
                <InstagramIcon width={24} height={24} />
              </a>
            </li>
            <li>
              <a
                href={restaurant.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook da Comilância"
                className={contactLink}
              >
                <FacebookIcon width={22} height={22} />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-xs md:flex-row md:items-center md:justify-between md:px-10 lg:px-12">
          <p>
            © {year} {restaurant.name}. Todos os direitos reservados.
          </p>
          <a href="#inicio" className="uppercase tracking-eyebrow transition-colors hover:text-gold">
            Voltar ao topo
          </a>
        </div>
      </div>
    </footer>
  );
}
