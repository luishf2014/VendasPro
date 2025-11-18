-- Script para atualizar permissões do Admin
-- Execute este script no SQL Editor do Supabase para dar acesso total ao admin

-- Criar função para verificar se é admin ou manager
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

-- Criar função para verificar se é admin
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

-- Remover políticas antigas de usuários
DROP POLICY IF EXISTS "Managers can view all users" ON public.users;
DROP POLICY IF EXISTS "Managers can update all users" ON public.users;
DROP POLICY IF EXISTS "Managers can insert users" ON public.users;

-- Admin e Manager podem visualizar todos os usuários
CREATE POLICY "Admin/Manager can view all users" ON public.users
    FOR SELECT USING (public.is_admin_or_manager());

-- Admin e Manager podem atualizar todos os usuários
CREATE POLICY "Admin/Manager can update all users" ON public.users
    FOR UPDATE USING (public.is_admin_or_manager());

-- Admin e Manager podem inserir novos usuários
CREATE POLICY "Admin/Manager can insert users" ON public.users
    FOR INSERT WITH CHECK (public.is_admin_or_manager());

-- Remover função antiga is_manager se existir (opcional)
DROP FUNCTION IF EXISTS public.is_manager();

