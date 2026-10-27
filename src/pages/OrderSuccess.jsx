
import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import API_URL from '../api.js'

export default function OrderSuccess() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [status, setStatus] = useState('Checking payment...')
  const [order, setOrder] = useState(null)

  useEffect(() => {
    let cancelled = false
    let attempts = 0

    async function checkOrder() {
      if (!sessionId) {
        setStatus('No payment session found.')
        return
      }

      while (!cancelled && attempts < 10) {
        attempts += 1

        try {
          const response = await fetch(
            `${API_URL}/api/orders/by-session/${encodeURIComponent(sessionId)}`,
            { credentials: 'include' },
          )

          if (response.ok) {
            const data = await response.json()

            if (cancelled) return

            setOrder(data.order)

            if (data.order.status === 'paid') {
              setStatus('Payment successful!')
              return
            }
          }
        } catch (error) {
          console.error('Order status check failed:', error)
        }

        await new Promise((resolve) => setTimeout(resolve, 1500))
      }

      if (!cancelled) {
        setStatus('Payment is processing. Please refresh this page shortly.')
      }
    }

    checkOrder()

    return () => {
      cancelled = true
    }
  }, [sessionId])

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-5 py-16">
      <section className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 className="mb-4 text-3xl font-bold text-emerald-900">
          Order confirmation
        </h1>

        <p className="mb-6 text-stone-700">{status}</p>

        {order && (
          <div className="mb-6 rounded-xl bg-stone-50 p-4 text-left">
            <p>Order number: {order.id}</p>
            <p>Status: {order.status}</p>
            <p>Total: {Number(order.total_amount).toFixed(2)} KM</p>
          </div>
        )}

        <Link
          to="/"
          className="inline-block rounded-full bg-emerald-900 px-6 py-3 font-semibold text-white"
        >
          Back to Bella Tavola
        </Link>
      </section>
    </main>
  )
}
