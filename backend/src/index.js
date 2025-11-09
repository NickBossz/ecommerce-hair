import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/env.js';
import { testConnection } from './config/database.js';

// Importar rotas
import productsRoutes from './routes/products.routes.js';
import categoriesRoutes from './routes/categories.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

// Middlewares de segurança
app.use(helmet());
app.use(cors({
  origin: config.cors.allowedOrigins,
  credentials: true
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
    environment: config.nodeEnv
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
// app.use('/api/cart', cartRoutes); // TODO: implementar
// app.use('/api/orders', ordersRoutes); // TODO: implementar
// app.use('/api/admin', adminRoutes); // TODO: implementar

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
    ...(config.nodeEnv === 'development' && { stack: err.stack })
  });
});

// Iniciar servidor (apenas em desenvolvimento local)
const startServer = async () => {
  try {
    // Testar conexão com banco
    console.log('🔄 Testando conexão com Supabase...');
    // await testConnection();

    // Iniciar servidor
    app.listen(config.port, () => {
      console.log(`🚀 Servidor rodando na porta ${config.port}`);
      console.log(`📦 Ambiente: ${config.nodeEnv}`);
      console.log(`🌐 URL: http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Iniciar servidor apenas em desenvolvimento local
// Em produção (Vercel), o app é exportado como serverless function
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  startServer();
}

// Exportar app para Vercel
export default app;
