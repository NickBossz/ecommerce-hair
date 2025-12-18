# ✅ Migração Supabase → MongoDB Atlas - COMPLETA

## 📋 O que foi feito

### 1. Backend - Completamente reestruturado ✅

**Nova arquitetura serverless (baseada no ibovcontrol project):**
- ✅ `/backend/lib/mongodb.js` - Conexão singleton com MongoDB Atlas
- ✅ `/backend/lib/auth.js` - JWT signing/verification + bcrypt password hashing
- ✅ `/backend/lib/middleware.js` - Middlewares de autenticação (requireAuth, requireAdmin, optionalAuth)
- ✅ `/backend/lib/app.js` - Express app centralizado com todas as rotas
- ✅ `/backend/lib/routes/auth.js` - Endpoints de autenticação (signup, login, logout, me)
- ✅ `/backend/lib/routes/products.js` - CRUD completo de produtos
- ✅ `/backend/lib/routes/categories.js` - CRUD completo de categorias
- ✅ `/backend/lib/routes/wishlists.js` - Gerenciamento de lista de desejos
- ✅ `/backend/lib/routes/settings.js` - Configurações do site
- ✅ `/backend/api/index.js` - Entry point para Vercel serverless
- ✅ `/backend/api/[...path].js` - Catch-all route para Vercel
- ✅ `/backend/vercel.json` - Configuração otimizada do Vercel
- ✅ `/backend/package.json` - Dependências atualizadas (MongoDB, JWT, bcryptjs)
- ✅ `/backend/.env.example` - Template de variáveis de ambiente

**Removido:**
- ❌ `@supabase/supabase-js` removido do package.json
- ❌ Toda lógica de Supabase substituída por MongoDB + JWT

---

### 2. Frontend - Parcialmente atualizado ✅

**Arquivos atualizados:**
- ✅ `/frontend/src/contexts/AuthContext.tsx` - Migrado para usar API REST + JWT
- ✅ `/frontend/src/contexts/SiteSettingsContext.tsx` - Migrado para usar API REST
- ✅ `/frontend/package.json` - Removida dependência do Supabase

**Arquivos de backup criados:**
- 📁 `/frontend/src/contexts/AuthContext_supabase_backup.tsx` - Backup do auth antigo
- 📁 `/frontend/src/contexts/SiteSettingsContext_supabase_backup.tsx` - Backup do settings antigo

**Arquivos que ainda podem ter referências ao Supabase:**
- ⚠️ `/frontend/src/pages/Profile.tsx`
- ⚠️ `/frontend/src/lib/supabase.ts` (pode ser deletado)
- ⚠️ `/frontend/src/services/supabase.js` (pode ser deletado)

---

### 3. Documentação criada ✅

- ✅ `MONGODB_SETUP.md` - Guia completo de configuração do MongoDB Atlas
  - Schema de todas as collections
  - Indexes necessários
  - Scripts de criação de dados iniciais
  - Troubleshooting

---

## 🚀 Próximos passos OBRIGATÓRIOS

### 1. Configurar MongoDB Atlas

1. **Acessar sua conta MongoDB Atlas**
2. **Obter a connection string** do cluster
3. **Criar as seguintes variáveis de ambiente no backend:**

```bash
cd backend
cp .env.example .env
```

Edite o arquivo `.env` e adicione:
```env
MONGODB_URI=mongodb+srv://seu-usuario:sua-senha@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=ecommerce
JWT_SECRET=<gerar-um-secret-seguro>
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

**Gerar JWT_SECRET seguro:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Criar collections e indexes no MongoDB

Siga as instruções em `MONGODB_SETUP.md`, seção "Setup Instructions" → "Create Database and Collections".

Use MongoDB Compass ou mongosh para rodar os scripts de criação de collections e indexes.

### 3. Instalar dependências do backend

```bash
cd backend
npm install
```

### 4. Testar o backend

```bash
cd backend
npm run dev
# Backend rodará em http://localhost:3000
```

Teste os endpoints:
- `GET http://localhost:3000/health` - Deve retornar `{"status": "ok"}`
- `POST http://localhost:3000/auth/signup` - Criar conta de teste

### 5. Atualizar variáveis de ambiente do frontend

```bash
cd frontend
```

Crie ou edite o arquivo `.env`:
```env
VITE_API_URL=http://localhost:3000
```

### 6. Instalar dependências do frontend

```bash
cd frontend
npm install
```

### 7. Testar o frontend

```bash
cd frontend
npm run dev
# Frontend rodará em http://localhost:5173
```

Teste:
1. Criar conta
2. Login
3. Verificar se consegue acessar o perfil

### 8. Atualizar paineladmin (PENDENTE)

O paineladmin ainda precisa ser atualizado de forma similar ao frontend:

**Arquivos que precisam ser atualizados:**
1. `paineladmin/src/contexts/AuthContext.tsx` - Migrar para API REST
2. `paineladmin/src/contexts/SiteSettingsContext.tsx` - Migrar para API REST
3. `paineladmin/package.json` - Remover dependência do Supabase
4. Qualquer página/componente que use Supabase diretamente

**Passos:**
1. Copiar a nova estrutura do AuthContext do frontend para o paineladmin
2. Copiar a nova estrutura do SiteSettingsContext do frontend para o paineladmin
3. Atualizar package.json
4. Criar arquivo `.env` com `VITE_API_URL=http://localhost:3000`
5. Testar

---

## 🔗 Endpoints disponíveis na API

### Autenticação
- `POST /auth/signup` - Criar conta
- `POST /auth/login` - Login
- `GET /auth/me` - Dados do usuário atual (requer auth)
- `POST /auth/logout` - Logout

