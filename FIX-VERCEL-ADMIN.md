# Corrigir Erro useState no Admin Vercel

## Erro que aparece:

```
Uncaught TypeError: Cannot read properties of null (reading 'useState')
```

## Causa:

A Vercel está usando cache com **React 19** (incompatível), mas o projeto precisa de **React 18**.

## Solução (3 passos):

### 1. Acesse o Projeto Admin na Vercel

Vá em: https://vercel.com/dashboard

Selecione o projeto: **ecommerce-hair-admin** (ou nome que você deu)

### 2. Limpar Cache e Fazer Redeploy

1. Clique na aba **Deployments**
2. Encontre o último deployment (mais recente no topo)
3. Clique nos **3 pontos** (`...`) no lado direito
4. Clique em **Redeploy**
5. ✅ **MARQUE a caixa**: `"Clear cache and redeploy"`
6. Clique em **Redeploy**

### 3. Aguardar Build

- Aguarde o build completar (1-3 minutos)
- Quando ficar verde (✓), está pronto
- Acesse a URL do admin novamente

## Verificar se Funcionou

Acesse seu painel admin na Vercel.

O erro **NÃO deve mais aparecer**.

## Por que isso acontece?

- Vercel faz cache de `node_modules` para builds mais rápidos
- Cache antigo tinha React 19
- Novo `package.json` tem React 18, mas cache não foi limpo
- Ao marcar "Clear cache", Vercel reinstala tudo do zero
- Agora usa React 18.3.1 (correto)

## Prevenção Futura

O arquivo `.npmrc` foi adicionado ao projeto para evitar esse problema em futuros deploys.

## Ainda com Erro?

Se o erro persistir:

1. Verifique que o commit mais recente está deployado
2. Tente fazer outro redeploy com cache limpo
3. Verifique os logs do build em **Deployments** → **View Function Logs**

---

**Última atualização:** 2025-11-09
