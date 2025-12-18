import express from 'express'
import { ObjectId } from 'mongodb'
import { getCollection } from '../mongodb.js'
import { requireAuth } from '../middleware.js'

const router = express.Router()

// GET /wishlists - Get user's wishlist
router.get('/', requireAuth, async (req, res) => {
  try {
    const wishlists = await getCollection('wishlists')
    const products = await getCollection('products')

    const wishlistItems = await wishlists
      .find({ user_id: new ObjectId(req.user.userId) })
      .toArray()

    // Get product details for each wishlist item
    const enrichedWishlist = await Promise.all(
      wishlistItems.map(async (item) => {
        const product = await products.findOne({ _id: item.product_id })
        return {
          id: item._id,
          product,
          added_at: item.added_at
        }
      })
    )

    res.json(enrichedWishlist)
  } catch (error) {
    console.error('Get wishlist error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /wishlists - Add product to wishlist
router.post('/', requireAuth, async (req, res) => {
  try {
    const { product_id } = req.body

    if (!product_id) {
      return res.status(400).json({ error: 'Product ID is required' })
    }

    const wishlists = await getCollection('wishlists')

    // Check if already in wishlist
    const existing = await wishlists.findOne({
      user_id: new ObjectId(req.user.userId),
      product_id: new ObjectId(product_id)
    })

    if (existing) {
      return res.status(400).json({ error: 'Product already in wishlist' })
    }

    const newWishlistItem = {
      user_id: new ObjectId(req.user.userId),
      product_id: new ObjectId(product_id),
      added_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    }

    const result = await wishlists.insertOne(newWishlistItem)

    res.status(201).json({
      id: result.insertedId,
      ...newWishlistItem
    })
  } catch (error) {
    console.error('Add to wishlist error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// DELETE /wishlists/:product_id - Remove product from wishlist
router.delete('/:product_id', requireAuth, async (req, res) => {
  try {
    const { product_id } = req.params
    const wishlists = await getCollection('wishlists')

    const result = await wishlists.deleteOne({
      user_id: new ObjectId(req.user.userId),
      product_id: new ObjectId(product_id)
    })

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Product not in wishlist' })
    }

    res.json({ message: 'Product removed from wishlist' })
  } catch (error) {
    console.error('Remove from wishlist error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
