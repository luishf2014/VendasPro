-- Script COMPLETO para corrigir permissões de Admin para ver todos os usuários
-- Execute este script COMPLETO no SQL Editor do Supabase

-- 1. Criar função para verificar se é admin ou manager (SECURITY DEFINER para bypass RLS)
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
    -- Bypass RLS usando SECURITY DEFINER
    SELECT role INTO v_role
    FROM public.users
    WHERE id = auth.uid() AND active = true;
    
    RETURN COALESCE(v_role IN ('admin', 'manager'), false);
END;
$$;

-- 2. Criar função para verificar se é admin
CREATE OR REPLACE FUNCTION public.is_admin()
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
    
    RETURN COALESCE(v_role = 'admin', false);
END;
$$;

-- 3. Remover TODAS as políticas antigas de usuários (para evitar conflitos)
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Managers can view all users" ON public.users;
DROP POLICY IF EXISTS "Admin/Manager can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Managers can update all users" ON public.users;
DROP POLICY IF EXISTS "Admin/Manager can update all users" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Managers can insert users" ON public.users;
DROP POLICY IF EXISTS "Admin/Manager can insert users" ON public.users;

-- 4. Criar políticas novas (combinando permissões)
-- SELECT: Usuários podem ver próprio perfil OU admin/manager podem ver todos
CREATE POLICY "Users can view own profile or admin/manager all" ON public.users
    FOR SELECT USING (
        auth.uid() = id OR public.is_admin_or_manager()
    );

-- UPDATE: Usuários podem atualizar próprio perfil OU admin/manager podem atualizar todos
CREATE POLICY "Users can update own profile or admin/manager all" ON public.users
    FOR UPDATE USING (
        auth.uid() = id OR public.is_admin_or_manager()
    );

-- INSERT: Usuários podem inserir próprio perfil OU admin/manager podem inserir novos usuários
CREATE POLICY "Users can insert own profile or admin/manager new users" ON public.users
    FOR INSERT WITH CHECK (
        auth.uid() = id OR public.is_admin_or_manager()
    );

-- 5. Garantir que as funções tenham permissões corretas
GRANT EXECUTE ON FUNCTION public.is_admin_or_manager() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 6. Verificar se as políticas foram criadas corretamente
-- (Execute este SELECT para verificar)
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename = 'users';

