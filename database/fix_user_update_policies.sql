-- ============================================
-- Script para corrigir políticas de atualização de usuários
-- ============================================

-- 1. Remover políticas existentes (se houver conflitos)
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admin/Manager can update all users" ON public.users;

-- 2. Recriar as funções auxiliares com permissões corretas
DROP FUNCTION IF EXISTS public.is_admin_or_manager();
DROP FUNCTION IF EXISTS public.is_admin();

-- Função para verificar se é admin ou manager
CREATE OR REPLACE FUNCTION public.is_admin_or_manager()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
    v_role VARCHAR(20);
    v_active BOOLEAN;
BEGIN
    -- Buscar role e status ativo do usuário
    SELECT role, active INTO v_role, v_active
    FROM public.users
    WHERE id = auth.uid();
    
    -- Retornar true se for admin ou manager E estiver ativo
    RETURN (v_role IN ('admin', 'manager') AND v_active = true);
EXCEPTION
    WHEN OTHERS THEN
        -- Em caso de erro, retornar false por segurança
        RETURN false;
END;
$$;

-- Função para verificar se é admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
    v_role VARCHAR(20);
    v_active BOOLEAN;
BEGIN
    SELECT role, active INTO v_role, v_active
    FROM public.users
    WHERE id = auth.uid();
    
    RETURN (v_role = 'admin' AND v_active = true);
EXCEPTION
    WHEN OTHERS THEN
        RETURN false;
END;
$$;

-- 3. Criar políticas de UPDATE com a ordem correta
-- Importante: A ordem importa! Políticas mais permissivas primeiro

-- Admin e Manager podem atualizar todos os usuários
CREATE POLICY "Admin/Manager can update all users" ON public.users
    FOR UPDATE 
    USING (public.is_admin_or_manager())
    WITH CHECK (public.is_admin_or_manager());

-- Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 4. Garantir que admin/manager podem visualizar todos os usuários
DROP POLICY IF EXISTS "Admin/Manager can view all users" ON public.users;

CREATE POLICY "Admin/Manager can view all users" ON public.users
    FOR SELECT 
    USING (public.is_admin_or_manager());

-- 5. Garantir que usuários podem ver seu próprio perfil
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;

CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT 
    USING (auth.uid() = id);

-- 6. Verificar se as políticas foram criadas corretamente
DO $$
BEGIN
    RAISE NOTICE '✅ Políticas de atualização de usuários corrigidas!';
    RAISE NOTICE '📋 Políticas ativas:';
    RAISE NOTICE '  - Admin/Manager can update all users';
    RAISE NOTICE '  - Users can update own profile';
    RAISE NOTICE '  - Admin/Manager can view all users';
    RAISE NOTICE '  - Users can view own profile';
END $$;

-- 7. Testar as funções
SELECT 
    'Função is_admin_or_manager() criada: ' || 
    CASE WHEN EXISTS(
        SELECT 1 FROM pg_proc WHERE proname = 'is_admin_or_manager'
    ) THEN '✅' ELSE '❌' END as status;

SELECT 
    'Função is_admin() criada: ' || 
    CASE WHEN EXISTS(
        SELECT 1 FROM pg_proc WHERE proname = 'is_admin'
    ) THEN '✅' ELSE '❌' END as status;

