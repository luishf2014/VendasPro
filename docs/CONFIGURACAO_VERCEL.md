# 🚀 Configuração do Supabase na Vercel

Este guia mostra como configurar o projeto para funcionar corretamente na Vercel, sem necessidade de integrações complexas.

## 📋 Pré-requisitos

- Projeto criado no Supabase
- Conta na Vercel

## ⚡ Configuração Rápida

### 1. **Obter Credenciais do Supabase**

1. Acesse [supabase.com](https://supabase.com/dashboard)
2. Abra seu projeto
3. Vá em **Settings** (⚙️) → **API**
4. Copie as seguintes informações:
   - **Project URL**: `https://seu-projeto.supabase.co`
   - **anon public**: A chave pública (anon key)

### 2. **Configurar Variáveis de Ambiente na Vercel**

1. Acesse o [Dashboard da Vercel](https://vercel.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Adicione as seguintes variáveis:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui

# Environment
NODE_ENV=production
```

### 3. **Fazer Deploy**

Após configurar as variáveis de ambiente:

```bash
# Via Git (recomendado)
git push origin main

# Ou via CLI da Vercel
vercel --prod
```

## ✅ Verificação

Após o deploy, você deve:

1. ✅ Conseguir acessar a página de login
2. ✅ Fazer login com suas credenciais
3. ✅ Visualizar o dashboard sem erros no console
4. ✅ As operações do banco devem funcionar normalmente

## 🔧 Configuração Local

Para desenvolvimento local, crie um arquivo `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui

# Development
NODE_ENV=development
```

## 📝 Notas Importantes

### ✅ O que FUNCIONA desta forma:

- ✅ Autenticação de usuários
- ✅ Queries ao banco de dados
- ✅ Row Level Security (RLS)
- ✅ Realtime subscriptions
- ✅ Storage (se configurado)

### ⚠️ O que NÃO funciona sem configuração adicional:

- ❌ Webhooks (precisam ser configurados manualmente)
- ❌ Edge Functions do Supabase (precisam de configuração extra)

### 🔐 Segurança

- ✅ **NUNCA** exponha a `service_role_key` no código client-side
- ✅ Use apenas `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ Configure corretamente as políticas RLS no Supabase
- ✅ Valide permissões no backend (API routes)

## 🔄 Rebuild após Mudanças

Sempre que alterar as variáveis de ambiente:

1. Salve as mudanças na Vercel
2. Faça um novo deploy ou clique em **Redeploy**

## 📚 Recursos Adicionais

- [Documentação Supabase](https://supabase.com/docs)
- [Documentação Vercel](https://vercel.com/docs)
- [Next.js + Supabase](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)

## 🆘 Solução de Problemas

### Erro: "Supabase não configurado"

**Causa**: Variáveis de ambiente não definidas ou incorretas.

**Solução**:
1. Verifique se as variáveis estão corretamente definidas na Vercel
2. Confirme que os nomes estão exatamente como especificado (incluindo `NEXT_PUBLIC_`)
3. Faça um redeploy

### Erro de autenticação

**Causa**: Configuração de cookies ou domínio incorreto.

**Solução**:
1. Verifique a URL do projeto no Supabase
2. Confirme que a URL de callback está configurada no Supabase:
   - Vá em **Authentication** → **URL Configuration**
   - Adicione sua URL da Vercel nas **Site URL** e **Redirect URLs**

### Erro 403 / Acesso negado

**Causa**: Políticas RLS não configuradas corretamente.

**Solução**:
1. Revise as políticas RLS nas tabelas do Supabase
2. Execute novamente os scripts em `database/rls.sql`
3. Verifique se o usuário tem a role correta

---

## 🎯 Resumo

Com esta configuração:
- ✅ **Simples**: Apenas 2 variáveis de ambiente
- ✅ **Seguro**: Usa as melhores práticas do Supabase
- ✅ **Compatível**: Funciona perfeitamente na Vercel
- ✅ **Sem integrações**: Não precisa de configurações complexas

**É isso! Seu projeto deve funcionar perfeitamente na Vercel! 🚀**

