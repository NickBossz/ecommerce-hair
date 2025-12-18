# 🚀 Quick Start - Setup em 5 Minutos

## 1️⃣ Backend - Configurar .env

```bash
cd backend
cp .env.example .env
```

Edite o arquivo `.env` e preencha apenas 2 variáveis obrigatórias:

```env
MONGODB_URI=sua-connection-string-aqui
JWT_SECRET=seu-jwt-secret-aqui
```

### Como obter cada valor:

**MONGODB_URI:**
1. Acesse [MongoDB Atlas](https://cloud.mongodb.com/)
2. Clique em "Connect" no seu cluster
3. Escolha "Connect your application"
4. Copie a connection string
5. Substitua `<password>` pela senha do seu usuário

**JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 2️⃣ Instalar Dependências

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Paineladmin
cd ../paineladmin
npm install
```

---

## 3️⃣ Criar Collections no MongoDB

### Opção A: Via MongoDB Compass (Recomendado)

1. Abra MongoDB Compass
2. Conecte usando sua `MONGODB_URI`
3. Crie um database chamado `ecommerce`
4. Crie as seguintes collections:
   - `users`
   - `products`
   - `product_images`
   - `categories`
   - `wishlists`
   - `site_settings`
   - `orders`
   - `order_items`

5. Execute os comandos de índices do arquivo `MONGODB_SETUP.md` (seção "Create Indexes")

### Opção B: Via mongosh (CLI)

```bash
mongosh "sua-connection-string"
```

```javascript
use ecommerce

// Criar collections
db.createCollection("users")
db.createCollection("categories")
db.createCollection("products")
db.createCollection("product_images")
db.createCollection("wishlists")
db.createCollection("site_settings")
db.createCollection("orders")
db.createCollection("order_items")

// Criar indexes (copie os comandos do MONGODB_SETUP.md)
```

---

## 4️⃣ Popular Dados Iniciais

Execute no MongoDB Compass ou mongosh:

```javascript
// Categorias padrão
db.categories.insertMany([
  {
    name: "Shampoos",
    slug: "shampoos",
    description: "Shampoos profissionais",
    parent_id: null,
    display_order: 0,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: "Condicionadores",
    slug: "condicionadores",
    description: "Condicionadores hidratantes",
    parent_id: null,
    display_order: 1,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: "Máscaras",
    slug: "mascaras",
    description: "Tratamentos intensivos",
    parent_id: null,
    display_order: 2,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: "Finalizadores",
    slug: "finalizadores",
    description: "Produtos para finalização",
    parent_id: null,
    display_order: 3,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  }
])

// Configurações do site
db.site_settings.insertMany([
  { key: "site_name", value: "FabHair", updated_at: new Date() },
  { key: "site_description", value: "Loja de produtos capilares", updated_at: new Date() },
  { key: "contact_email", value: "contato@fabhair.com", updated_at: new Date() },
  { key: "contact_phone", value: "(11) 99999-9999", updated_at: new Date() },
  { key: "whatsapp", value: "5511999999999", updated_at: new Date() },
  { key: "address_street", value: "", updated_at: new Date() },
  { key: "address_neighborhood", value: "", updated_at: new Date() },
  { key: "address_city", value: "", updated_at: new Date() },
  { key: "address_state", value: "", updated_at: new Date() },
  { key: "address_zipcode", value: "", updated_at: new Date() },
  { key: "business_hours", value: "Seg-Sex: 9h-18h", updated_at: new Date() },
  { key: "maps_link", value: "", updated_at: new Date() },
  { key: "instagram", value: "", updated_at: new Date() },
  { key: "facebook", value: "", updated_at: new Date() },
  { key: "tiktok", value: "", updated_at: new Date() },
  { key: "youtube", value: "", updated_at: new Date() }
])
```

---

## 5️⃣ Rodar o Projeto

### Desenvolvimento Local

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
```
✅ Backend rodando em http://localhost:3000

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```
✅ Frontend rodando em http://localhost:5173

**Paineladmin (Terminal 3):**
```bash
cd paineladmin
npm run dev
```
✅ Admin rodando em http://localhost:5174

---

## 6️⃣ Testar

### Teste 1: Backend Funcionando
```bash
curl http://localhost:3000/health
```
Deve retornar: `{"status":"ok","timestamp":"..."}`

### Teste 2: Criar Primeira Conta
1. Acesse http://localhost:5173
2. Clique em "Criar conta"
3. Preencha os dados
4. Faça login

### Teste 3: Verificar no MongoDB
1. Abra MongoDB Compass
2. Vá em `ecommerce` → `users`
3. Você verá o usuário criado (com senha hasheada)

---

## ✅ Pronto!

Seu e-commerce está rodando com:
- ✅ MongoDB Atlas
- ✅ Autenticação JWT
- ✅ Backend serverless pronto para Vercel
- ✅ Frontend funcionando
- ✅ Paineladmin funcionando

---

## 🔥 Próximos Passos

1. **Criar usuário admin:**
   ```javascript
   // No MongoDB Compass ou mongosh
   use ecommerce

   // Encontre o ID do seu usuário
   db.users.findOne({ email: "seu-email@exemplo.com" })

   // Promova para admin
   db.users.updateOne(
     { email: "seu-email@exemplo.com" },
     { $set: { role: "admin" } }
   )
   ```

2. **Deploy:**
   - Backend: `cd backend && vercel`
   - Frontend: `cd frontend && vercel`
   - Paineladmin: `cd paineladmin && vercel`

3. **Configurar variáveis no Vercel:**
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `MONGODB_DB=ecommerce`
   - `NODE_ENV=production`

---

## 🆘 Problemas?

| Problema | Solução |
|----------|---------|
| Backend não inicia | Verifique se `.env` existe e tem `MONGODB_URI` e `JWT_SECRET` |
| Erro de conexão MongoDB | Verifique se seu IP está na whitelist do MongoDB Atlas |
| Erro 401 no frontend | Limpe localStorage: `localStorage.clear()` e faça login novamente |
| CORS error | Verifique se backend está rodando em `localhost:3000` |

---

📚 **Documentação completa:** `MONGODB_SETUP.md` e `MIGRATION_COMPLETE.md`