### Produtos
- `GET /products` - Listar produtos (filtros: category, featured, search, limit, offset)
- `GET /products/:id` - Obter produto específico
- `POST /products` - Criar produto (requer admin)
- `PUT /products/:id` - Atualizar produto (requer admin)
- `DELETE /products/:id` - Deletar produto (requer admin)

### Categorias
- `GET /categories` - Listar categorias
- `GET /categories/:id` - Obter categoria específica
- `POST /categories` - Criar categoria (requer admin)
- `PUT /categories/:id` - Atualizar categoria (requer admin)
- `DELETE /categories/:id` - Deletar categoria (requer admin)

### Wishlist
- `GET /wishlists` - Obter wishlist do usuário (requer auth)
- `POST /wishlists` - Adicionar produto à wishlist (requer auth)
- `DELETE /wishlists/:product_id` - Remover produto da wishlist (requer auth)

### Configurações
- `GET /settings` - Obter todas as configurações do site
- `GET /settings/:key` - Obter configuração específica
- `PUT /settings` - Atualizar configurações (requer admin)

---

## 📁 Estrutura de arquivos

```
ecommerce2/
├── backend/
│   ├── api/
│   │   ├── index.js (Vercel entry point)
│   │   └── [...path].js (Catch-all)
│   ├── lib/
│   │   ├── app.js (Express app)
│   │   ├── mongodb.js (MongoDB connection)
│   │   ├── auth.js (JWT + bcrypt)
│   │   ├── middleware.js (Auth middlewares)
│   │   └── routes/
│   │       ├── auth.js
│   │       ├── products.js
│   │       ├── categories.js
│   │       ├── wishlists.js
│   │       └── settings.js
│   ├── .env.example
│   ├── package.json
│   └── vercel.json
│
├── frontend/
│   ├── src/
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx (✅ Migrado)
│   │   │   └── SiteSettingsContext.tsx (✅ Migrado)
│   │   ├── services/
│   │   │   └── api.js (Axios client)
│   │   └── ...
│   ├── .env
│   └── package.json (✅ Supabase removido)
│
├── paineladmin/ (⚠️ Precisa ser migrado)
│   └── ...
│
├── MONGODB_SETUP.md (✅ Documentação completa)
└── MIGRATION_COMPLETE.md (este arquivo)
```

---

## 🔐 Segurança

### Implementado:
- ✅ Senhas hasheadas com bcrypt (10 salt rounds)
- ✅ JWT tokens com expiração de 7 dias
- ✅ Middlewares de autenticação e autorização
- ✅ CORS configurado para origens permitidas
- ✅ Helmet.js para headers de segurança

### Recomendado adicionar (produção):
- Rate limiting para prevenir brute force
- Refresh tokens
- HTTPS obrigatório
- Logging e monitoring
- Backup automático do MongoDB

---

## 🐛 Troubleshooting

### Backend não inicia
- Verifique se o arquivo `.env` existe no diretório `backend/`
- Verifique se `MONGODB_URI` está configurado corretamente
- Teste a connection string no MongoDB Compass

### Erro 401 "No token provided"
- Limpe o localStorage do navegador: `localStorage.clear()`
- Faça login novamente

### Erro CORS
- Verifique se `FRONTEND_URL` e `ADMIN_URL` estão configurados no backend `.env`
- Em desenvolvimento, deve ser `http://localhost:5173` e `http://localhost:5174`

### MongoDB connection timeout
- Verifique se seu IP está na whitelist do MongoDB Atlas (Network Access)
- Em desenvolvimento, pode adicionar `0.0.0.0/0` (permite todos os IPs)

---

## 📝 Checklist de migração

### Backend
- [x] Criar estrutura `/lib`
- [x] Implementar conexão MongoDB
- [x] Implementar autenticação JWT
- [x] Criar rotas REST
- [x] Atualizar package.json
- [x] Criar .env.example
- [ ] Configurar .env com suas credenciais
- [ ] Testar todos os endpoints

### Frontend
- [x] Migrar AuthContext
- [x] Migrar SiteSettingsContext
- [x] Atualizar package.json
- [ ] Configurar .env com VITE_API_URL
- [ ] Verificar e atualizar componentes que usam Supabase
- [ ] Testar fluxo completo

### Paineladmin
- [ ] Migrar AuthContext
- [ ] Migrar SiteSettingsContext
- [ ] Atualizar package.json
- [ ] Configurar .env
- [ ] Verificar e atualizar componentes que usam Supabase
- [ ] Testar fluxo completo

### MongoDB Atlas
- [ ] Criar collections
- [ ] Criar indexes
- [ ] Inserir dados iniciais (categorias, settings)
- [ ] Criar usuário admin

### Deploy (Produção)
- [ ] Deploy backend no Vercel
- [ ] Configurar env vars no Vercel
- [ ] Deploy frontend
- [ ] Deploy paineladmin
- [ ] Testar em produção

---

## 🎉 Resultado esperado

Após completar todos os passos, você terá:

1. ✅ Backend rodando como serverless functions no Vercel
2. ✅ MongoDB Atlas como banco de dados
3. ✅ Autenticação com JWT (sem Supabase Auth)
4. ✅ Frontend conectado à API REST
5. ✅ Paineladmin conectado à API REST
6. ✅ Todos os dados no MongoDB

---

## 📞 Suporte

- Documentação MongoDB: `MONGODB_SETUP.md`
- Referência do ibovcontrol project: `ibovcontrol project/`
- Verifique os logs do Vercel em desenvolvimento: `npm run dev`
- Use MongoDB Compass para debug do banco

---

**Migração iniciada em:** ${new Date().toISOString()}
**Status:** Backend completo ✅ | Frontend parcial ✅ | Paineladmin pendente ⚠️
