
import express from 'express'
import { pool } from './db.js'
import cors from 'cors'
import authRouter from './auth.js'
import 'dotenv/config'
import session from 'express-session'
import connectPgSimple from 'connect-pg-simple'
import Stripe from 'stripe'

const app = express()
const PORT = process.env.PORT || 3000
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

app.set('trust proxy', 1)

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    process.env.CLIENT_URL,
  ].filter(Boolean),
  credentials: true,
}))

const PgSession = connectPgSimple(session)

app.use(session({
  store: new PgSession({
    pool,
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'production',
  },
}))

// Stripe webhook must receive the raw request body.
app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const signature = req.headers['stripe-signature']

    let event

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (error) {
      console.error('Webhook signature error:', error.message)
      return res.status(400).send(`Webhook Error: ${error.message}`)
    }

    try {
      if (event.type === 'checkout.session.completed') {
        const checkoutSession = event.data.object

        if (checkoutSession.payment_status === 'paid') {
          await pool.query(
            `UPDATE orders
             SET status = 'paid'
             WHERE stripe_session_id = $1
               AND status = 'pending'`,
            [checkoutSession.id]
          )
        }
      }

      res.json({ received: true })
    } catch (error) {
      console.error('Webhook processing error:', error.message)
      res.status(500).json({ error: 'Webhook processing failed.' })
    }
  }
)

app.use(express.json())
app.use('/api/auth', authRouter)


app.post('/api/checkout', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        error: 'Please log in before ordering.',
      })
    }

    const { items } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: 'Your cart is empty.',
      })
    }

    const quantities = new Map()

    for (const item of items) {
      const id = Number(item.id)
      const quantity = Number(item.quantity)

      if (
        !Number.isInteger(id) ||
        id < 1 ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 20
      ) {
        return res.status(400).json({
          error: 'Invalid item or quantity.',
        })
      }

      quantities.set(id, (quantities.get(id) || 0) + quantity)
    }

    for (const quantity of quantities.values()) {
      if (quantity > 20) {
        return res.status(400).json({
          error: 'Maximum quantity per dish is 20.',
        })
      }
    }

    const ids = [...quantities.keys()]
    const result = await pool.query(
      `SELECT id, name, price, stock_quantity
       FROM menu_items
       WHERE id = ANY($1::int[])`,
      [ids]
    )

    if (result.rowCount !== ids.length) {
      return res.status(400).json({
        error: 'One or more dishes were not found.',
      })
    }

    for (const dish of result.rows) {
      if (dish.stock_quantity < quantities.get(dish.id)) {
        return res.status(400).json({
          error: `Not enough stock for ${dish.name}.`,
        })
      }
    }

    const total = result.rows.reduce(
      (sum, dish) =>
        sum + Number(dish.price) * quantities.get(dish.id),
      0
    )

    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, total_amount)
       VALUES ($1, $2)
       RETURNING id`,
      [req.session.userId, total.toFixed(2)]
    )

    const orderId = orderResult.rows[0].id

    for (const dish of result.rows) {
      await pool.query(
        `INSERT INTO "orderItems"
          (order_id, menu_item_id, quantity, unit_price)
         VALUES ($1, $2, $3, $4)`,
        [
          orderId,
          dish.id,
          quantities.get(dish.id),
          dish.price,
        ]
      )
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: result.rows.map((dish) => ({
        price_data: {
          currency: 'bam',
          product_data: {
            name: dish.name,
          },
          unit_amount: Math.round(Number(dish.price) * 100),
        },
        quantity: quantities.get(dish.id),
      })),
      success_url: `${process.env.CLIENT_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/online-order`,
      metadata: {
        orderId: String(orderId),
      },
    })

    await pool.query(
      `UPDATE orders
       SET stripe_session_id = $1
       WHERE id = $2`,
      [checkoutSession.id, orderId]
    )

    return res.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Checkout failed:', error.message)

    return res.status(500).json({
      error: 'Unable to start checkout.',
    })
  }
})


app.get('/api/orders/:id', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        error: 'Please log in first.',
      })
    }

    const orderId = Number(req.params.id)

    if (!Number.isInteger(orderId) || orderId < 1) {
      return res.status(400).json({
        error: 'Invalid order ID.',
      })
    }

    const result = await pool.query(
      `SELECT id, status, total_amount, created_at
       FROM orders
       WHERE id = $1 AND user_id = $2`,
      [orderId, req.session.userId]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: 'Order not found.',
      })
    }

    return res.json({ order: result.rows[0] })
  } catch (error) {
    console.error('Order lookup failed:', error.message)

    return res.status(500).json({
      error: 'Unable to fetch order.',
    })
  }
})


app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Bella Tavola API is running!',
  })
})

app.get('/api/menu', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, category, price, description, image,
              stock_quantity
       FROM menu_items
       ORDER BY id`
    )

    res.json(result.rows)
  } catch (error) {
    console.error('Failed to fetch menu:', error.message)
    res.status(500).json({
      error: 'Failed to fetch menu items.',
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
