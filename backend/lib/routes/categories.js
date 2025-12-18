import express from 'express'
import { ObjectId } from 'mongodb'
import { getCollection } from '../mongodb.js'
import { requireAuth, requireAdmin, optionalAuth } from '../middleware.js'

const router = express.Router()

// GET /categories - List categories
router.get('/', optionalAuth, async (req, res) => {
  try {
    const categories = await getCollection('categories')

    const query = {}

    // Only show active categories to non-admin users
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) {
      query.is_active = true
    }

    const categoriesList = await categories
      .find(query)
      .sort({ display_order: 1, name: 1 })
      .toArray()

    res.json(categoriesList)
  } catch (error) {
    console.error('List categories error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /categories/:id - Get single category
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const categories = await getCollection('categories')

    const category = await categories.findOne({ _id: new ObjectId(id) })

    if (!category) {
      return res.status(404).json({ error: 'Category not found' })
    }

    res.json(category)
  } catch (error) {
    console.error('Get category error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /categories - Create category (admin only)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, slug, description, parent_id, display_order, is_active } = req.body

    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug are required' })
    }

    const categories = await getCollection('categories')

    // Check if slug already exists
    const existing = await categories.findOne({ slug })
    if (existing) {
      return res.status(400).json({ error: 'Slug already exists' })
    }

    const newCategory = {
      name,
      slug,
      description: description || null,
      parent_id: parent_id ? new ObjectId(parent_id) : null,
      display_order: display_order || 0,
      is_active: is_active !== false,
      created_at: new Date(),
      updated_at: new Date()
    }

    const result = await categories.insertOne(newCategory)

    res.status(201).json({
      id: result.insertedId,
      ...newCategory
    })
  } catch (error) {
    console.error('Create category error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PUT /categories/:id - Update category (admin only)
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    const categories = await getCollection('categories')

    const updateData = {
      ...updates,
      updated_at: new Date()
    }

    if (updateData.parent_id) {
      updateData.parent_id = new ObjectId(updateData.parent_id)
    }

    delete updateData._id

    const result = await categories.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Category not found' })
    }

    res.json({ message: 'Category updated successfully' })
  } catch (error) {
    console.error('Update category error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// DELETE /categories/:id - Delete category (admin only)
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const categories = await getCollection('categories')

    const result = await categories.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Category not found' })
    }

    res.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Delete category error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
