-- Migration: Adicionar campo phone na tabela users
-- Data: 2024

-- Adicionar coluna phone na tabela users
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- Comentário na coluna
COMMENT ON COLUMN public.users.phone IS 'Número de telefone do usuário no formato brasileiro';

