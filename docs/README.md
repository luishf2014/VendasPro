# 🚀 Sistema de Vendas - Gestão Comercial

Sistema completo de gestão comercial com vendas, estoque e clientes, desenvolvido com Next.js 14, TypeScript, Tailwind CSS e Supabase.

## ✨ Características Principais

### 🎨 **Interface Moderna e Futurista**
- Design inspirado em dashboards modernos
- Componentes glassmorphism e gradientes
- Animações suaves e micro-interações
- Responsive design para todos os dispositivos
- Dark mode integrado

### 🔐 **Autenticação Robusta**
- Sistema completo de login/registro
- Middleware para proteção de rotas
- Controle de acesso baseado em roles (Admin, Manager, User)
- Row Level Security (RLS) no banco de dados
- Sessões seguras com Supabase Auth

### 📊 **Dashboard Inteligente**
- Visão geral do negócio em tempo real
- Cards de estatísticas com dados importantes
- Gráficos de performance
- Alertas de estoque baixo
- Vendas recentes e ações rápidas

### 💰 **Sistema de Vendas (PDV)**
- Interface intuitiva para ponto de venda
- Carrinho de compras dinâmico
- Múltiplas formas de pagamento (Dinheiro, Cartão, PIX)
- Aplicação de descontos
- Geração automática de número de venda
- Controle de estoque em tempo real

### 📦 **Gestão de Produtos**
- CRUD completo de produtos
- Categorização avançada
- Controle de estoque com alertas
- Preço de custo vs venda
- Código de barras
- Busca e filtros avançados

### 👥 **Gestão de Clientes**
- Cadastro completo de clientes
- Histórico de compras
- Dados de contato e endereço
- Total de compras por cliente
- Busca inteligente

### 📈 **Relatórios e Análises**
- Vendas por período
- Produtos mais vendidos
- Performance por usuário
- Controle de estoque
- Exportação de dados

## 🛠️ **Tecnologias Utilizadas**

### **Frontend**
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **React Hook Form** - Formulários performáticos
- **Zod** - Validação de schemas
- **Lucide React** - Ícones modernos
- **React Hot Toast** - Notificações elegantes

### **Backend & Database**
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Banco de dados relacional
- **Row Level Security** - Segurança a nível de linha
- **Triggers & Functions** - Lógica de negócio no banco

### **Ferramentas & Utils**
- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **Class Variance Authority** - Gerenciamento de classes CSS
- **clsx & tailwind-merge** - Utilitários CSS

## 🏗️ **Arquitetura do Projeto**

```
src/
├── app/                    # App Router do Next.js
│   ├── (auth)/            # Grupo de rotas de autenticação
│   │   ├── login/         # Página de login
│   │   └── register/      # Página de registro
│   ├── (dashboard)/       # Grupo de rotas do dashboard
│   │   ├── dashboard/     # Dashboard principal
│   │   ├── pdv/          # Ponto de venda
│   │   ├── produtos/     # Gestão de produtos
│   │   ├── clientes/     # Gestão de clientes
│   │   └── vendas/       # Histórico de vendas
│   ├── layout.tsx         # Layout raiz
│   └── page.tsx          # Página inicial (redireciona)
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes base (Button, Input, etc.)
│   ├── Header.tsx        # Cabeçalho do dashboard
│   ├── Sidebar.tsx       # Menu lateral
│   └── LoadingSpinner.tsx # Componente de carregamento
├── contexts/             # Contextos React
│   └── AuthContext.tsx   # Contexto de autenticação
├── lib/                  # Bibliotecas e utilitários
│   ├── database/         # Funções do banco de dados
│   ├── validations/      # Schemas de validação Zod
│   ├── supabase.ts       # Cliente Supabase
│   └── utils.ts          # Funções utilitárias
├── types/                # Definições de tipos TypeScript
├── hooks/                # Custom hooks
└── middleware.ts         # Middleware de autenticação
```

## 🔧 **Configuração e Instalação**

### **Pré-requisitos**
- Node.js 18+
- npm ou yarn
- Conta no Supabase

### **1. Clone o repositório**
```bash
git clone <seu-repositorio>
cd gestao-comercial
```

### **2. Instale as dependências**
```bash
npm install
```

### **3. Configure as variáveis de ambiente**
```bash
# Copie o arquivo de exemplo
cp .env.local.example .env.local

# Configure suas credenciais do Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **4. Configure o banco de dados**
Execute os scripts SQL na seguinte ordem no Supabase:

1. `database/schema.sql` - Estrutura das tabelas
2. `database/functions.sql` - Funções e triggers
3. `database/rls.sql` - Políticas de segurança

### **5. Execute o projeto**
```bash
npm run dev
```

Acesse `http://localhost:3000`

## 🎯 **Funcionalidades Implementadas**

### ✅ **Autenticação**
- [x] Login/Logout
- [x] Registro de usuários
- [x] Middleware de proteção
- [x] Controle de roles
- [x] Recuperação de senha

### ✅ **Dashboard**
- [x] Estatísticas em tempo real
- [x] Vendas recentes
- [x] Produtos em baixo estoque
- [x] Ações rápidas
- [x] Interface responsiva

### ✅ **Interface e UX**
- [x] Design system completo
- [x] Componentes reutilizáveis
- [x] Animações e transições
- [x] Loading states
- [x] Error handling
- [x] Notificações toast

### ✅ **Banco de Dados**
- [x] Schema completo
- [x] Relacionamentos
- [x] Triggers automáticos
- [x] Funções personalizadas
- [x] RLS configurado

## 🚀 **Próximos Passos**

### **Funcionalidades Pendentes**
- [ ] Sistema PDV completo
- [ ] Gestão de produtos (CRUD)
- [ ] Gestão de clientes (CRUD)
- [ ] Histórico de vendas
- [ ] Relatórios e gráficos
- [ ] Exportação de dados
- [ ] Sistema de backup
- [ ] API endpoints
- [ ] Testes automatizados

### **Melhorias Sugeridas**
- [ ] PWA (Progressive Web App)
- [ ] Modo offline
- [ ] Impressão de cupons
- [ ] Integração com APIs de pagamento
- [ ] Sistema de estoque avançado
- [ ] Multi-tenancy
- [ ] Aplicativo mobile

## 📝 **Scripts Disponíveis**

```bash
npm run dev          # Inicia o servidor de desenvolvimento
npm run build        # Faz o build para produção
npm run start        # Inicia o servidor de produção
npm run lint         # Executa o linting
npm run type-check   # Verifica os tipos TypeScript
```

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 **Autores**

- **Sistema de Vendas** - *Desenvolvimento inicial*

## 🙏 **Agradecimentos**

- [Next.js](https://nextjs.org/) - Framework React
- [Supabase](https://supabase.com/) - Backend-as-a-Service
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Lucide](https://lucide.dev/) - Ícones
- [shadcn/ui](https://ui.shadcn.com/) - Inspiração para componentes

---

**Sistema de Vendas - Gestão Comercial** ⚡
*Transformando a gestão do seu negócio*
