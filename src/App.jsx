
import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Menu from './components/Menu.jsx'
import About from './components/About.jsx'
import Reservation from './components/Reservation.jsx'
import Footer from './components/Footer.jsx'
import Auth from './components/Auth.jsx'

export default function App() {
  const [user, setUser] = useState(null)
  const [showAuth, setShowAuth] = useState(false)

  async function loadUser() {
    try {
      const response = await fetch(
        'http://localhost:3000/api/auth/me',
        {
          credentials: 'include',
        },
      )

      if (!response.ok) {
        setUser(null)
        return
      }

      const data = await response.json()
      setUser(data.user)
    } catch {
      setUser(null)
    }
  }

  async function handleLogout() {
    try {
      const response = await fetch(
        'http://localhost:3000/api/auth/logout',
        {
          method: 'POST',
          credentials: 'include',
        },
      )

      if (!response.ok) {
        throw new Error('Logout failed.')
      }

      setUser(null)
    } catch (error) {
      console.error(error.message)
    }
  }

  useEffect(() => {
    loadUser()
  }, [])

  return (
    <>
      <Header
        user={user}
        onLoginClick={() => setShowAuth(true)}
        onLogout={handleLogout}
      />

      <main>
        <Hero />
        <Menu />
        <About />
        <Reservation />
      </main>

      <Footer />

      {showAuth && (
        <Auth
          onClose={() => setShowAuth(false)}
          onLogin={loadUser}
        />
      )}
    </>
  )
}
