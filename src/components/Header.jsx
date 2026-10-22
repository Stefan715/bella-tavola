
export default function Header({ user, onLoginClick, onLogout }) {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <a
          href="#home"
          className="text-2xl font-bold tracking-tight text-emerald-900"
        >
          Bella Tavola
        </a>

        <div className="flex items-center gap-4 text-sm font-medium text-stone-700 sm:gap-6">
          <a href="#home" className="transition hover:text-emerald-800">
            Home
          </a>

          <a href="#menu" className="transition hover:text-emerald-800">
            Menu
          </a>

          <a href="#about" className="transition hover:text-emerald-800">
            About
          </a>

          <a
            href="#reservation"
            className="rounded-full bg-emerald-900 px-4 py-2 text-white transition hover:bg-emerald-800 sm:px-5"
          >
            Book a Table
          </a>

          {user ? (
            <>
              <span className="hidden text-emerald-900 sm:inline">
                Hi, {user.name}
              </span>

              <button
                type="button"
                onClick={onLogout}
                className="rounded-full border border-emerald-900 px-4 py-2 text-emerald-900 transition hover:bg-emerald-50"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onLoginClick}
              className="rounded-full border border-emerald-900 px-4 py-2 text-emerald-900 transition hover:bg-emerald-50"
            >
              Login
            </button>
          )}
        </div>
      </nav>
    </header>
  )
}
