# Setup Completo do Banco de Dados

Execute estes passos **na ordem** para configurar o banco de dados do zero.

## 1. Criar Schema (Tabelas)

Execute o arquivo `supabase-schema.sql` no SQL Editor:

1. Acesse: https://supabase.com/dashboard/project/hyivpxxuoschkezzglty/sql/new
2. Copie todo o conteúdo de `supabase-schema.sql`
3. Cole e clique em **Run**

Isso cria:
- ✅ Tabela `user_profiles`
- ✅ Tabela `categories`
- ✅ Tabela `products`
- ✅ Tabela `product_images`
- ✅ Tabela `orders`
- ✅ Tabela `order_items`
- ✅ Tabela `wishlists`
- ✅ Tabela `site_settings`
- ✅ Políticas RLS
- ✅ Indexes
- ✅ Views

## 2. Configurar Trigger de Auto-Criação de Perfis

Execute o arquivo `auto-create-profiles.sql`:

1. Acesse: https://supabase.com/dashboard/project/hyivpxxuoschkezzglty/sql/new
2. Copie todo o conteúdo de `auto-create-profiles.sql`
3. Cole e clique em **Run**

Isso garante que:
- ✅ Todo novo usuário terá perfil criado automaticamente
- ✅ Usuários antigos sem perfil serão corrigidos

## 3. Adicionar Dados de Exemplo (Opcional)

Execute o arquivo `seed-data.sql`:

1. Acesse: https://supabase.com/dashboard/project/hyivpxxuoschkezzglty/sql/new
2. Copie todo o conteúdo de `seed-data.sql`
3. Cole e clique em **Run**

Isso adiciona:
- ✅ 4 categorias (Shampoos, Condicionadores, Máscaras, Finalizadores)
- ✅ 12 produtos de exemplo com preços e descrições
- ✅ Produtos marcados como featured

## 4. Configurar Autenticação

Siga as instruções do arquivo `SUPABASE-CONFIG.md`:

**Para desenvolvimento:**
1. Acesse: https://supabase.com/dashboard/project/hyivpxxuoschkezzglty/auth/providers
2. Clique em **Email**
3. **Desmarque**: "Enable email confirmations"
4. Salve

**Para produção:**
Configure SMTP (instruções completas em `SUPABASE-CONFIG.md`)

## 5. Criar Primeiro Admin

### 5.1. Fazer Signup

1. Acesse seu site: http://localhost:5173/login (ou URL da Vercel)
2. Clique em "Cadastrar"
3. Preencha:
   - Email: admin@gmail.com (ou seu email)
   - Senha: sua senha segura
   - Nome: Administrador
4. Criar conta

### 5.2. Promover para Admin

Execute este SQL:

```sql
-- Promover para admin
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'admin@gmail.com';

-- Verificar
SELECT email, role FROM user_profiles WHERE email = 'admin@gmail.com';
```

### 5.3. Fazer Login no Painel Admin

1. Acesse: http://localhost:5174/login (ou URL da Vercel)
2. Login com admin@gmail.com
3. ✅ Pronto!

## Verificar Setup

Execute este SQL para verificar se tudo está configurado:

```sql
-- Verificar tabelas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Verificar trigger
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Verificar categorias
SELECT COUNT(*) as total_categorias FROM categories;

-- Verificar produtos
SELECT COUNT(*) as total_produtos FROM products;

-- Verificar admins
SELECT email, role FROM user_profiles WHERE role = 'admin';
```

Resultado esperado:
```
Tabelas: categories, orders, order_items, product_images, products, site_settings, user_profiles, wishlists
Trigger: on_auth_user_created em auth.users
Categorias: 4 (se executou seed-data.sql)
Produtos: 12 (se executou seed-data.sql)
Admins: 1+ (seus admins)
```

## Troubleshooting

### Erro 404 no login admin?
- Usuário existe no auth mas não tem perfil
- Solução: `CREATE-ADMIN-PROFILE.md`

### Erro 400 no signup?
- Email confirmation ativada mas não configurada
- Solução: `SUPABASE-CONFIG.md`

### Tabelas não aparecem?
- Schema não foi aplicado
- Volte ao Passo 1

### Trigger não funciona?
- Execute novamente `auto-create-profiles.sql`
- Verifique com: `SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';`

## Ordem de Execução (Resumo)

1. ✅ `supabase-schema.sql` - Cria tabelas
2. ✅ `auto-create-profiles.sql` - Configura trigger
3. ✅ `seed-data.sql` - Adiciona dados (opcional)
4. ✅ Configurar auth (desabilitar email confirmation)
5. ✅ Fazer signup de admin
6. ✅ Promover para admin via SQL
7. ✅ Login no painel admin

---

**Executou tudo? Seu banco de dados está pronto!** 🎉
