import type { ReactNode } from "react";
import { restaurant } from "../content/site";
import { ClockIcon, InstagramIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "./Icons";
import { Button, Reveal, SectionHeading } from "./ui";

const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(restaurant.mapQuery)}&output=embed`;
const routeUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(restaurant.address.full)}`;

// Ícone claro que passa ao dourado com hover ou foco por teclado; a área de toque tem 44 px.
const contactLink =
  "flex h-11 w-11 items-center justify-center text-cream transition-colors duration-300 hover:text-gold focus-visible:text-gold";

export function Location() {
  return (
    <section id="contato" className="bg-ink py-28 md:py-40">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 md:px-10 lg:grid-cols-12 lg:gap-10 lg:px-12">
        <Reveal className="lg:col-span-5">
          <SectionHeading
            eyebrow="Como chegar"
            title={
              <>
                Venha nos <span className="italic text-champagne">visitar.</span>
              </>
            }
          />

          <dl className="mt-14 divide-y divide-cream/10 border-y border-cream/10">
            <InfoRow icon={<PinIcon />} label="Endereço">
              <p>{restaurant.address.street}</p>
              <p>
                {restaurant.address.neighborhood}, {restaurant.address.city} – {restaurant.address.state}
              </p>
            </InfoRow>
            <InfoRow icon={<ClockIcon />} label="Funcionamento">
              <p>{restaurant.hours.label}</p>
              <p>das {restaurant.hours.range}</p>
            </InfoRow>
            <InfoRow icon={<PhoneIcon />} label="Telefone">
              <a href={restaurant.phoneHref} className="transition-colors hover:text-gold">
                {restaurant.phoneDisplay}
              </a>
            </InfoRow>
          </dl>

          <div className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-3">
            <Button href={routeUrl} external showArrow variant="gold">
              Como chegar
            </Button>
            <ul className="flex items-center gap-1">
              <li>
                <a
                  href={restaurant.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Falar pelo WhatsApp"
                  className={contactLink}
                >
                  <WhatsAppIcon width={22} height={22} />
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
                  <InstagramIcon width={22} height={22} />
                </a>
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="lg:col-span-6 lg:col-start-7">
          <div className="relative h-[460px] overflow-hidden bg-graphite md:h-[620px]">
            <iframe
              title="Mapa do Restaurante Comilância, Miguel Pereira – RJ"
              src={mapEmbedSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="h-full w-full border-0 grayscale-[60%] transition-[filter] duration-700 hover:grayscale-0"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function InfoRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-5 py-6">
      <span className="mt-1 shrink-0 text-gold">{icon}</span>
      <div>
        <dt className="mb-2 text-[11px] font-medium uppercase tracking-eyebrow text-gold">{label}</dt>
        <dd className="space-y-1 text-lg leading-relaxed text-cream/90">{children}</dd>
      </div>
    </div>
  );
}
