# Atualizar Admin Panel - Correção React 19

O painel admin estava usando React 19 que causava erro:
```
Cannot read properties of null (reading 'useState')
```

## Solução Aplicada

Downgrade para React 18 (versão estável e compatível).

## Como Atualizar Localmente

```bash
# 1. Navegar para o diretório do admin
cd paineladmin

# 2. Remover node_modules e lock file
rm -rf node_modules package-lock.json

# 3. Reinstalar dependências (já estão na versão correta)
npm install

# 4. Voltar para a raiz e rodar
cd ..
npm run dev:admin
```

## Verificar se Funcionou

Acesse: http://localhost:5174

Não deve mais aparecer o erro de `useState`.

## Mudanças de Versão

| Pacote | Antes (React 19) | Depois (React 18) |
|--------|------------------|-------------------|
| react | 19.1.1 | 18.3.1 |
| react-dom | 19.1.1 | 18.3.1 |
| react-router-dom | 7.9.4 | 6.30.1 |
| @hookform/resolvers | 5.2.2 | 3.10.0 |
| date-fns | 4.1.0 | 3.6.0 |
| recharts | 3.3.0 | 2.15.4 |
| zod | 4.1.12 | 3.25.76 |
| vite | 7.1.7 | 5.4.19 |

## Deploy na Vercel

A Vercel instalará automaticamente as versões corretas no próximo deploy.

Não é necessária ação manual.
