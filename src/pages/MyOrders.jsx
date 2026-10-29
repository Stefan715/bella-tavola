import { useEffect, useState } from 'react'

export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost:3000/api/orders', {
      credentials: 'include',
    })
      .then(async (response) => {
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load orders.')
        }

        return data
      })
      .then((data) => setOrders(data.orders))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="p-8">Loading orders...</p>

  if (error) {
    return <p className="p-8 text-red-600">{error}</p>
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">My Orders</h1>

        <a
            href="/"
            className="rounded-full bg-emerald-900 px-5 py-2 text-white transition hover:bg-emerald-800"
        >
            ← Back to Home
        </a>
        </div>

      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-lg border p-5"
            >
              <div>
                <h2 className="font-semibold">Order #{order.id}</h2>
                <p className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>

              <p className="font-semibold">
                {Number(order.total_amount).toFixed(2)} KM
              </p>

              <span
                className={`rounded-full px-3 py-1 text-sm ${
                  order.status === 'paid'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {order.status}
              </span>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
