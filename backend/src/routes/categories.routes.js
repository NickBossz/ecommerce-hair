import express from 'express';
import {
  listCategories,
  getCategoryBySlug,
  getCategoryProducts,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categories.controller.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Rotas públicas
router.get('/', listCategories);
router.get('/:slug', getCategoryBySlug);
router.get('/:id/products', getCategoryProducts);

// Rotas administrativas
router.post('/', authenticate, requireAdmin, createCategory);
router.put('/:id', authenticate, requireAdmin, updateCategory);
router.delete('/:id', authenticate, requireAdmin, deleteCategory);

export default router;
