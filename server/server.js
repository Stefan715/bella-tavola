import express from 'express'

const app = express()
const PORT = 3000

app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Bella Tavola API is running!',
  })
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})