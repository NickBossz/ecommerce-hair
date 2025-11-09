import express from 'express';
import {
  login,
  loginAdmin,
  register,
  logout,
  verifySession
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Rotas públicas
router.post('/login', login);
router.post('/login/admin', loginAdmin);
router.post('/register', register);
router.post('/logout', logout);

// Rotas protegidas
router.get('/verify', authenticate, verifySession);

export default router;
