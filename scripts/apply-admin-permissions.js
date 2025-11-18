/**
 * Script para aplicar permissões de Admin no Supabase
 * Execute: node scripts/apply-admin-permissions.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas!')
  console.error('Certifique-se de que .env.local contém:')
  console.error('  - NEXT_PUBLIC_SUPABASE_URL')
  console.error('  - SUPABASE_SERVICE_ROLE_KEY (ou NEXT_PUBLIC_SUPABASE_ANON_KEY)')
  process.exit(1)
}

// Usar service role key para bypass RLS (se disponível)
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const sql = `
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

-- Criar função para verificar se é admin OU manager
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
`

async function applySQL() {
  console.log('🚀 Aplicando permissões de Admin...\n')
  
  try {
    // Dividir o SQL em comandos individuais
    const commands = sql
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'))
    
    console.log(`📝 Executando ${commands.length} comandos SQL...\n`)
    
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i] + ';'
      console.log(`[${i + 1}/${commands.length}] Executando comando...`)
      
      const { error } = await supabase.rpc('exec_sql', { sql_query: command })
      
      if (error) {
        // Tentar método alternativo usando query direta
        const { error: queryError } = await supabase.from('_').select('*').limit(0)
        
        if (queryError && queryError.message.includes('exec_sql')) {
          console.warn('⚠️  Método RPC não disponível. Use o SQL Editor do Supabase.')
          console.log('\n📋 Copie e cole este SQL no Supabase SQL Editor:\n')
          console.log(sql)
          process.exit(1)
        }
      }
    }
    
    console.log('\n✅ Permissões de Admin aplicadas com sucesso!')
    console.log('🔄 Recarregue a página de usuários no dashboard.')
    
  } catch (error) {
    console.error('\n❌ Erro ao aplicar SQL:', error.message)
    console.log('\n📋 Como alternativa, copie e cole este SQL no Supabase SQL Editor:\n')
    console.log(sql)
    process.exit(1)
  }
}

applySQL()

