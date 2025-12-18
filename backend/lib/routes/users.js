import express from 'express'
import { ObjectId } from 'mongodb'
import { getCollection } from '../mongodb.js'
import { requireAuth, requireAdmin } from '../middleware.js'

const router = express.Router()

// Helper function to validate ObjectId
function isValidObjectId(id) {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id
}

// GET /users - List all users (admin only)
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await getCollection('users')

    const userList = await users
      .find({}, { projection: { password: 0 } })
      .sort({ created_at: -1 })
      .toArray()

    res.json({ users: userList })
  } catch (error) {
    console.error('List users error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /users/:id - Get single user (admin only)
router.get('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid user ID' })
    }

    const users = await getCollection('users')
    const user = await users.findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0 } }
    )

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PUT /users/:id - Update user (admin only)
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { full_name, role, phone } = req.body

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid user ID' })
    }

    // Validate role
    if (role && !['customer', 'admin', 'superadmin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' })
    }

    const users = await getCollection('users')

    // Build update object
    const updateData = {
      updated_at: new Date()
    }

    if (full_name !== undefined) updateData.full_name = full_name
    if (role !== undefined) updateData.role = role
    if (phone !== undefined) updateData.phone = phone

    const result = await users.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after', projection: { password: 0 } }
    )

    if (!result) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      message: 'User updated successfully',
      user: result
    })
  } catch (error) {
    console.error('Update user error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// DELETE /users/:id - Delete user (admin only)
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid user ID' })
    }

    // Prevent admin from deleting themselves
    if (id === req.user.userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' })
    }

    const users = await getCollection('users')

    const result = await users.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Delete user error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
