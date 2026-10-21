import { pool } from './db.js'

try {
  const result = await pool.query('SELECT NOW() AS current_time')

  console.log('Database connection successful!')
  console.log('Database time:', result.rows[0].current_time)
} catch (error) {
  console.error('Database connection failed!')
  console.error('Error name:', error.name)
  console.error('Error message:', error.message)
  console.error('Error code:', error.code)
} finally {
  await pool.end()
}