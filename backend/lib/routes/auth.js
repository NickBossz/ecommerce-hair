import express from 'express'
import { ObjectId } from 'mongodb'
import { getCollection } from '../mongodb.js'
import { signToken, hashPassword, comparePassword } from '../auth.js'
import { requireAuth } from '../middleware.js'

const router = express.Router()

// POST /auth/signup - Criar nova conta
router.post('/signup', async (req, res) => {
  try {
    const { email, password, full_name, phone } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const users = await getCollection('users')

    // Check if user already exists
    const existingUser = await users.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const newUser = {
      email: email.toLowerCase(),
      password: hashedPassword,
      full_name: full_name || null,
      phone: phone || null,
      avatar_url: null,
      role: 'customer',
      created_at: new Date(),
      updated_at: new Date()
    }

    const result = await users.insertOne(newUser)

    // Generate JWT
    const token = signToken({
      userId: result.insertedId.toString(),
      email: newUser.email,
      role: newUser.role
    })

    res.status(201).json({
      user: {
        id: result.insertedId,
        email: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role
      },
      token
    })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /auth/login - Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const users = await getCollection('users')

    // Find user
    const user = await users.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Update last sign in
    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          last_sign_in_at: new Date(),
          updated_at: new Date()
        }
      }
    )

    // Generate JWT
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    })

    res.json({
      user: {
        id: user._id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        avatar_url: user.avatar_url,
        role: user.role
      },
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /auth/me - Get current user
router.get('/me', requireAuth, async (req, res) => {
  try {
    const users = await getCollection('users')
    const user = await users.findOne(
      { _id: new ObjectId(req.user.userId) },
      { projection: { password: 0 } }
    )

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      id: user._id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      avatar_url: user.avatar_url,
      role: user.role,
      created_at: user.created_at
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /auth/logout - Logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' })
})

export default router
