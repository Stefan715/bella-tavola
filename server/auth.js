
import express from 'express'
import bcrypt from 'bcrypt'
import { pool } from './db.js'

const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Name, email and password are required.',
      })
    }

    const normalizedName = name.trim()
    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedName || !normalizedEmail) {
      return res.status(400).json({
        error: 'Name and email cannot be empty.',
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long.',
      })
    }

    if (normalizedName.length > 100 || normalizedEmail.length > 255) {
      return res.status(400).json({
        error: 'Name or email is too long.',
      })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING
       RETURNING id, name, email, created_at`,
      [normalizedName, normalizedEmail, passwordHash],
    )

    if (result.rowCount === 0) {
      return res.status(409).json({
        error: 'An account with this email already exists.',
      })
    }

    return res.status(201).json({
      message: 'Account created successfully.',
      user: result.rows[0],
    })
  } catch (error) {
    console.error('Registration failed:', error.message)

    return res.status(500).json({
      error: 'Unable to create account.',
    })
  }
})

export default router
