
import { useState } from 'react'

export default function Reservation() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    guests: '2',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <section
      id="reservation"
      className="bg-white px-5 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:gap-16">
        <div className="flex flex-col justify-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-800">
            Save Your Seat
          </p>

          <h2 className="mb-6 text-3xl font-bold leading-tight text-stone-900 sm:text-4xl">
            Make a Reservation
          </h2>

          <p className="mb-8 max-w-lg leading-7 text-stone-600">
            Planning a special evening or simply craving authentic Italian
            food? Reserve your table and let us take care of the rest.
          </p>

          <div className="space-y-5 text-stone-700">
            <div>
              <h3 className="mb-1 font-bold text-stone-900">Opening Hours</h3>
              <p>Monday – Sunday: 12:00 PM – 10:00 PM</p>
            </div>

            <div>
              <h3 className="mb-1 font-bold text-stone-900">Our Location</h3>
              <p>12 Italian Street, City Centre</p>
            </div>

            <div>
              <h3 className="mb-1 font-bold text-stone-900">Contact</h3>
              <p>+39 123 456 7890</p>
              <p>hello@bellatavola.example</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-stone-100 p-6 sm:p-8">
          {submitted ? (
            <div className="py-10 text-center">
              <div className="mb-4 text-4xl text-emerald-800">✓</div>

              <h3 className="mb-3 text-2xl font-bold text-stone-900">
                Thank You, {formData.name}!
              </h3>

              <p className="mb-6 leading-7 text-stone-600">
                Your reservation request has been recorded on this page.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSubmitted(false)
                  setFormData({
                    name: '',
                    email: '',
                    date: '',
                    time: '',
                    guests: '2',
                    message: '',
                  })
                }}
                className="rounded-full bg-emerald-900 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800"
              >
                Make Another Reservation
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-stone-800"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/20"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-stone-800"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/20"
                  placeholder="you@example.com"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="date"
                    className="mb-2 block text-sm font-semibold text-stone-800"
                  >
                    Date
                  </label>

                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toLocaleDateString('en-CA')}
                    required
                    className="w-full min-w-0 rounded-lg border border-stone-300 bg-white px-3 py-3 outline-none transition focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="time"
                    className="mb-2 block text-sm font-semibold text-stone-800"
                  >
                    Time
                  </label>

                  <select
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="w-full min-w-0 rounded-lg border border-stone-300 bg-white px-3 py-3 outline-none transition focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/20"
                  >
                    <option value="">Choose time</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                    <option value="18:00">6:00 PM</option>
                    <option value="19:00">7:00 PM</option>
                    <option value="20:00">8:00 PM</option>
                    <option value="21:00">9:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="guests"
                  className="mb-2 block text-sm font-semibold text-stone-800"
                >
                  Number of Guests
                </label>

                <select
                  id="guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/20"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5 Guests</option>
                  <option value="6">6 Guests</option>
                  <option value="7+">7+ Guests</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-stone-800"
                >
                  Special Requests (Optional)
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows="3"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full resize-y rounded-lg border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/20"
                  placeholder="Any special requests?"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-emerald-900 px-6 py-3.5 font-semibold text-white transition hover:bg-emerald-800"
              >
                Request a Reservation
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
