# Criar Perfil Admin para Usuário Existente

## Problema

Quando você fez cadastro, o usuário foi criado no **Supabase Auth** (aba Authentication → Users), mas o perfil NÃO foi criado na tabela **user_profiles**.

Isso causa erro 404 porque o backend busca o perfil e não encontra.

## Solução: Criar Perfil Manualmente

Execute este SQL no **SQL Editor** do Supabase:

### Passo 1: Verificar ID do Usuário

```sql
-- Ver todos os usuários na auth
SELECT id, email, created_at
FROM auth.users
WHERE email = 'admin@gmail.com';
```

Copie o **ID** retornado (algo como `123e4567-e89b-12d3-a456-426614174000`).

### Passo 2: Criar Perfil com Role Admin

```sql
-- Criar perfil admin (substitua o ID pelo ID real do passo 1)
INSERT INTO user_profiles (id, email, full_name, role)
VALUES (
  'cole-o-id-aqui',  -- ID do usuário (do passo 1)
  'admin@gmail.com',
  'Administrador',
  'admin'
);
```

**OU se preferir fazer tudo de uma vez:**

```sql
-- Criar perfil admin automaticamente pegando ID do auth.users
INSERT INTO user_profiles (id, email, full_name, role)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', 'Administrador') as full_name,
  'admin' as role
FROM auth.users
WHERE email = 'admin@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.users.id
);
```

### Passo 3: Verificar

```sql
-- Verificar se perfil foi criado
SELECT id, email, full_name, role, created_at
FROM user_profiles
WHERE email = 'admin@gmail.com';
```

Deve retornar:
```
id: [uuid]
email: admin@gmail.com
full_name: Administrador
role: admin
created_at: [timestamp]
```

## Testar Login

Agora tente fazer login no painel admin:
- URL: https://seu-admin.vercel.app/login
- Email: admin@gmail.com
- Senha: [sua senha]

Deve funcionar! ✅

## Por que isso aconteceu?

Possíveis causas:

1. **Confirmação de email desabilitada tardiamente** - O usuário foi criado antes de desabilitar a confirmação, mas o trigger/código não criou o perfil

2. **Erro no insert do perfil** - O código frontend tentou criar o perfil mas deu erro (verificar console do navegador)

3. **RLS bloqueou** - As políticas RLS podem ter bloqueado o insert

## ⚠️ IMPORTANTE: Prevenir no Futuro

Para garantir que todo usuário no auth tenha perfil automaticamente, execute o arquivo **auto-create-profiles.sql** no SQL Editor do Supabase.

Esse script cria um **trigger automático** que:
- Detecta quando um novo usuário é criado no `auth.users`
- Cria automaticamente o perfil em `user_profiles` com role 'customer'
- Também cria perfis para usuários antigos que não têm

**Como executar:**
1. Acesse: https://supabase.com/dashboard/project/hyivpxxuoschkezzglty/sql/new
2. Copie todo o conteúdo do arquivo `auto-create-profiles.sql`
3. Cole no SQL Editor
4. Clique em **Run**

Agora, sempre que um usuário for criado no Auth, o perfil será criado automaticamente na tabela `user_profiles`!

## Verificar RLS (Row Level Security)

Se o insert não funcionar, verifique as políticas RLS:

```sql
-- Ver políticas da tabela user_profiles
SELECT * FROM pg_policies WHERE tablename = 'user_profiles';
```

Se necessário, adicione política para permitir insert:

```sql
-- Permitir que serviço crie perfis
CREATE POLICY "Permitir insert de perfis via serviço"
ON user_profiles FOR INSERT
TO authenticated, anon
WITH CHECK (true);
```

## Resumo do Fluxo Correto

1. Usuário faz signup
2. Supabase Auth cria usuário em `auth.users`
3. **Trigger automático** cria perfil em `user_profiles` com role 'customer'
4. Admin promove usuário: `UPDATE user_profiles SET role = 'admin' WHERE email = '...'`
5. Usuário faz login no painel admin

---

**Execute o SQL do Passo 2 acima e seu problema estará resolvido!** ✅
