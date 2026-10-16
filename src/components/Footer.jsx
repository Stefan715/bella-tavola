
export default function Footer() {
  return (
    <footer className="bg-stone-950 px-5 py-12 text-stone-300 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <a
            href="#home"
            className="mb-4 inline-block text-2xl font-bold text-white"
          >
            Bella Tavola
          </a>

          <p className="max-w-sm text-sm leading-6 text-stone-400">
            Authentic Italian cuisine, fresh ingredients and memorable moments
            shared around the table.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-white">Quick Links</h3>

          <nav className="flex flex-col items-start gap-3 text-sm">
            <a href="#home" className="transition hover:text-white">
              Home
            </a>

            <a href="#menu" className="transition hover:text-white">
              Menu
            </a>

            <a href="#about" className="transition hover:text-white">
              About Us
            </a>

            <a href="#reservation" className="transition hover:text-white">
              Reservations
            </a>
          </nav>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-white">Visit Us</h3>

          <p className="mb-2 text-sm leading-6 text-stone-400">
            12 Italian Street
            <br />
            City Centre
          </p>

          <p className="text-sm text-stone-400">
            Monday – Sunday
            <br />
            12:00 PM – 10:00 PM
          </p>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-stone-800 pt-6 text-center text-sm text-stone-500">
        <p>
          © {new Date().getFullYear()} Bella Tavola. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
