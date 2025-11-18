-- Script para fazer Admin funcionar igual ao Manager
-- Execute este script COMPLETO no SQL Editor do Supabase

-- 1. Criar função is_admin_or_manager (igual ao que funcionou para manager)
CREATE OR REPLACE FUNCTION public.is_admin_or_manager()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
    v_role VARCHAR(20);
BEGIN
    SELECT role INTO v_role
    FROM public.users
    WHERE id = auth.uid() AND active = true;
    
    RETURN COALESCE(v_role IN ('admin', 'manager'), false);
END;
$$;

-- 2. Remover TODAS as políticas existentes de users (importante!)
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view own profile or admin/manager all" ON public.users;
DROP POLICY IF EXISTS "Managers can view all users" ON public.users;
DROP POLICY IF EXISTS "Admin/Manager can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile or admin/manager all" ON public.users;
DROP POLICY IF EXISTS "Managers can update all users" ON public.users;
DROP POLICY IF EXISTS "Admin/Manager can update all users" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile or admin/manager new users" ON public.users;
DROP POLICY IF EXISTS "Managers can insert users" ON public.users;
DROP POLICY IF EXISTS "Admin/Manager can insert users" ON public.users;

-- 3. Criar políticas NOVAS (igual ao que funcionou para manager)
-- SELECT: Admin/Manager podem ver TODOS os usuários
CREATE POLICY "Admin/Manager can view all users" ON public.users
    FOR SELECT USING (public.is_admin_or_manager());

-- SELECT: Usuários podem ver próprio perfil (política separada)
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- UPDATE: Admin/Manager podem atualizar TODOS os usuários
CREATE POLICY "Admin/Manager can update all users" ON public.users
    FOR UPDATE USING (public.is_admin_or_manager());

-- UPDATE: Usuários podem atualizar próprio perfil (política separada)
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- INSERT: Admin/Manager podem inserir novos usuários
CREATE POLICY "Admin/Manager can insert users" ON public.users
    FOR INSERT WITH CHECK (public.is_admin_or_manager());

-- INSERT: Usuários podem inserir próprio perfil (política separada)
CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. Garantir permissões nas funções
GRANT EXECUTE ON FUNCTION public.is_admin_or_manager() TO authenticated;

-- 5. Verificar políticas criadas (descomente para verificar)
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd 
-- FROM pg_policies 
-- WHERE tablename = 'users'
-- ORDER BY policyname;

