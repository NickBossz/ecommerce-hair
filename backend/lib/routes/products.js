import express from 'express'
import { ObjectId } from 'mongodb'
import { getCollection } from '../mongodb.js'
import { requireAuth, requireAdmin, optionalAuth } from '../middleware.js'

const router = express.Router()

// Helper function to validate ObjectId
function isValidObjectId(id) {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id
}

// GET /products - List products (public)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, featured, search, limit = 20, offset = 0 } = req.query
    const products = await getCollection('products')

    const query = {}

    // Only show active products to non-admin users
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) {
      query.is_active = true
    }

    if (category) {
      query.category_id = new ObjectId(category)
    }

    if (featured === 'true') {
      query.is_featured = true
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    const productsList = await products
      .find(query)
      .sort({ created_at: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .toArray()

    // Get product images and categories
    const productImages = await getCollection('product_images')
    const categories = await getCollection('categories')

    const enrichedProducts = await Promise.all(
      productsList.map(async (product) => {
        const images = await productImages
          .find({ product_id: product._id })
          .sort({ display_order: 1 })
          .toArray()

        const category = product.category_id
          ? await categories.findOne({ _id: product.category_id })
          : null

        return {
          ...product,
          images,
          category: category ? {
            id: category._id,
            name: category.name,
            slug: category.slug
          } : null
        }
      })
    )

    const total = await products.countDocuments(query)

    res.json({
      products: enrichedProducts,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    })
  } catch (error) {
    console.error('List products error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /products/slug/:slug - Get product by slug
router.get('/slug/:slug', optionalAuth, async (req, res) => {
  try {
    const { slug } = req.params

    const products = await getCollection('products')
    const query = { slug }

    // Only show active products to non-admin users
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) {
      query.is_active = true
    }

    const product = await products.findOne(query)

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    // Get images
    const productImages = await getCollection('product_images')
    const images = await productImages
      .find({ product_id: product._id })
      .sort({ display_order: 1 })
      .toArray()

    // Get category
    const categories = await getCollection('categories')
    const category = product.category_id
      ? await categories.findOne({ _id: product.category_id })
      : null

    res.json({
      product: {
        ...product,
        id: product._id,
        images: images.map(img => ({
          ...img,
          id: img._id
        })),
        category: category ? {
          id: category._id,
          name: category.name,
          slug: category.slug
        } : null
      }
    })
  } catch (error) {
    console.error('Get product by slug error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /products/:id - Get single product
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid product ID' })
    }

    const products = await getCollection('products')
    const query = { _id: new ObjectId(id) }

    // Only show active products to non-admin users
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'superadmin')) {
      query.is_active = true
    }

    const product = await products.findOne(query)

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    // Get images
    const productImages = await getCollection('product_images')
    const images = await productImages
      .find({ product_id: product._id })
      .sort({ display_order: 1 })
      .toArray()

    // Get category
    const categories = await getCollection('categories')
    const category = product.category_id
      ? await categories.findOne({ _id: product.category_id })
      : null

    res.json({
      ...product,
      images,
      category: category ? {
        id: category._id,
        name: category.name,
        slug: category.slug
      } : null
    })
  } catch (error) {
    console.error('Get product error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /products - Create product (admin only)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      short_description,
      price,
      compare_at_price,
      stock_quantity,
      category_id,
      is_featured,
      is_active,
      images
    } = req.body

    if (!name || !slug || !description || price === undefined) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const products = await getCollection('products')

    // Check if slug already exists
    const existing = await products.findOne({ slug })
    if (existing) {
      return res.status(400).json({ error: 'Slug already exists' })
    }

    const newProduct = {
      name,
      slug,
      description,
      short_description: short_description || null,
      price: parseFloat(price),
      compare_at_price: compare_at_price ? parseFloat(compare_at_price) : null,
      stock_quantity: parseInt(stock_quantity) || 0,
      category_id: category_id ? new ObjectId(category_id) : null,
      is_featured: is_featured || false,
      is_active: is_active !== false,
      created_by: new ObjectId(req.user.userId),
      created_at: new Date(),
      updated_at: new Date()
    }

    const result = await products.insertOne(newProduct)

    // Add images if provided
    if (images && images.length > 0) {
      const productImages = await getCollection('product_images')
      const imageDocuments = images.map((img, index) => ({
        product_id: result.insertedId,
        image_url: img.image_url || img.url,
        alt_text: img.alt_text || img.alt || name,
        is_primary: img.is_primary !== undefined ? img.is_primary : index === 0,
        display_order: img.display_order !== undefined ? img.display_order : index,
        created_at: new Date()
      }))
      await productImages.insertMany(imageDocuments)
    }

    res.status(201).json({
      id: result.insertedId,
      ...newProduct
    })
  } catch (error) {
    console.error('Create product error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PUT /products/:id - Update product (admin only)
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid product ID' })
    }

    const { images, ...updates } = req.body
    const products = await getCollection('products')

    const updateData = {
      ...updates,
      updated_at: new Date()
    }

    // Convert IDs if needed
    if (updateData.category_id) {
      updateData.category_id = new ObjectId(updateData.category_id)
    }

    // Remove _id from updates
    delete updateData._id

    const result = await products.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }

    // Update images if provided
    if (images && images.length > 0) {
      const productImages = await getCollection('product_images')

      // Delete old images
      await productImages.deleteMany({ product_id: new ObjectId(id) })

      // Insert new images
      const imageDocuments = images.map((img, index) => ({
        product_id: new ObjectId(id),
        image_url: img.image_url || img.url,
        alt_text: img.alt_text || img.alt || updateData.name || '',
        is_primary: img.is_primary !== undefined ? img.is_primary : index === 0,
        display_order: img.display_order !== undefined ? img.display_order : index,
        created_at: new Date()
      }))
      await productImages.insertMany(imageDocuments)
    }

    res.json({ message: 'Product updated successfully' })
  } catch (error) {
    console.error('Update product error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// DELETE /products/:id - Delete product (admin only)
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid product ID' })
    }

    const products = await getCollection('products')

    const result = await products.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }

    // Delete associated images
    const productImages = await getCollection('product_images')
    await productImages.deleteMany({ product_id: new ObjectId(id) })

    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Delete product error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
