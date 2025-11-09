-- ========================================
-- TRIGGER: Auto-criar perfil quando usuário fizer signup
-- ========================================
-- Execute este SQL no Supabase SQL Editor
-- Isso garante que todo usuário criado no auth.users
-- terá automaticamente um perfil em user_profiles

-- 1. Criar função que cria o perfil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuário'),
    'customer'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- 2. Criar trigger que executa a função
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. Verificar se trigger foi criado
SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- ========================================
-- RESULTADO ESPERADO:
-- ========================================
-- trigger_name: on_auth_user_created
-- event_manipulation: INSERT
-- event_object_table: users
-- action_statement: EXECUTE FUNCTION public.handle_new_user()

-- ========================================
-- TESTAR:
-- ========================================
-- 1. Faça signup de um novo usuário no frontend
-- 2. Verifique que foi criado em auth.users:
--    SELECT id, email FROM auth.users WHERE email = 'teste@example.com';
-- 3. Verifique que foi criado em user_profiles:
--    SELECT id, email, role FROM user_profiles WHERE email = 'teste@example.com';
-- 4. O role deve ser 'customer' por padrão

-- ========================================
-- BONUS: Criar perfis para usuários antigos que não têm
-- ========================================
-- Execute isso se você tem usuários no auth.users sem perfil:

INSERT INTO user_profiles (id, email, full_name, role)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', 'Usuário') as full_name,
  'customer' as role
FROM auth.users u
LEFT JOIN user_profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- Verificar quantos perfis foram criados
SELECT COUNT(*) as perfis_criados
FROM user_profiles;
