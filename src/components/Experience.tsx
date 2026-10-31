import { experience, images } from "../content/site";
import { ParallaxImage, Reveal, SectionHeading } from "./ui";

export function Experience() {
  return (
    <section id="experiencia" className="relative overflow-hidden bg-graphite py-28 md:py-40">
      <div className="mx-auto grid max-w-7xl items-center gap-20 px-6 md:px-10 lg:grid-cols-12 lg:gap-12 lg:px-12">
        <Reveal className="relative lg:col-span-6">
          <ParallaxImage
            src={images.experience.src}
            alt={images.experience.alt}
            className="aspect-[3/4] md:aspect-[4/5] lg:mr-16"
            sizes="(min-width: 1024px) 45vw, 100vw"
          />
          <div className="absolute bottom-10 right-0 hidden max-w-[15rem] bg-ink p-7 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)] lg:block">
            <p className="font-serif text-2xl italic leading-snug text-champagne">
              Uma pausa para o que realmente importa.
            </p>
          </div>
        </Reveal>

        <div className="lg:col-span-5 lg:col-start-8">
          <Reveal>
            <SectionHeading
              eyebrow="Uma experiência além da gastronomia"
              title={
                <>
                  Almoçar aqui é <span className="italic text-champagne">desacelerar.</span>
                </>
              }
            />
            <p className="mt-8 max-w-md text-base leading-relaxed text-cream/70 md:text-lg">
              Um lugar pensado para receber a família com calma, tradição e hospitalidade, do primeiro cumprimento à
              última sobremesa.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="mt-14 divide-y divide-cream/10 border-y border-cream/15">
              {experience.map((item) => (
                <li key={item.title} className="py-7">
                  <h3 className="font-serif text-2xl font-medium text-cream">{item.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-cream/70">{item.description}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
