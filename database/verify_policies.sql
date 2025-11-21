-- ============================================
-- Script para verificar políticas RLS
-- ============================================

-- 1. Verificar se RLS está ativado na tabela users
SELECT 
    schemaname,
    tablename,
    CASE 
        WHEN rowsecurity THEN '✅ RLS ATIVADO'
        ELSE '❌ RLS DESATIVADO'
    END as rls_status
FROM pg_tables
WHERE tablename = 'users' AND schemaname = 'public';

-- 2. Listar todas as políticas da tabela users
SELECT 
    policyname as "Nome da Política",
    CASE cmd
        WHEN 'r' THEN 'SELECT'
        WHEN 'a' THEN 'INSERT'
        WHEN 'w' THEN 'UPDATE'
        WHEN 'd' THEN 'DELETE'
        WHEN '*' THEN 'ALL'
    END as "Comando",
    CASE
        WHEN permissive THEN 'PERMISSIVE'
        ELSE 'RESTRICTIVE'
    END as "Tipo",
    qual as "USING Expression",
    with_check as "WITH CHECK Expression"
FROM pg_policy
WHERE polrelid = 'public.users'::regclass
ORDER BY cmd, policyname;

-- 3. Verificar se as funções helper existem
SELECT 
    proname as "Função",
    prosecdef as "Security Definer",
    provolatile as "Volatility",
    CASE provolatile
        WHEN 'i' THEN 'IMMUTABLE'
        WHEN 's' THEN 'STABLE'
        WHEN 'v' THEN 'VOLATILE'
    END as "Volatility Description"
FROM pg_proc
WHERE proname IN ('is_admin_or_manager', 'is_admin')
ORDER BY proname;

-- 4. Testar se o usuário atual consegue ver as políticas
SELECT 
    COUNT(*) as "Total de Políticas na Tabela Users"
FROM pg_policy
WHERE polrelid = 'public.users'::regclass;

-- 5. Verificar permissões da tabela users
SELECT 
    grantee,
    privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public' AND table_name = 'users'
ORDER BY grantee, privilege_type;

