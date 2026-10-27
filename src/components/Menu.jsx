
import { useEffect, useState } from 'react'
import API_URL from '../api.js'

const categories = ['All', 'Starters', 'Main Courses', 'Desserts']

export default function Menu() {
  const [dishes, setDishes] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [quantities, setQuantities] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')

  useEffect(() => {
    async function fetchDishes() {
      try {
        const response = await fetch(`${API_URL}/api/menu`)

        if (!response.ok) throw new Error('Failed to load menu.')

        const data = await response.json()
        setDishes(data)
      } catch (err) {
        setError('Unable to load the menu. Please try again later.')
        console.error('Menu loading error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDishes()
  }, [])

  const filteredDishes =
    activeCategory === 'All'
      ? dishes
      : dishes.filter((dish) => dish.category === activeCategory)

  function updateQuantity(dish, quantity) {
    const value = Math.max(
      0,
      Math.min(Number(quantity) || 0, Number(dish.stock_quantity))
    )

    setQuantities((current) => ({
      ...current,
      [dish.id]: value,
    }))
  }

  async function handleCheckout() {
    setCheckoutError('')

    const items = dishes
      .filter((dish) => Number(quantities[dish.id] || 0) > 0)
      .map((dish) => ({
        id: dish.id,
        quantity: Number(quantities[dish.id]),
      }))

    if (items.length === 0) {
      setCheckoutError('Please select at least one dish.')
      return
    }

    setCheckoutLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/checkout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      })

      const data = await response.json()

      if (response.status === 401) {
        throw new Error('Please log in before placing an order.')
      }

      if (!response.ok) {
        throw new Error(data.error || 'Unable to start checkout.')
      }

      if (!data.url) {
        throw new Error('Checkout URL was not returned.')
      }

      window.location.href = data.url
    } catch (err) {
      setCheckoutError(err.message)
      setCheckoutLoading(false)
    }
  }

  const cartTotal = dishes.reduce(
    (total, dish) =>
      total +
      Number(dish.price) * Number(quantities[dish.id] || 0),
    0
  )

  return (
    <section id="menu" className="bg-white px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-800">
            Discover Our Dishes
          </p>

          <h2 className="mb-4 text-3xl font-bold text-stone-900 sm:text-4xl">
            Our Menu
          </h2>

          <p className="mx-auto max-w-2xl leading-7 text-stone-600">
            Fresh ingredients, authentic Italian recipes and unforgettable
            flavours, prepared with love.
          </p>
        </div>

        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                activeCategory === category
                  ? 'bg-emerald-900 text-white'
                  : 'border border-stone-300 bg-white text-stone-700 hover:border-emerald-900 hover:text-emerald-900'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading && (
          <p className="py-10 text-center text-stone-600">
            Loading menu...
          </p>
        )}

        {error && (
          <p role="alert" className="py-10 text-center text-red-700">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDishes.map((dish) => {
              const stock = parseInt(dish.stock_quantity, 10) || 0
              const quantity = Number(quantities[dish.id] || 0)

              return (
                <article
                  key={dish.id}
                  className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="h-56 w-full object-cover"
                    loading="lazy"
                  />

                  <div className="p-5">
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <h3 className="text-xl font-bold text-stone-900">
                        {dish.name}
                      </h3>

                      <span className="shrink-0 font-bold text-emerald-900">
                        {Number(dish.price).toFixed(2)} KM
                      </span>
                    </div>

                    <p className="mb-4 text-sm leading-6 text-stone-600">
                      {dish.description}
                    </p>

                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span className="text-sm text-stone-600">
                        {stock > 0 ? `In stock: ${stock}` : 'Out of stock'}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label={`Remove one ${dish.name}`}
                          disabled={quantity === 0}
                          onClick={() => updateQuantity(dish, quantity - 1)}
                          className="h-9 w-9 rounded-full border border-stone-300 text-lg disabled:opacity-40"
                        >
                          −
                        </button>

                        <span className="min-w-5 text-center">
                          {quantity}
                        </span>

                        <button
                          type="button"
                          aria-label={`Add one ${dish.name}`}
                          disabled={quantity >= stock}
                          onClick={() => updateQuantity(dish, quantity + 1)}
                          className="h-9 w-9 rounded-full border border-stone-300 text-lg disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <span className="inline-block rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
                      {dish.category}
                    </span>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {!loading && !error && filteredDishes.length === 0 && (
          <p className="py-10 text-center text-stone-600">
            No dishes found in this category.
          </p>
        )}

        {!loading && !error && (
          <div className="mt-12 rounded-2xl border border-stone-200 bg-stone-50 p-6 text-center">
            <p className="mb-2 text-lg font-semibold text-stone-900">
              Order for home delivery
            </p>

            <p className="mb-4 text-stone-700">
              Total: {cartTotal.toFixed(2)} KM
            </p>

            {checkoutError && (
              <p role="alert" className="mb-4 text-sm text-red-700">
                {checkoutError}
              </p>
            )}

            <button
              type="button"
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="rounded-full bg-emerald-900 px-7 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {checkoutLoading ? 'Redirecting...' : 'Order now'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
