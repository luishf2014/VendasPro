# 🛒 Sistema de Gestão Comercial

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green?style=for-the-badge&logo=supabase)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)

Sistema completo de gestão comercial com PDV, controle de estoque, vendas e usuários.

[Demo](#) • [Documentação](#instalação) • [Reportar Bug](../../issues)

</div>

---

## 📋 Sobre o Projeto

Sistema web completo para gestão comercial desenvolvido com Next.js 16, TypeScript e Supabase. Oferece controle total de vendas, estoque, produtos, clientes e usuários com interface moderna e intuitiva.

### ✨ Principais Funcionalidades

#### 🎯 PDV (Ponto de Venda)
- ⚡ Interface rápida e otimizada para vendas
- 🔍 Busca por código de barras ou nome
- 💰 Múltiplos métodos de pagamento (Dinheiro, Cartão, PIX)
- 🎁 Sistema de descontos e acréscimos
- ⌨️ Atalhos de teclado para agilidade
- 📱 Responsivo para tablet e mobile

#### 📦 Gestão de Produtos
- ➕ Cadastro completo de produtos
- 🏷️ Categorias personalizáveis
- 📊 Controle de estoque em tempo real
- ⚠️ Alertas de estoque baixo
- 📝 Código interno e código de barras
- 💵 Controle de preço de custo e venda

#### 📊 Dashboard Analítico
- 📈 Vendas do dia e do mês
- 💰 Faturamento diário (últimos 7 dias)
- 📦 Total de produtos cadastrados
- 🎯 Ticket médio
- 📉 Produtos com estoque baixo
- 🔥 Vendas recentes

#### 👥 Gestão de Usuários
- 🔐 Sistema de permissões (Admin, Gerente, Usuário)
- 👤 Perfis personalizados
- 🛡️ Controle de acesso por funcionalidade
- ✅ Ativação/desativação de usuários

#### 🛍️ Histórico de Vendas
- 📋 Lista completa de vendas
- 🔎 Filtros avançados
- 💳 Detalhamento por método de pagamento
- 📄 Visualização de itens vendidos

---

## 🚀 Tecnologias

### Frontend
- **[Next.js 16](https://nextjs.org/)** - Framework React com SSR
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Estilização
- **[Radix UI](https://www.radix-ui.com/)** - Componentes acessíveis
- **[Lucide Icons](https://lucide.dev/)** - Ícones modernos

### Backend & Database
- **[Supabase](https://supabase.com/)** - Backend-as-a-Service
- **PostgreSQL** - Banco de dados relacional
- **Row Level Security (RLS)** - Segurança a nível de linha
- **Database Triggers** - Automações (estoque, vendas)

### Outras Ferramentas
- **[React Hook Form](https://react-hook-form.com/)** - Gerenciamento de formulários
- **[Zod](https://zod.dev/)** - Validação de schemas
- **[React Hot Toast](https://react-hot-toast.com/)** - Notificações

---

## 📥 Instalação

### Pré-requisitos

- Node.js 18+ instalado
- Conta no [Supabase](https://supabase.com) (gratuita)
- Git

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/gestao-comercial.git
cd gestao-comercial
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_publica
```

Para obter as credenciais:
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Vá em `Settings → API`
4. Copie a URL e a `anon/public` key

4. **Configure o banco de dados**

Execute os scripts SQL no SQL Editor do Supabase **nesta ordem**:

```sql
-- 1. Estrutura das tabelas
database/schema.sql

-- 2. Funções e triggers
database/functions.sql

-- 3. Políticas de segurança (RLS)
database/rls.sql
```

5. **Execute o projeto**

```bash
npm run dev
```

Acesse: `http://localhost:3000`

---

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

- **users** - Usuários do sistema (vinculado ao auth.users)
- **categories** - Categorias de produtos
- **products** - Produtos cadastrados
- **customers** - Clientes
- **sales** - Vendas realizadas
- **sale_items** - Itens de cada venda

### Triggers Automáticos

- ✅ Atualização automática de estoque ao finalizar venda
- ✅ Cálculo de total de compras por cliente
- ✅ Geração automática de número de venda
- ✅ Criação automática de perfil ao registrar

---

## 👤 Primeiro Acesso

### Criar Primeiro Usuário

1. Acesse `/register` (apenas para o primeiro usuário)
2. Cadastre-se com seus dados
3. No Supabase, acesse a tabela `users`
4. Altere o campo `role` para `admin` ou `manager`
5. Faça login em `/login`

### Hierarquia de Permissões

| Role | Permissões |
|------|-----------|
| 👑 **Admin** | Acesso total, pode deletar clientes |
| 👔 **Manager** | Criar/editar produtos e usuários, ver faturamento |
| 👤 **User** | Apenas vendas e visualização |

---

## 📱 Responsividade

O sistema foi projetado para funcionar perfeitamente em:

- 💻 **Desktop** (1920px+)
- 💻 **Laptop** (1366px - 1920px)
- 📱 **Tablet** (768px - 1024px)
- 📱 **Mobile** (320px - 767px)

### Otimizações Mobile

- Menu lateral retrátil
- Layout de 2 colunas vira 1 coluna
- Botões e campos de tamanho adequado para toque
- Textos e ícones ajustados
- Scroll otimizado

---

## ⌨️ Atalhos do Teclado (PDV)

| Tecla | Ação |
|-------|------|
| `F1` | Método: Dinheiro |
| `F2` | Método: Cartão |
| `F3` | Método: PIX |
| `F4` | Focar em Desconto |
| `F5` | Focar em Acréscimo |
| `F9` | Finalizar Venda |
| `F10` | Limpar Carrinho |
| `F12` / `ESC` | Focar na Busca |

---

## 📂 Estrutura do Projeto

```
gestao-comercial/
├── src/
│   ├── app/                    # Rotas Next.js 13+ (App Router)
│   │   ├── (auth)/            # Páginas de autenticação
│   │   │   ├── login/
│   │   │   └── register/
│   │   └── (dashboard)/       # Páginas protegidas
│   │       └── dashboard/
│   │           ├── page.tsx           # Dashboard principal
│   │           ├── pdv/              # PDV
│   │           ├── produtos/         # Gestão de produtos
│   │           ├── vendas/           # Histórico de vendas
│   │           ├── usuarios/         # Gestão de usuários
│   │           └── configuracoes/    # Configurações
│   ├── components/            # Componentes reutilizáveis
│   │   ├── ui/               # Componentes base (shadcn/ui)
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── LoadingSpinner.tsx
│   ├── contexts/             # Contextos React
│   │   └── AuthContext.tsx
│   ├── lib/                  # Utilitários e configurações
│   │   ├── database/
│   │   │   └── queries.ts   # Queries do Supabase
│   │   ├── supabase.ts      # Cliente Supabase
│   │   └── utils.ts         # Funções auxiliares
│   └── types/               # Tipos TypeScript
│       └── index.ts
├── database/                 # Scripts SQL
│   ├── schema.sql           # Estrutura do banco
│   ├── functions.sql        # Funções e triggers
│   ├── rls.sql             # Políticas de segurança
│   └── migrations/         # Migrações
├── docs/                    # Documentação
│   ├── README.md
│   └── SETUP.md
└── public/                  # Arquivos estáticos
```

---

## 🧪 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm run start

# Linter
npm run lint

# Type checking
npm run type-check
```

---

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório no [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras Opções

- **Netlify** - Similar ao Vercel
- **Railway** - Full-stack hosting
- **Docker** - Container personalizado

---

## 🔒 Segurança

- ✅ Row Level Security (RLS) em todas as tabelas
- ✅ Autenticação via Supabase Auth
- ✅ Permissões por role (Admin, Manager, User)
- ✅ Validação de dados com Zod
- ✅ Proteção contra SQL Injection
- ✅ HTTPS obrigatório em produção

---

## 🐛 Problemas Conhecidos

Consulte a [lista de issues](../../issues) para problemas conhecidos e roadmap.

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

Desenvolvido com ❤️ por **Seu Nome**

- GitHub: [@seu-usuario](https://github.com/seu-usuario)
- LinkedIn: [Seu LinkedIn](https://linkedin.com/in/seu-usuario)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga estes passos:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)

---

<div align="center">

### ⭐ Se este projeto foi útil, considere dar uma estrela!

Made with ☕ and 💻

</div>
