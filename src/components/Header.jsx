
import { useState } from 'react'

export default function Header({ user, onLoginClick, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  function handleLogout() {
    closeMenu()
    onLogout()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <a
          href="#home"
          onClick={closeMenu}
          className="text-2xl font-bold tracking-tight text-emerald-900"
        >
          Bella Tavola
        </a>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-emerald-900 hover:bg-stone-100 md:hidden"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-7 w-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-7 w-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </button>

        <div
          id="main-navigation"
          className={`${
            menuOpen ? 'flex' : 'hidden'
          } absolute left-0 top-full w-full flex-col gap-4 border-b border-stone-200 bg-white px-5 py-5 text-sm font-medium text-stone-700 shadow-md md:static md:flex md:w-auto md:flex-row md:items-center md:gap-6 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
        >
          <a
            href="#home"
            onClick={closeMenu}
            className="transition hover:text-emerald-800"
          >
            Home
          </a>

          <a
            href="#menu"
            onClick={closeMenu}
            className="transition hover:text-emerald-800"
          >
            Menu
          </a>

          <a
            href="#about"
            onClick={closeMenu}
            className="transition hover:text-emerald-800"
          >
            About
          </a>

          <a
            href="/my-orders"
            onClick={closeMenu}
            className="transition hover:text-emerald-800"
          >
            My Orders
          </a>

          <a
            href="#reservation"
            onClick={closeMenu}
            className="rounded-full bg-emerald-900 px-5 py-2 text-center text-white transition hover:bg-emerald-800"
          >
            Book a Table
          </a>

          {user ? (
            <>
              <span className="text-emerald-900">
                Hi, {user.name}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-emerald-900 px-4 py-2 text-emerald-900 transition hover:bg-emerald-50"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                closeMenu()
                onLoginClick()
              }}
              className="rounded-full border border-emerald-900 px-4 py-2 text-left text-emerald-900 transition hover:bg-emerald-50"
            >
              Login
            </button>
          )}
        </div>
      </nav>
    </header>
  )
}
