import express from 'express'
import { getCollection } from '../mongodb.js'
import { requireAuth, requireAdmin } from '../middleware.js'

const router = express.Router()

// GET /settings - Get all settings (public)
router.get('/', async (req, res) => {
  try {
    const settings = await getCollection('site_settings')
    const allSettings = await settings.find({}).toArray()

    // Convert array to object
    const settingsObject = {}
    allSettings.forEach(item => {
      settingsObject[item.key] = item.value
    })

    res.json(settingsObject)
  } catch (error) {
    console.error('Get settings error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /settings/:key - Get specific setting
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params
    const settings = await getCollection('site_settings')

    const setting = await settings.findOne({ key })

    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' })
    }

    res.json({ [key]: setting.value })
  } catch (error) {
    console.error('Get setting error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PUT /settings - Update settings (admin only)
router.put('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const updates = req.body
    const settings = await getCollection('site_settings')

    // Update each setting
    const operations = Object.entries(updates).map(([key, value]) => ({
      updateOne: {
        filter: { key },
        update: {
          $set: {
            value,
            updated_at: new Date()
          }
        },
        upsert: true
      }
    }))

    if (operations.length > 0) {
      await settings.bulkWrite(operations)
    }

    res.json({ message: 'Settings updated successfully' })
  } catch (error) {
    console.error('Update settings error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
