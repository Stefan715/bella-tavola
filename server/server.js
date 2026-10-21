
import express from 'express'
import { pool } from './db.js'
import cors from 'cors'
import authRouter from './auth.js'

const app = express()
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
  ],
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
