# Deploy na Vercel - Configuração Completa

## Backend

### 1. Deploy do Backend

1. Acesse: https://vercel.com/new
2. Importe o repositório GitHub
3. Configure o projeto:
   - **Project Name**: `ecommerce-hair-backend`
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: (deixe vazio)
   - **Output Directory**: (deixe vazio)

### 2. Configurar Environment Variables

No projeto Backend, vá em **Settings** → **Environment Variables** e adicione:

```bash
# Supabase
SUPABASE_URL=https://hyivpxxuoschkezzglty.supabase.co
SUPABASE_ANON_KEY=sua-anon-key-aqui
SUPABASE_SERVICE_KEY=sua-service-key-aqui

# CORS - URLs do Frontend e Admin (SEM BARRA NO FINAL)
ALLOWED_ORIGINS=https://ecommerce-hair-frontend.vercel.app,https://ecommerce-hair-admin.vercel.app

# Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

# Node
NODE_ENV=production
```

**IMPORTANTE:**
- Marque todas as variáveis para **Production**, **Preview** e **Development**
- NÃO adicione barra `/` no final das URLs do ALLOWED_ORIGINS
- NÃO adicione espaços depois das vírgulas

### 3. Redeploy

Após adicionar as variáveis:
1. Vá em **Deployments**
2. Clique nos 3 pontos do último deployment
3. **Redeploy**

### 4. Testar

Acesse: `https://seu-backend.vercel.app/health`

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "...",
  "environment": "production",
  "allowedOrigins": [
    "https://ecommerce-hair-frontend.vercel.app",
    "https://ecommerce-hair-admin.vercel.app"
  ]
}
```

---

## Frontend

### 1. Deploy do Frontend

1. Acesse: https://vercel.com/new
2. Importe o MESMO repositório GitHub
3. Configure o projeto:
   - **Project Name**: `ecommerce-hair-frontend`
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2. Configurar Environment Variables

No projeto Frontend, vá em **Settings** → **Environment Variables**:

```bash
# API Backend (URL do deploy acima - COM /api no final)
VITE_API_URL=https://ecommerce-hair-backend.vercel.app/api

# Supabase
VITE_SUPABASE_URL=https://hyivpxxuoschkezzglty.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui

# Site
VITE_SITE_NAME=FabHair
```

**IMPORTANTE:** A URL do backend deve terminar com `/api`

### 3. Redeploy

**IMPORTANTE:** Faça um **Clean Redeploy** para garantir React 18:

1. Vá em **Deployments**
2. Clique nos 3 pontos do último deployment
3. **Redeploy** → Marque **"Clear cache and redeploy"**

---

## Painel Admin

### 1. Deploy do Admin

1. Acesse: https://vercel.com/new
2. Importe o MESMO repositório GitHub
3. Configure o projeto:
   - **Project Name**: `ecommerce-hair-admin`
   - **Framework Preset**: Vite
   - **Root Directory**: `paineladmin`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2. Configurar Environment Variables

```bash
# API Backend (COM /api no final)
VITE_API_URL=https://ecommerce-hair-backend.vercel.app/api

# Supabase
VITE_SUPABASE_URL=https://hyivpxxuoschkezzglty.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

**IMPORTANTE:** A URL do backend deve terminar com `/api`

### 3. Redeploy

**CRÍTICO - Erro React 19:** Faça um **Clean Redeploy** para garantir React 18:

1. Vá em **Deployments**
2. Clique nos 3 pontos (`...`) do último deployment
3. Clique em **Redeploy**
4. ✅ **MARQUE** a opção **"Clear cache and redeploy"**
5. Confirme

Isso força a Vercel a instalar React 18.3.1 (corrige erro `Cannot read properties of null reading 'useState'`)

---

## Atualizar CORS no Backend

Depois de deployar Frontend e Admin, você terá as URLs finais. Se forem diferentes de `ecommerce-hair-frontend.vercel.app`:

1. Volte no projeto **Backend** na Vercel
2. **Settings** → **Environment Variables**
3. Edite `ALLOWED_ORIGINS` com as URLs EXATAS:
   ```
   ALLOWED_ORIGINS=https://url-real-frontend.vercel.app,https://url-real-admin.vercel.app
   ```
4. **Redeploy** o backend

---

## Troubleshooting

### Erro 404 - Rotas não encontradas

**Sintomas:**
```
GET .../categories 404 (Not Found)
GET .../products/featured 404 (Not Found)
```

**Solução:**
A variável `VITE_API_URL` no Frontend/Admin está configurada incorretamente.

**Correto:**
```
VITE_API_URL=https://ecommerce-hair-backend.vercel.app/api
```

**Incorreto:**
```
VITE_API_URL=https://ecommerce-hair-backend.vercel.app
```

Note o `/api` no final! Após corrigir, faça redeploy do Frontend/Admin.

---

### Erro React useState no Admin (MAIS COMUM)

**Sintomas:**
```
Cannot read properties of null (reading 'useState')
TypeError: Cannot read properties of null
```

**Causa:**
Vercel está usando cache com React 19 (incompatível).

**Solução:**
1. Acesse o projeto Admin na Vercel
2. **Deployments** → Clique nos 3 pontos do último deploy
3. **Redeploy** → ✅ **MARQUE "Clear cache and redeploy"**
4. Aguarde novo build completar

Isso força instalação do React 18.3.1.

---

### Erro CORS no Frontend

**Sintomas:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solução:**
1. Acesse `https://seu-backend.vercel.app/health`
2. Verifique se `allowedOrigins` contém a URL exata do seu frontend
3. Certifique-se que não há barra `/` no final
4. Se estiver errado, corrija no Vercel e faça redeploy

### Erro 500 no Backend

**Sintomas:**
```
GET .../categories 500 Internal Server Error
```

**Causas possíveis:**
1. Tabelas não criadas no Supabase
2. Credenciais do Supabase incorretas
3. RLS (Row Level Security) bloqueando acesso

**Solução:**
1. Verifique os logs: Vercel → Backend → Deployments → View Function Logs
2. Confirme que aplicou o schema SQL (ver `SETUP.md`)
3. Verifique as credenciais em Environment Variables

### Build Falha

**Frontend/Admin:**
- Verifique se `Root Directory` está correto
- Certifique-se que `Build Command` é `npm run build`
- Output Directory deve ser `dist`

**Backend:**
- Root Directory: `backend`
- Build Command e Output Directory devem estar VAZIOS

---

## Domínios Customizados (Opcional)

Para usar domínio próprio:

1. Vá em **Settings** → **Domains**
2. Adicione seu domínio (ex: `loja.seudominio.com`)
3. Configure DNS conforme instruções da Vercel
4. Atualize `ALLOWED_ORIGINS` no backend com o novo domínio
5. Redeploy
