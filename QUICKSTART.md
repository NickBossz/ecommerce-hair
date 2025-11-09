# Quick Start - E-commerce FabHair

Guia rápido para colocar o projeto funcionando em minutos.

## 1. Aplicar Schema no Supabase

1. Acesse: https://supabase.com/dashboard/project/hyivpxxuoschkezzglty/editor
2. Clique em **SQL Editor**
3. **New Query**
4. Copie todo conteúdo de `supabase-schema.sql` e cole
5. **Run** (Ctrl+Enter)

## 2. Popular com Dados de Exemplo

**Método mais fácil (Dashboard):**
1. **SQL Editor** → **New Query**
2. Copie todo conteúdo de `seed-data.sql` e cole
3. **Run**

**Método alternativo (Script):**
```bash
# 1. Copiar arquivo de exemplo
cp seed-database.example.js seed-database.js

# 2. Editar seed-database.js e adicionar senha do banco
# Senha está em: Supabase → Settings → Database → Connection string

# 3. Executar
npm run db:seed
```

## 3. Configurar Variáveis de Ambiente

**Backend** (`backend/.env`):
```env
SUPABASE_URL=https://hyivpxxuoschkezzglty.supabase.co
SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_KEY=sua-service-key
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=https://hyivpxxuoschkezzglty.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

**Admin** (`paineladmin/.env`):
```env
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=https://hyivpxxuoschkezzglty.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

## 4. Instalar e Rodar

```bash
# Instalar dependências
npm install

# Rodar em 3 terminais diferentes:

# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend

# Terminal 3 - Admin
npm run dev:admin
```

## 5. Acessar

- **Frontend**: http://localhost:5173
- **Admin**: http://localhost:5174
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

## 6. Criar Usuário Admin

1. Acesse o frontend: http://localhost:5173
2. Cadastre-se com seu email
3. No Supabase Dashboard → **SQL Editor**:

```sql
-- Listar usuários
SELECT id, email FROM auth.users;

-- Promover para admin (use o UUID acima)
UPDATE user_profiles
SET role = 'admin'
WHERE id = 'seu-uuid-aqui';
```

4. Faça logout e login novamente
5. Acesse: http://localhost:5174 (Admin Panel)

## 7. Testar

**Frontend deve mostrar:**
- 8 produtos em destaque na home
- 4 categorias no menu
- Produtos por categoria

**Admin deve permitir:**
- Gerenciar produtos
- Gerenciar categorias
- Ver usuários
- Configurar site

## Produtos Criados pelo Seed

**Shampoos** (3):
- Shampoo Hidratante Profissional (R$ 89,90) ⭐
- Shampoo Anti-Resíduos (R$ 79,90) ⭐
- Shampoo Matizador Platinum (R$ 99,90) ⭐

**Condicionadores** (2):
- Condicionador Nutritivo Intense (R$ 95,90) ⭐
- Condicionador Reconstrutor (R$ 98,90)

**Máscaras** (3):
- Máscara de Hidratação Premium (R$ 129,90) ⭐
- Máscara Reparadora Ultra (R$ 149,90) ⭐
- Máscara Detox Capilar (R$ 118,90)

**Finalizadores** (4):
- Creme de Pentear Cachos Perfeitos (R$ 85,90) ⭐
- Óleo Finalizador Sublime (R$ 95,90)
- Spray Texturizador Volume (R$ 78,90)
- Mousse Modelador Cachos (R$ 88,90)

⭐ = Produto em destaque (aparece na home)

## Troubleshooting

**Erro ao conectar com Supabase:**
- Verifique se as URLs e keys estão corretas nos arquivos .env
- Confirme que aplicou o schema SQL

**Produtos não aparecem:**
- Execute o seed-data.sql no SQL Editor
- Verifique se as tabelas foram criadas

**Erro 404 nas rotas:**
- Certifique-se que VITE_API_URL termina com `/api`
- Reinicie o backend após alterar .env

**Não consigo acessar o Admin:**
- Verifique se promoveu o usuário para 'admin'
- Faça logout e login novamente
