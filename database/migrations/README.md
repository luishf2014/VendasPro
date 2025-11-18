# Migrations

## Adicionar campo phone na tabela users

Execute o seguinte SQL no seu banco de dados Supabase:

```sql
-- Adicionar coluna phone na tabela users
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- Comentário na coluna
COMMENT ON COLUMN public.users.phone IS 'Número de telefone do usuário no formato brasileiro';
```

Ou execute o arquivo `add_phone_to_users.sql` diretamente no SQL Editor do Supabase.

