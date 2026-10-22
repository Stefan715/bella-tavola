
import { useState } from 'react'
import API_URL from '../api.js'

export default function Auth({ onClose, onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setMessage('')
    setLoading(true)

    const endpoint = isLogin ? 'login' : 'register'

    const body = isLogin
      ? { email, password }
      : { name, email, password }

    try {
      const response = await fetch(
        `${API_URL}/api/auth/${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(body),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong.')
      }

      if (isLogin) {
        await onLogin()
        onClose()
      } else {
        setMessage('Account created! You can now log in.')
        setIsLogin(true)
        setName('')
        setPassword('')
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-emerald-900">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-stone-500 hover:text-stone-900"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label
                htmlFor="auth-name"
                className="mb-1 block text-sm font-medium text-stone-700"
              >
                Full Name
              </label>
              <input
                id="auth-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                maxLength={100}
                autoComplete="name"
                className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-emerald-800"
                placeholder="Your name"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="auth-email"
              className="mb-1 block text-sm font-medium text-stone-700"
            >
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              maxLength={255}
              autoComplete="email"
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-emerald-800"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="auth-password"
              className="mb-1 block text-sm font-medium text-stone-700"
            >
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-emerald-800"
              placeholder="At least 8 characters"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          {message && (
            <p role="status" className="text-sm text-emerald-800">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-emerald-900 px-5 py-3 font-medium text-white transition hover:bg-emerald-800 disabled:opacity-50"
          >
            {loading
              ? 'Please wait...'
              : isLogin
                ? 'Log In'
                : 'Create Account'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-stone-600">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
              setMessage('')
            }}
            className="font-semibold text-emerald-900 hover:underline"
          >
            {isLogin ? 'Register' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  )
}
