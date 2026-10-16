
export default function About() {
  return (
    <section id="about" className="bg-stone-100 px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2 md:gap-16">
        <div className="overflow-hidden rounded-2xl">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80"
            alt="Elegant restaurant dining table"
            className="h-80 w-full object-cover sm:h-[420px]"
            loading="lazy"
          />
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-800">
            Our Story
          </p>

          <h2 className="mb-6 text-3xl font-bold leading-tight text-stone-900 sm:text-4xl">
            A Little Taste of Italy in Every Bite
          </h2>

          <p className="mb-5 leading-7 text-stone-600">
            Bella Tavola was created from a love of Italian food, warm
            hospitality and the joy of sharing a meal with the people who
            matter most.
          </p>

          <p className="mb-8 leading-7 text-stone-600">
            We believe great food starts with fresh ingredients and simple,
            traditional recipes. From handmade pasta to our classic desserts,
            every dish is prepared with care.
          </p>

          <a
            href="#reservation"
            className="inline-block rounded-full bg-emerald-900 px-7 py-3 font-semibold text-white transition hover:bg-emerald-800"
          >
            Visit Our Restaurant
          </a>
        </div>
      </div>
    </section>
  )
}
