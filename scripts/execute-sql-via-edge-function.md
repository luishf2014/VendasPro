# Como Executar SQL via Edge Function

## Opção 1: Criar Edge Function no Supabase

1. No Supabase Dashboard, vá em **Edge Functions**
2. Crie uma nova função chamada `execute-admin-sql`
3. Cole este código:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { sql } = await req.json()

    const { data, error } = await supabaseAdmin.rpc('exec_sql', { 
      sql_query: sql 
    })

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }
})
```

4. Deploy a função
5. Execute via script Node.js (veja abaixo)

## Opção 2: Usar Supabase CLI

Se você tiver Supabase CLI configurado:

```bash
supabase db execute --file database/add_admin_same_as_manager.sql
```

## Opção 3: Executar Manualmente (Mais Simples)

Copie o conteúdo de `database/add_admin_same_as_manager.sql` e cole no SQL Editor do Supabase Dashboard.

