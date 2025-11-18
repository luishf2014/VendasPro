# 🚀 Configuração do Sistema de Vendas

Guia completo para configurar e executar o sistema de vendas.

## 📋 Pré-requisitos

- **Node.js** 18.0.0 ou superior
- **npm** ou **yarn**
- **Conta no Supabase** (gratuita)

## ⚡ Configuração Rápida

### 1. **Variáveis de Ambiente**

Crie um arquivo `.env.local` na raiz do projeto com:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=sua_supabase_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_supabase_anon_key_aqui

# Development
NODE_ENV=development
```

**Como obter as credenciais do Supabase:**
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta (gratuita)
3. Crie um novo projeto
4. Vá em Settings → API
5. Copie a `URL` e `anon public key`

### 2. **Configurar Banco de Dados**

Execute os scripts SQL no Supabase Dashboard (SQL Editor) nesta ordem:

1. **Schema**: `database/schema.sql`
2. **Funções**: `database/functions.sql`  
3. **RLS**: `database/rls.sql`

### 3. **Instalar e Executar**

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev
```

Acesse: `http://localhost:3000`

## 🗄️ **Configuração Detalhada do Banco**

### **1. Schema (database/schema.sql)**
```sql
-- Este arquivo cria:
- Tabela users (perfis de usuário)
- Tabela categories (categorias de produtos)
- Tabela products (produtos)
- Tabela customers (clientes)
- Tabela sales (vendas)
- Tabela sale_items (itens das vendas)
- Índices para performance
- Triggers para updated_at
```

### **2. Funções (database/functions.sql)**
```sql
-- Este arquivo cria:
- handle_new_user() - Criação automática de perfil
- ensure_user_profile() - Garantir perfil existe
- generate_sale_number() - Gerar número de venda
- update_customer_purchases() - Atualizar total de compras
- update_product_stock() - Controlar estoque
```

### **3. RLS - Row Level Security (database/rls.sql)**
```sql
-- Este arquivo configura:
- Políticas de acesso por role (admin/manager/user)
- Segurança a nível de linha
- Controle de permissões granular
```

## 👤 **Primeiro Usuário Admin**

Após configurar o banco, registre-se pela interface:

1. Acesse `/auth/register`
2. Preencha os dados
3. Na tabela `users` do Supabase, altere o `role` para `admin`

## 🧪 **Testando o Sistema**

### **Login de Teste**
1. Registre um usuário
2. Faça login
3. Acesse o dashboard
4. Teste as funcionalidades básicas

### **Dados de Exemplo**
Você pode inserir dados de exemplo no Supabase:

```sql
-- Categorias
INSERT INTO categories (name, description) VALUES
('Eletrônicos', 'Produtos eletrônicos em geral'),
('Roupas', 'Vestuário e acessórios'),
('Casa', 'Itens para casa e decoração');

-- Produtos  
INSERT INTO products (name, price, cost_price, stock_quantity, category_id) VALUES
('Smartphone', 899.99, 500.00, 10, (SELECT id FROM categories WHERE name = 'Eletrônicos')),
('Camiseta', 49.99, 25.00, 50, (SELECT id FROM categories WHERE name = 'Roupas')),
('Vaso Decorativo', 79.99, 40.00, 20, (SELECT id FROM categories WHERE name = 'Casa'));

-- Clientes
INSERT INTO customers (name, email, phone) VALUES
('João Silva', 'joao@email.com', '(11) 99999-9999'),
('Maria Santos', 'maria@email.com', '(11) 88888-8888');
```

## 🚀 **Deploy em Produção**

### **Vercel (Recomendado)**
1. Conecte seu repositório GitHub no Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### **Outras Opções**
- **Netlify**: Similar ao Vercel
- **Railway**: Para apps full-stack
- **Docker**: Container personalizado

## 🔧 **Scripts Disponíveis**

```bash
npm run dev         # Desenvolvimento
npm run build       # Build para produção
npm run start       # Servidor de produção
npm run lint        # Verificar código
npm run type-check  # Verificar tipos
```

## 🐛 **Solução de Problemas**

### **Erro: Supabase client not configured**
- Verifique se `.env.local` existe
- Confirme se as variáveis estão corretas
- Reinicie o servidor de desenvolvimento

### **Erro: Permission denied**
- Execute os scripts RLS no Supabase
- Verifique se o usuário tem role configurado
- Teste com role `admin` primeiro

### **Build Error**
- Execute `npm run build` para identificar erros
- Verifique se todas as dependências estão instaladas
- Confirme se os tipos TypeScript estão corretos

### **404 ou rotas não funcionam**
- Verifique se o middleware está configurado
- Confirme se as rotas existem em `src/app/`
- Teste sem middleware primeiro

## 📞 **Suporte**

Se encontrar problemas:

1. **Verifique os logs** no console do navegador
2. **Confira a documentação** do Next.js e Supabase
3. **Teste em modo desenvolvimento** primeiro
4. **Verifique as variáveis de ambiente**

## 🔄 **Próximos Passos**

Após a configuração inicial:

1. ☐ Teste todas as funcionalidades básicas
2. ☐ Configure backup do banco de dados
3. ☐ Personalize o design conforme sua marca
4. ☐ Adicione dados reais (produtos, clientes)  
5. ☐ Configure domínio personalizado
6. ☐ Monitore performance e erros

---

**Sistema pronto para uso!** 🎉

O sistema está configurado com todas as funcionalidades básicas:
- ✅ Autenticação completa
- ✅ Dashboard futurista
- ✅ Estrutura para PDV
- ✅ Gestão de produtos/clientes
- ✅ Banco de dados seguro
- ✅ Interface moderna

**Próximo passo:** Implementar as páginas de gestão (produtos, clientes, PDV) conforme suas necessidades específicas.
