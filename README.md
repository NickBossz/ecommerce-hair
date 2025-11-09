# E-commerce Monorepo

Monorepo para plataforma e-commerce com arquitetura desacoplada: REST API, storefront e painel administrativo.

## Stack

**Backend** (`/backend`)
- Express.js 4.18 com ES modules
- Supabase Client 2.39 (PostgreSQL + Auth)
- Helmet, express-rate-limit (segurança)
- Joi (validação)
- Multer (upload multipart/form-data)
- Nodemailer (SMTP)

**Frontend** (`/frontend`)
- React 18 + TypeScript + Vite 5
- React Router 6 (SPA routing)
- TanStack Query 5 (server state)
- Radix UI primitives
- Tailwind CSS 3 + shadcn/ui
- React Hook Form + Zod
- Axios (HTTP client)
- Framer Motion (animações)

**Admin Panel** (`/paineladmin`)
- React 19 + Vite 7
- React Router 7
- TanStack Query 5
- Radix UI + Tailwind CSS 3
- React Dropzone (upload)
- Recharts 3 (visualização)

## Arquitetura

```
├── backend/
│   ├── api/index.js              # Vercel serverless entry
│   └── src/
│       ├── config/               # Supabase client, env vars
│       ├── controllers/          # Auth, Products, Categories
│       ├── middleware/           # JWT verification
│       └── routes/               # Express routes
├── frontend/
│   └── src/
│       ├── components/           # UI components
│       ├── contexts/             # Auth, SiteSettings
│       ├── pages/                # Shop, ProductDetail, Profile, Wishlist
│       └── services/             # API layer, Supabase client
└── paineladmin/
    └── src/
        ├── components/           # AdminLayout, ProtectedRoute
        ├── contexts/             # AuthContext
        └── pages/                # Dashboard, Products, Categories, Users, SiteSettings
```

## Setup

```bash
# Instalar dependências de todos os workspaces
npm install

# Configurar variáveis de ambiente
cp .env.example backend/.env
cp .env.example frontend/.env
cp .env.example paineladmin/.env
# Editar arquivos .env com credenciais Supabase

# Popular banco com dados de exemplo (opcional)
npm run db:seed

# Desenvolvimento
npm run dev:backend    # Express server :3000
npm run dev:frontend   # Vite dev server :5173
npm run dev:admin      # Vite dev server :5174

# Build
npm run build          # Build all workspaces
```

### Seed Database

O comando `npm run db:seed` insere dados de exemplo:
- 4 categorias de produtos
- 12 produtos (shampoos, condicionadores, máscaras, finalizadores)
- Imagens de produtos
- 8 produtos marcados como destaque

**Nota:** Configure a senha do banco em `seed-database.js` antes de executar.

## API Endpoints

**Auth**: `POST /api/auth/register`, `POST /api/auth/login`
**Products**: `GET /api/products`, `GET /api/products/:id`, `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`
**Categories**: `GET /api/categories`, `POST /api/categories`, `PUT /api/categories/:id`, `DELETE /api/categories/:id`

## Environment Variables

**Backend**:
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`
- `ALLOWED_ORIGINS` (CORS)
- `MAX_FILE_SIZE`, `ALLOWED_FILE_TYPES`

**Frontend/Admin**:
- `VITE_API_URL`
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## Deploy

Vercel (serverless functions para backend, static hosting para frontends)
