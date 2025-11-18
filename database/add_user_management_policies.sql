-- Script para adicionar políticas RLS para managers gerenciarem usuários
-- Execute este script no SQL Editor do Supabase

-- Primeiro, criar uma função SECURITY DEFINER para verificar se o usuário é manager
-- Isso evita problemas de recursão nas políticas RLS
CREATE OR REPLACE FUNCTION public.is_manager()
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
    
    RETURN v_role = 'manager';
END;
$$;

-- Remover políticas antigas se existirem (opcional, apenas se precisar recriar)
DROP POLICY IF EXISTS "Managers can view all users" ON public.users;
DROP POLICY IF EXISTS "Managers can update all users" ON public.users;
DROP POLICY IF EXISTS "Managers can insert users" ON public.users;

-- Managers can view all users
CREATE POLICY "Managers can view all users" ON public.users
    FOR SELECT USING (public.is_manager());

-- Managers can update all users
CREATE POLICY "Managers can update all users" ON public.users
    FOR UPDATE USING (public.is_manager());

-- Managers can insert users (for creating new users)
CREATE POLICY "Managers can insert users" ON public.users
    FOR INSERT WITH CHECK (public.is_manager());

