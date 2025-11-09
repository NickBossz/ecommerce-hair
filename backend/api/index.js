// Entry point para Vercel Serverless Functions
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Importar rotas
import productsRoutes from '../src/routes/products.routes.js';
import categoriesRoutes from '../src/routes/categories.routes.js';
import authRoutes from '../src/routes/auth.routes.js';

const app = express();

// Configuração CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:8080'];

console.log('🌐 CORS - Allowed Origins:', allowedOrigins);

// Middlewares de segurança
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Configurar CORS com função para debug
app.use(cors({
  origin: function (origin, callback) {
    // Permitir requisições sem origin (como Postman, curl, mobile apps)
    if (!origin) return callback(null, true);

    // Verificar se a origin está na lista permitida
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      console.log('❌ CORS bloqueado para origem:', origin);
      console.log('✅ Origens permitidas:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100, // limite de 100 requisições por minuto
  message: 'Muitas requisições deste IP, tente novamente mais tarde.'
});
app.use('/api/', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    allowedOrigins: allowedOrigins
  });
});

// Rota principal
app.get('/', (req, res) => {
  res.json({
    message: 'FabHair API',
    version: '1.0.0',
    documentation: '/api/docs'
  });
});

// Rotas da API
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/auth', authRoutes);

// Rota 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Erro:', err);

  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;
