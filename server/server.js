
import express from 'express'
import { pool } from './db.js'
import cors from 'cors'
import authRouter from './auth.js'
import 'dotenv/config'
import session from 'express-session'
import connectPgSimple from 'connect-pg-simple'

const app = express()
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
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  },
}))
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
  ],
  credentials: true,
}))
const PORT = process.env.PORT || 3000

app.use(express.json())

app.use('/api/auth', authRouter)

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Bella Tavola API is running!',
  })
})

app.get('/api/menu', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, category, price, description, image
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
