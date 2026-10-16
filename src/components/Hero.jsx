
export default function Hero() {
  return (
    <section
      id="home"
      className="flex min-h-[70vh] items-center justify-center bg-stone-100 px-6 py-20 text-center"
    >
      <div className="max-w-3xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-800">
          Authentic Italian Cuisine
        </p>

        <h1 className="mb-6 text-4xl font-bold tracking-tight text-stone-900 sm:text-6xl">
          A Taste of Italy,
          <span className="block text-emerald-900">
            Made with Love
          </span>
        </h1>

        <p className="mx-auto mb-8 max-w-xl text-lg leading-8 text-stone-600">
          Discover delicious Italian dishes made with fresh ingredients
          and traditional recipes.
        </p>

        <a
          href="#menu"
          className="inline-block rounded-full bg-emerald-900 px-7 py-3 font-semibold text-white transition hover:bg-emerald-800"
        >
          Explore Our Menu
        </a>
      </div>
    </section>
  )
}
