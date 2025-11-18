#!/bin/bash
# Script para aplicar permissões de Admin usando Supabase CLI
# Execute: bash scripts/apply-admin-permissions.sh

echo "🚀 Aplicando permissões de Admin no Supabase..."

# Verificar se Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI não encontrado!"
    echo "📦 Instale com: npm install -g supabase"
    echo "🔗 Ou acesse: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Executar SQL usando CLI
supabase db execute --file database/add_admin_same_as_manager.sql

if [ $? -eq 0 ]; then
    echo "✅ Permissões de Admin aplicadas com sucesso!"
    echo "🔄 Recarregue a página de usuários no dashboard."
else
    echo "❌ Erro ao aplicar SQL"
    echo "📋 Como alternativa, copie o conteúdo de database/add_admin_same_as_manager.sql"
    echo "   e cole no SQL Editor do Supabase Dashboard"
    exit 1
fi

