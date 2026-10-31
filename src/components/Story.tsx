import { images, restaurant } from "../content/site";
import { ParallaxImage, Reveal } from "./ui";

export function Story() {
  return (
    <section id="historia" className="relative overflow-hidden bg-champagne py-28 text-ink md:py-44">
      <div className="mx-auto grid max-w-7xl items-center gap-20 px-6 md:px-10 lg:grid-cols-12 lg:gap-12 lg:px-12">
        {/* Composição editorial: fotografia grande, sangrando para a borda em telas largas. */}
        <Reveal className="relative lg:col-span-7 lg:-mr-12">
          <ParallaxImage
            src={images.story.src}
            alt={images.story.alt}
            className="aspect-[4/5] md:aspect-[5/6] lg:aspect-[4/5]"
            sizes="(min-width: 1024px) 58vw, 100vw"
          />
          <div className="absolute -bottom-8 right-4 bg-ink px-7 py-6 text-cream md:-right-8 md:px-9 md:py-8">
            <p className="text-[10px] font-medium uppercase tracking-eyebrow text-cream/70">Desde</p>
            <p className="mt-1 font-serif text-5xl font-medium leading-none text-gold md:text-6xl">
              {restaurant.foundedYear}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="lg:col-span-4 lg:col-start-9">
          <p className="mb-6 flex items-center gap-4 text-[11px] font-medium uppercase tracking-eyebrow text-ink/70">
            <span aria-hidden="true" className="h-px w-10 bg-ink/40" />
            A nossa tradição
          </p>
          <h2 className="font-serif text-4xl font-medium leading-[1.05] md:text-5xl lg:text-6xl">
            Uma história feita de <span className="italic">sabores e encontros.</span>
          </h2>
          <p className="mt-6 font-script text-3xl text-ink/80 md:text-4xl">Desde {restaurant.foundedYear}, da nossa família para a sua.</p>

          <div className="mt-10 space-y-6 text-base leading-relaxed text-ink/75 md:text-lg">
            <p>
              O Comilância recebe quem chega a Miguel Pereira com a mesma proposta de sempre: uma mesa posta com
              cuidado, comida caprichada e um atendimento que faz sentir-se em casa.
            </p>
            <p>
              A tradição da cozinha brasileira convive com a culinária japonesa, sempre com a identidade familiar que
              construiu a nossa história e a confiança de quem volta.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
