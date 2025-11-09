# Corrigir Erro 404 no Login Admin

## Erro que aparece:

```
POST https://ecommerce-hair-backend.vercel.app/api/auth/login/admin
404 (Not Found)
```

## Causa:

A rota `/api/auth/login/admin` existe no código, mas a Vercel pode estar com cache desatualizado ou o deploy não pegou as rotas de auth corretamente.

## Solução:

### 1. Fazer Redeploy do Backend na Vercel

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto: **ecommerce-hair-backend**
3. Vá em **Deployments**
4. Clique nos 3 pontos (`...`) do último deployment
5. Clique em **Redeploy**
6. ✅ **MARQUE**: `"Clear cache and redeploy"`
7. Aguarde o build completar

### 2. Testar a Rota

Depois do redeploy, teste:

```bash
curl -X POST https://ecommerce-hair-backend.vercel.app/api/auth/login/admin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"sua-senha"}'
```

Deve retornar:
- **200 OK** se credenciais corretas e usuário é admin
- **401** se senha errada
- **403** se usuário não é admin
- **404** se perfil não existe

### 3. Promover Usuário para Admin

Se o usuário `admin@gmail.com` ainda não é admin, execute no **SQL Editor** do Supabase:

```sql
-- Promover para admin
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'admin@gmail.com';

-- Verificar
SELECT email, role FROM user_profiles WHERE email = 'admin@gmail.com';
```

### 4. Verificar Environment Variables

Certifique-se que o backend na Vercel tem as variáveis:

```bash
SUPABASE_URL=https://hyivpxxuoschkezzglty.supabase.co
SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_KEY=sua-service-key
ALLOWED_ORIGINS=https://seu-frontend.vercel.app,https://seu-admin.vercel.app
NODE_ENV=production
```

### 5. Testar Health Check

```bash
curl https://ecommerce-hair-backend.vercel.app/health
```

Deve mostrar as origens permitidas:
```json
{
  "status": "ok",
  "allowedOrigins": ["https://..."]
}
```

## Como Funciona o Login Admin

A rota `/api/auth/login/admin` faz:

1. Autentica com Supabase Auth
2. Busca o perfil do usuário
3. **Verifica se role é 'admin' ou 'superadmin'**
4. Se não for admin, retorna 403
5. Se for admin, retorna token de sessão

## Troubleshooting

### Ainda dá 404 após redeploy?

Verifique os logs do deployment:
1. Vercel → Backend → Deployments
2. Clique no deployment mais recente
3. Veja **Build Logs** e **Function Logs**

### Dá 403 (Acesso negado)?

O usuário não é admin. Execute o SQL acima para promover.

### Dá 401 (Credenciais inválidas)?

Email ou senha incorretos. Verifique:
```sql
SELECT email FROM auth.users WHERE email = 'admin@gmail.com';
```

Se não existir, crie o usuário primeiro no frontend (http://seu-site.vercel.app/login).

### Como criar primeiro admin?

1. Faça signup normalmente como usuário comum
2. Anote o email usado
3. Execute SQL para promover:
   ```sql
   UPDATE user_profiles SET role = 'admin' WHERE email = 'seu-email@example.com';
   ```
4. Faça login no painel admin

## Estrutura de Roles

O sistema suporta:
- `customer` - Usuário comum (padrão no signup)
- `admin` - Administrador (pode acessar painel admin)
- `superadmin` - Super administrador (futuro)

Ambos `admin` e `superadmin` podem fazer login no painel admin.
