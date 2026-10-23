
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

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required.',
      })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const result = await pool.query(
      `SELECT id, name, email, password_hash
       FROM users
       WHERE email = $1`,
      [normalizedEmail],
    )

    if (result.rowCount === 0) {
      return res.status(401).json({
        error: 'Invalid email or password.',
      })
    }

    const user = result.rows[0]
    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash,
    )

    if (!passwordMatches) {
      return res.status(401).json({
        error: 'Invalid email or password.',
      })
    }

    req.session.regenerate((error) => {
      if (error) {
        console.error('Session creation failed:', error.message)

        return res.status(500).json({
          error: 'Unable to log in.',
        })
      }

      req.session.userId = user.id

      req.session.save((saveError) => {
        if (saveError) {
          console.error('Session save failed:', saveError.message)

          return res.status(500).json({
            error: 'Unable to log in.',
          })
        }

        return res.json({
          message: 'Login successful.',
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        })
      })
    })
  } catch (error) {
    console.error('Login failed:', error.message)

    return res.status(500).json({
      error: 'Unable to log in.',
    })
  }
})

router.get('/me', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        error: 'Not authenticated.',
      })
    }

    const result = await pool.query(
      `SELECT id, name, email, created_at
       FROM users
       WHERE id = $1`,
      [req.session.userId],
    )

    if (result.rowCount === 0) {
      return res.status(401).json({
        error: 'User not found.',
      })
    }

    return res.json({
      user: result.rows[0],
    })
  } catch (error) {
    console.error('Failed to fetch current user:', error.message)

    return res.status(500).json({
      error: 'Unable to fetch current user.',
    })
  }
})

router.post('/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error('Logout failed:', error.message)

      return res.status(500).json({
        error: 'Unable to log out.',
      })
    }

    res.clearCookie('connect.sid', {
      httpOnly: true,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
    })

    return res.json({
      message: 'Logout successful.',
    })
  })
})

export default router
