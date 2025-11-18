-- Script para adicionar permissões de Admin (igual ao Manager)
-- Execute este script DEPOIS de ter executado o script do Manager
-- Isso adiciona as mesmas políticas para admin, mantendo as do manager

-- Criar função para verificar se é admin (igual ao is_manager)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_role VARCHAR(20);
BEGIN
    SELECT role INTO v_role
    FROM public.users
    WHERE id = auth.uid() AND active = true;
    
    RETURN v_role = 'admin';
END;
$$;

-- Criar função para verificar se é admin OU manager (para usar em políticas combinadas)
CREATE OR REPLACE FUNCTION public.is_admin_or_manager()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_role VARCHAR(20);
BEGIN
    SELECT role INTO v_role
    FROM public.users
    WHERE id = auth.uid() AND active = true;
    
    RETURN v_role IN ('admin', 'manager');
END;
$$;

-- Remover políticas antigas de admin se existirem
DROP POLICY IF EXISTS "Admin can view all users" ON public.users;
DROP POLICY IF EXISTS "Admin can update all users" ON public.users;
DROP POLICY IF EXISTS "Admin can insert users" ON public.users;
DROP POLICY IF EXISTS "Admin/Manager can view all users" ON public.users;
DROP POLICY IF EXISTS "Admin/Manager can update all users" ON public.users;
DROP POLICY IF EXISTS "Admin/Manager can insert users" ON public.users;

-- Admin pode ver TODOS os usuários (política separada, igual ao manager)
CREATE POLICY "Admin can view all users" ON public.users
    FOR SELECT USING (public.is_admin());

-- Admin pode atualizar TODOS os usuários (política separada, igual ao manager)
CREATE POLICY "Admin can update all users" ON public.users
    FOR UPDATE USING (public.is_admin());

-- Admin pode inserir novos usuários (política separada, igual ao manager)
CREATE POLICY "Admin can insert users" ON public.users
    FOR INSERT WITH CHECK (public.is_admin());

-- Garantir permissões nas funções
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_or_manager() TO authenticated;

