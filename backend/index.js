// Vercel serverless entry point
import express from 'express'
import app from './lib/app.js'

// Export as serverless function handler
export default (req, res) => {
  return app(req, res)
}
