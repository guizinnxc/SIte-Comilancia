import { reviews, restaurant } from "../content/site";
import { StarIcon } from "./Icons";
import { Button, Reveal, SectionHeading } from "./ui";

export function Reviews() {
  return (
    <section id="avaliacoes" className="relative overflow-hidden bg-champagne py-28 text-ink md:py-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-16 select-none font-serif text-[28rem] italic leading-none text-ink/[0.05]"
      >
        &ldquo;
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
        <Reveal className="max-w-3xl">
          <SectionHeading
            tone="light"
            eyebrow="Avaliações de clientes"
            title={
              <>
                Palavras de quem <span className="italic">já sentou à nossa mesa.</span>
              </>
            }
          />
        </Reveal>

        {reviews.length > 0 ? (
          <ul className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, index) => (
              <li key={review.id}>
                <Reveal delay={index * 0.08} className="flex h-full flex-col bg-cream p-8 md:p-10">
                  {review.rating !== undefined && (
                    <p className="mb-6 flex gap-1 text-ink" aria-label={`Nota ${review.rating} de 5`}>
                      {Array.from({ length: 5 }, (_, starIndex) => (
                        <StarIcon key={starIndex} filled={starIndex < (review.rating ?? 0)} />
                      ))}
                    </p>
                  )}
                  <blockquote className="flex-1 font-serif text-xl leading-relaxed text-ink">
                    &ldquo;{review.text}&rdquo;
                  </blockquote>
                  <footer className="mt-8 border-t border-ink/15 pt-6 text-sm">
                    <p className="font-medium text-ink">{review.author}</p>
                    <p className="mt-1 text-ink/65">
                      {review.date} ·{" "}
                      <a
                        href={review.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-ink/30 underline-offset-4 hover:text-ink"
                      >
                        Fonte: {review.source}
                      </a>
                    </p>
                  </footer>
                </Reveal>
              </li>
            ))}
          </ul>
        ) : (
          <Reveal delay={0.1} className="mt-20 grid gap-10 border-t border-ink/20 pt-14 md:grid-cols-12 md:items-end">
            <p className="font-serif text-2xl leading-snug text-ink/85 md:col-span-6 md:text-3xl">
              Conte para nós como foi a sua visita. As avaliações verificadas dos nossos clientes são publicadas aqui,
              sempre com a fonte identificada.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row md:col-span-5 md:col-start-8 md:justify-self-end">
              <Button href={restaurant.reviewFormUrl} external variant="dark" showArrow>
                Deixe a sua avaliação
              </Button>
              <Button href={restaurant.instagramUrl} external variant="outline" className="text-ink">
                Instagram
              </Button>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
