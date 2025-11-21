# 🔧 Correção: Edição de Usuários não Salva

## 🎯 Problema Identificado

A edição de usuários por Admin e Gerente não está salvando as alterações devido a um problema nas **políticas RLS (Row Level Security)** do Supabase.

## ✅ Solução Rápida

### Passo 1: Verificar o Problema

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Abra seu projeto
3. Vá em **SQL Editor**
4. Clique em **"+ New query"**
5. Cole o conteúdo do arquivo `database/verify_policies.sql`
6. Execute (`Ctrl + Enter` ou clique em **Run**)

Isso mostrará as políticas atuais da tabela `users`.

### Passo 2: Aplicar a Correção

1. No **SQL Editor** do Supabase
2. Clique em **"+ New query"**
3. Cole o conteúdo do arquivo `database/fix_user_update_policies.sql`
4. Execute (`Ctrl + Enter` ou clique em **Run**)

Você deve ver mensagens de sucesso:
```
✅ Políticas de atualização de usuários corrigidas!
📋 Políticas ativas:
  - Admin/Manager can update all users
  - Users can update own profile
  - Admin/Manager can view all users
  - Users can view own profile
```

### Passo 3: Testar

1. Volte ao sistema
2. Tente editar um usuário como Admin ou Gerente
3. A edição deve funcionar agora! 🎉

## 📋 O que foi Corrigido?

### Problema

As políticas RLS tinham conflitos ou as funções auxiliares (`is_admin_or_manager` e `is_admin`) não estavam configuradas corretamente, impedindo que Admin e Gerente atualizassem usuários.

### Solução

1. **Recriação das funções auxiliares** com:
   - `SECURITY DEFINER` - Executa com privilégios do criador
   - `STABLE` - Otimização de performance
   - Tratamento de erros robusto

2. **Reorganização das políticas** na ordem correta:
   - Políticas mais permissivas primeiro (Admin/Manager)
   - Políticas específicas depois (próprio usuário)
   - Adição de `WITH CHECK` nas políticas de UPDATE

3. **Logs detalhados** adicionados no código para facilitar debugging

## 🔍 Como Verificar se Funcionou?

### Teste 1: Console do Navegador

Ao tentar editar um usuário, você deve ver no console (F12):

```
🔄 Iniciando atualização de usuário: [userId]
📋 Dados a atualizar: { name: "...", email: "...", role: "..." }
🔐 Verificação de permissões: { hasPermission: true, userRole: "admin" }
📝 Dados finais para atualização: { ... }
✅ Usuário atualizado com sucesso: { ... }
```

### Teste 2: Toast de Sucesso

Você deve ver a mensagem:
```
✅ Usuário atualizado com sucesso!
```

### Teste 3: Dados Atualizados

- A lista de usuários deve ser recarregada automaticamente
- As alterações devem aparecer imediatamente

## ⚠️ Se Ainda Não Funcionar

### Erro de Permissão

Se você ainda receber erro de permissão:

1. **Verifique se executou o script corretamente**
   ```sql
   -- Execute novamente o script fix_user_update_policies.sql
   ```

2. **Verifique se é realmente Admin ou Gerente**
   ```sql
   -- Execute no SQL Editor para verificar seu role
   SELECT id, name, email, role, active 
   FROM users 
   WHERE email = 'seu-email@aqui.com';
   ```

3. **Limpe o cache e faça logout/login**
   - Faça logout do sistema
   - Limpe os cookies do navegador
   - Faça login novamente

### Erro no Console

Se aparecer erro no console do navegador:

1. **Copie o erro completo** (F12 → Console)
2. **Verifique os logs detalhados**:
   - 🔄 Iniciando atualização
   - 🔐 Verificação de permissões
   - ❌ Mensagem de erro específica

3. **Códigos de erro comuns**:
   - `42501` - Problema de política RLS
   - `23505` - Email duplicado
   - `PGRST116` - Row not found

## 🔄 Alternativa: Usar Service Role (Temporário)

**⚠️ ATENÇÃO: Usar apenas para debug temporário!**

Se precisar de uma solução temporária enquanto corrige as políticas:

```typescript
// Em gestao-comercial/src/lib/supabase-admin.ts (criar novo arquivo)
import { createClient } from '@supabase/supabase-js'

// ⚠️ NUNCA EXPONHA A SERVICE ROLE NO CLIENT!
// Use apenas em API routes do Next.js

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Adicionar no .env.local

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
```

**Adicionar no `.env.local`:**
```env
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui
```

**⚠️ IMPORTANTE:** 
- NUNCA use isso no código client-side
- Use apenas em API routes server-side
- É apenas uma solução temporária
- **SEMPRE corrija as políticas RLS!**

## 📚 Arquivos Relacionados

- `database/fix_user_update_policies.sql` - Script de correção
- `database/verify_policies.sql` - Script de verificação
- `src/lib/database/queries.ts` - Função updateUser (com logs)
- `src/app/(dashboard)/dashboard/usuarios/page.tsx` - Página de usuários

## 🎯 Resumo

1. ✅ Execute `database/fix_user_update_policies.sql` no Supabase
2. ✅ Teste a edição de usuários
3. ✅ Verifique os logs no console (F12)
4. ✅ Se ainda houver erro, verifique as permissões

---

**🎉 Após seguir estes passos, a edição de usuários deve funcionar perfeitamente!**

