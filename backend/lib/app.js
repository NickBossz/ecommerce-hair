import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import authRoutes from './routes/auth.js'
import productsRoutes from './routes/products.js'
import categoriesRoutes from './routes/categories.js'
import wishlistsRoutes from './routes/wishlists.js'
import settingsRoutes from './routes/settings.js'

const app = express()

// Trust proxy - necessary because Vercel puts the app behind a reverse proxy
app.set('trust proxy', 1)

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}))

// CORS - allow dynamic origin
app.use(cors({
  origin: (origin, callback) => {
    // In development, allow localhost
    // In production, allow Vercel domain
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:8080',
      process.env.FRONTEND_URL,
      process.env.ADMIN_URL,
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
    ].filter(Boolean)

    if (!origin || allowedOrigins.some(allowed => origin.includes(allowed.replace('https://', '').replace('http://', '')))) {
      callback(null, true)
    } else {
      callback(null, true) // Allow all in development
    }
  },
  credentials: true
}))

// Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Middleware to remove /api/ from path when coming from Vercel
app.use((req, res, next) => {
  // Vercel passes URLs as /api/... but we need to route without /api
  if (req.url.startsWith('/api/')) {
    req.url = req.url.replace('/api', '')
  }
  next()
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/auth', authRoutes)
app.use('/products', productsRoutes)
app.use('/categories', categoriesRoutes)
app.use('/wishlists', wishlistsRoutes)
app.use('/settings', settingsRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  })
})

export default app
