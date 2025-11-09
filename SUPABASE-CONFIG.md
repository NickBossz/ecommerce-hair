# Configuração do Supabase para Autenticação

## Erro 400 no Signup

Se você está recebendo erro 400 ao tentar criar uma conta, provavelmente a confirmação de email está ativada mas não configurada.

## Solução 1: Desativar Confirmação de Email (Desenvolvimento)

### Passo a Passo:

1. Acesse: https://supabase.com/dashboard/project/hyivpxxuoschkezzglty/auth/users

2. Clique em **Configuration** (⚙️) no menu lateral

3. Clique em **Email Auth**

4. **DESMARQUE** a opção:
   - ☐ `Enable email confirmations`

5. Clique em **Save**

Agora o signup deve funcionar sem confirmação de email.

## Solução 2: Configurar SMTP (Produção Recomendada)

Se você quer confirmação por email:

### 1. Configurar SMTP

1. Vá em **Configuration** → **Email Auth**
2. Role até **SMTP Settings**
3. Preencha:
   ```
   SMTP Host: smtp.gmail.com
   SMTP Port: 587
   SMTP User: seu-email@gmail.com
   SMTP Password: sua-senha-de-app
   SMTP Sender Name: FabHair
   SMTP Sender Email: noreply@fabhair.com
   ```

### 2. Gmail App Password

Se usar Gmail:
1. Acesse: https://myaccount.google.com/apppasswords
2. Crie uma senha de app
3. Use essa senha no SMTP Password

### 3. Customizar Template de Email

1. **Configuration** → **Email Templates**
2. Edite o template "Confirm signup"
3. Personalize com o nome da sua loja

## Solução 3: Permitir Emails Específicos (Teste)

Para testar sem SMTP:

1. **Configuration** → **Email Auth**
2. Em **Allowed Email Domains**, adicione:
   ```
   gmail.com,outlook.com,hotmail.com
   ```
3. Desative confirmação de email

## Verificar Configuração Atual

Execute no **SQL Editor** do Supabase:

```sql
-- Ver configurações de auth
SELECT * FROM auth.config;
```

## Testar Signup

Depois de configurar, teste:

1. Acesse: http://localhost:5173/login
2. Clique na aba "Cadastrar"
3. Preencha os dados
4. Clique em "Criar conta"

**Com confirmação OFF:**
- Usuário criado imediatamente
- Login automático

**Com confirmação ON:**
- Email enviado
- Clicar no link de confirmação
- Fazer login manualmente

## Verificar Usuários Criados

No Supabase Dashboard:

1. **Authentication** → **Users**
2. Você deve ver os usuários criados
3. Coluna "Email Confirmed": `true` ou `false`

## Troubleshooting

### Erro: "User already registered"

Usuário já existe. Opções:
- Fazer login ao invés de signup
- Deletar usuário em **Authentication** → **Users**

### Erro: "Invalid email"

- Email inválido ou bloqueado
- Verifique **Allowed Email Domains**

### Erro: "SMTP not configured"

- Confirmação está ON mas SMTP não configurado
- Use Solução 1 ou 2 acima

### Email não chega

1. Verifique SPAM
2. Verifique SMTP settings
3. Veja logs em **Logs** → **Email Logs**

## Configuração Recomendada por Ambiente

**Desenvolvimento Local:**
```
✅ Email confirmation: OFF
✅ Auto confirm: ON
```

**Produção:**
```
✅ Email confirmation: ON
✅ SMTP configured
✅ Custom email templates
```

## Próximos Passos

Após criar usuário com sucesso:

1. Promover para admin (se necessário):
```sql
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'seu-email@example.com';
```

2. Fazer login
3. Acessar admin panel se for admin
