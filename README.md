<div align="center">

# 🛒 Sistema de Gestão Comercial

### Sistema completo de gestão comercial com PDV, controle de estoque, vendas e usuários

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

[📦 Features](#-principais-funcionalidades) • [🚀 Tecnologias](#-tecnologias) • [📥 Instalação](#-instalação) • [📖 Documentação](#-estrutura-do-banco-de-dados) • [🤝 Contribuir](#-contribuindo)

---

</div>

> ### 🎉 **ATUALIZAÇÕES IMPORTANTES**
> 
> #### ✅ Configuração do Supabase Melhorada!
> **✅ Configuração alinhada com o padrão do projeto barbearia**  
> **✅ Deploy na Vercel simplificado - sem integrações complexas**  
> **✅ Apenas 2 variáveis de ambiente necessárias**
>
> #### 🔧 Correção: Edição de Usuários
> Se a edição de usuários não estiver funcionando para Admin/Gerente:
> - [🔧 Guia de Correção](CORRECAO_EDICAO_USUARIOS.md) - Execute o script SQL no Supabase
>
> 📚 **Guias Rápidos:**
> - [⚡ Comandos Rápidos](COMANDOS_RAPIDOS.md) - Execute e pronto!
> - [📝 Mudanças Aplicadas](MUDANCAS_APLICADAS.md) - O que mudou?
> - [🚀 Deploy na Vercel](docs/CONFIGURACAO_VERCEL.md) - Guia completo

---

## 📋 Sobre o Projeto

Sistema web completo para gestão comercial desenvolvido com as mais modernas tecnologias. Projetado para pequenas e médias empresas que precisam de uma solução robusta, escalável e fácil de usar para gerenciar vendas, estoque e equipe.

### 🎯 Objetivo

Fornecer uma plataforma completa que elimine a necessidade de múltiplos sistemas, centralizando:
- ✅ Vendas e PDV
- ✅ Controle de estoque
- ✅ Gestão de produtos
- ✅ Relatórios e métricas
- ✅ Gestão de equipe

### ✨ Principais Funcionalidades

<table>
<tr>
<td width="50%">

#### 🎯 PDV (Ponto de Venda)
- ⚡ Interface rápida e otimizada
- 🔍 Busca por código de barras
- 💰 Múltiplos métodos de pagamento
- 🎁 Descontos e acréscimos
- ⌨️ Atalhos de teclado
- 📱 Layout responsivo
- 🖨️ Impressão de comprovantes

</td>
<td width="50%">

#### 📦 Gestão de Produtos
- ➕ Cadastro completo
- 🏷️ Categorias personalizáveis
- 📊 Estoque em tempo real
- ⚠️ Alertas de estoque baixo
- 📝 Códigos internos e barras
- 💵 Controle de margem
- 🖼️ Imagens de produtos

</td>
</tr>
<tr>
<td width="50%">

#### 📊 Dashboard Analítico
- 📈 Vendas do dia/mês
- 💰 Faturamento diário
- 📦 Total de produtos
- 🎯 Ticket médio
- 📉 Estoque baixo
- 🔥 Vendas recentes
- 📊 Gráficos interativos

</td>
<td width="50%">

#### 👥 Gestão de Usuários
- 🔐 Sistema de permissões (RLS)
- 👤 Perfis personalizados
- 🛡️ Controle de acesso
- ✅ Ativação/desativação
- 📝 Histórico de ações
- 🔑 Senhas seguras

</td>
</tr>
<tr>
<td width="50%">

#### 🛍️ Histórico de Vendas
- 📋 Lista completa
- 🔎 Filtros avançados
- 💳 Métodos de pagamento
- 📄 Detalhamento de itens
- 📅 Período personalizável
- 💾 Exportação de dados

</td>
<td width="50%">

#### 🔒 Segurança
- 🛡️ Row Level Security
- 🔐 Autenticação JWT
- 👁️ Controle de acesso
- 📝 Logs de auditoria
- 🔄 Backup automático
- 🌐 HTTPS obrigatório

</td>
</tr>
</table>

---

## 🚀 Stack Tecnológica

<div align="center">

### Core Technologies

</div>

<table>
<tr>
<td align="center" width="33%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" width="80" height="80" />
<br><strong>Next.js 16</strong>
<br><sub>Framework React</sub>
</td>
<td align="center" width="33%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="80" height="80" />
<br><strong>TypeScript</strong>
<br><sub>Type Safety</sub>
</td>
<td align="center" width="33%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="80" height="80" />
<br><strong>PostgreSQL</strong>
<br><sub>Database</sub>
</td>
</tr>
</table>

### Frontend
```
├── Next.js 16          → Framework React com SSR e App Router
├── TypeScript 5        → Type safety e IntelliSense
├── Tailwind CSS 4      → Utility-first CSS framework
├── Radix UI            → Componentes acessíveis e sem estilo
├── Lucide Icons        → Biblioteca de ícones moderna
├── React Hook Form     → Gerenciamento de formulários
└── Zod                 → Validação de schemas
```

### Backend & Database
```
├── Supabase           → Backend-as-a-Service (BaaS)
├── PostgreSQL         → Banco de dados relacional
├── RLS Policies       → Segurança a nível de linha
├── Database Triggers  → Automações de estoque
├── Edge Functions     → Serverless functions
└── Realtime           → WebSocket para updates
```

### DevOps & Tools
```
├── Git & GitHub       → Controle de versão
├── Vercel             → Deploy e hosting
├── ESLint             → Linting de código
└── Prettier           → Formatação de código
```

---

## 📥 Instalação

### 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18.x ou superior ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **Conta Supabase** gratuita ([Criar conta](https://supabase.com))
- Editor de código (recomendado: [VS Code](https://code.visualstudio.com/))

### Passo a Passo Detalhado

#### **1️⃣ Clone o Repositório**

```bash
# Clone via HTTPS
git clone https://github.com/luishf2014/VendasPro.git

# Ou via SSH
git clone git@github.com:luishf2014/VendasPro.git

# Entre na pasta do projeto
cd VendasPro
```

#### **2️⃣ Instale as Dependências**

```bash
# Usando npm
npm install

# Ou usando yarn
yarn install

# Ou usando pnpm
pnpm install
```

#### **3️⃣ Configure o Supabase**

<details>
<summary><strong>🔧 Criar projeto no Supabase</strong></summary>

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Clique em **"New Project"**
3. Preencha os dados:
   - **Name**: `VendasPro`
   - **Database Password**: Escolha uma senha forte
   - **Region**: Escolha a mais próxima de você
4. Aguarde a criação (leva ~2 minutos)

</details>

#### **4️⃣ Configure as Variáveis de Ambiente**

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica-aqui
```

<details>
<summary><strong>🔑 Onde encontrar as credenciais?</strong></summary>

1. No painel do Supabase, vá em **Settings** (⚙️)
2. Clique em **API**
3. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

</details>

#### **5️⃣ Configure o Banco de Dados**

Execute os scripts SQL no **SQL Editor** do Supabase **nesta ordem**:

```bash
1️⃣ database/schema.sql      # Cria as tabelas
2️⃣ database/functions.sql   # Cria funções e triggers
3️⃣ database/rls.sql          # Aplica políticas de segurança
```

<details>
<summary><strong>📝 Como executar os scripts SQL?</strong></summary>

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em **"+ New query"**
3. Cole o conteúdo do arquivo `database/schema.sql`
4. Clique em **"Run"** (ou pressione `Ctrl + Enter`)
5. Repita para os outros arquivos

</details>

#### **6️⃣ Execute o Projeto**

```bash
# Modo desenvolvimento
npm run dev

# O servidor iniciará em http://localhost:3000
```

#### **7️⃣ Crie o Primeiro Usuário**

Siga as instruções em [👤 Primeiro Acesso](#-primeiro-acesso)

---

### ✅ Verificação da Instalação

Se tudo estiver correto, você deve ver:

- ✅ Página de login em `http://localhost:3000/login`
- ✅ Sem erros no console
- ✅ Conexão com Supabase funcionando

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

## 🔐 Acesso ao Sistema

### ⚠️ Sistema Interno de Empresa

**Este é um sistema de gestão interno** e **não possui registro público**. O acesso é restrito aos colaboradores da empresa.

### 👥 Criação de Usuários

Apenas o **Administrador do Sistema** pode criar, editar e excluir usuários através do painel de gestão em `/dashboard/usuarios`.

**Não é possível:**
- ❌ Fazer registro público
- ❌ Criar conta própria
- ❌ Recuperar senha sem admin
- ❌ Acessar sem credenciais fornecidas

### 🔑 Como Obter Acesso

1. **Solicite ao Administrador** da sua empresa
2. O admin criará seu usuário com:
   - Nome completo
   - Email corporativo
   - Senha temporária
   - Nível de permissão adequado
3. Faça login em `/login` com as credenciais fornecidas
4. Altere sua senha no primeiro acesso (recomendado)

### 📋 Hierarquia de Permissões

| Role | Permissões | Descrição |
|------|-----------|-----------|
| 👑 **Admin** | Acesso total | Gerencia usuários, produtos, vendas e configurações |
| 👔 **Manager** | Gerencial | Cria/edita produtos e usuários, visualiza faturamento |
| 👤 **User** | Operacional | Realiza vendas e consulta produtos |

> 💡 **Para Desenvolvedores**: Se você está instalando o sistema pela primeira vez, o primeiro usuário Admin deve ser criado diretamente no Supabase Dashboard. Consulte a documentação técnica em `docs/SETUP.md` para detalhes.

---

## 📱 Design Responsivo

<div align="center">

| Dispositivo | Resolução | Status |
|------------|-----------|--------|
| 🖥️ Desktop | 1920px+ | ✅ Otimizado |
| 💻 Laptop | 1366px - 1920px | ✅ Otimizado |
| 📱 Tablet | 768px - 1024px | ✅ Otimizado |
| 📱 Mobile | 320px - 767px | ✅ Otimizado |

</div>

### 🎨 Otimizações Implementadas

<table>
<tr>
<td width="50%">

**Mobile First**
- ✅ Layout fluido e adaptável
- ✅ Touch-friendly (48px mínimo)
- ✅ Menu lateral retrátil
- ✅ Navegação por gestos

</td>
<td width="50%">

**Performance**
- ✅ Lazy loading de imagens
- ✅ Code splitting automático
- ✅ Otimização de fontes
- ✅ Cache estratégico

</td>
</tr>
</table>

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
VendasPro/
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

## 🚀 Deploy em Produção

### Vercel (Recomendado) ⭐

<details>
<summary><strong>📦 Deploy com Vercel</strong> (clique para expandir)</summary>

1. **Conecte o GitHub**
   - Acesse [vercel.com](https://vercel.com)
   - Faça login com GitHub
   - Clique em **"New Project"**

2. **Importe o Repositório**
   - Selecione `VendasPro`
   - Clique em **"Import"**

3. **Configure Variáveis de Ambiente**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica
   ```

4. **Deploy**
   - Clique em **"Deploy"**
   - Aguarde 2-3 minutos
   - Seu site estará no ar! 🎉

</details>

### Outras Plataformas

| Plataforma | Dificuldade | Custo | Recomendado Para |
|-----------|-------------|-------|------------------|
| **Vercel** | 🟢 Fácil | Grátis | Produção |
| **Netlify** | 🟢 Fácil | Grátis | Produção |
| **Railway** | 🟡 Médio | Pago | Full-stack |
| **DigitalOcean** | 🔴 Difícil | Pago | Customização |
| **Docker** | 🔴 Difícil | Variável | Auto-hospedagem |

---

## 🔒 Segurança & Privacidade

<div align="center">

### 🛡️ Camadas de Proteção

</div>

<table>
<tr>
<td width="50%">

**Autenticação & Autorização**
- 🔐 JWT Tokens seguros
- 🔑 Senha com hash bcrypt
- 👥 RBAC (Role-Based Access)
- 🚫 Proteção de rotas
- ⏱️ Sessões com timeout

</td>
<td width="50%">

**Banco de Dados**
- 🛡️ Row Level Security (RLS)
- 💉 Proteção SQL Injection
- 📊 Queries parametrizadas
- 🔄 Transactions ACID
- 💾 Backup automático

</td>
</tr>
<tr>
<td width="50%">

**Aplicação**
- ✅ Validação com Zod
- 🌐 HTTPS obrigatório
- 🔒 CORS configurado
- 📝 Sanitização de inputs
- 🎯 CSP Headers

</td>
<td width="50%">

**Auditoria**
- 📋 Logs de ações
- 👁️ Rastreamento de mudanças
- ⚠️ Alertas de segurança
- 📊 Relatórios de acesso
- 🔍 Monitoramento ativo

</td>
</tr>
</table>

### 🔐 Boas Práticas Implementadas

- ✅ Princípio do menor privilégio
- ✅ Autenticação de dois fatores (em desenvolvimento)
- ✅ Rate limiting em APIs
- ✅ Validação de entrada em todas as camadas
- ✅ Logs de auditoria completos

---

## 🐛 Problemas Conhecidos

Consulte a [lista de issues](../../issues) para problemas conhecidos e roadmap.

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

<div align="center">

<img src="https://github.com/luishf2014.png" width="150" style="border-radius: 50%;" alt="Luis Henrique"/>

### **Luis Henrique**

Desenvolvedor Full Stack apaixonado por criar soluções que fazem a diferença.

[![GitHub](https://img.shields.io/badge/GitHub-luishf2014-181717?style=for-the-badge&logo=github)](https://github.com/luishf2014)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Luis_Henrique-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/luis-henrique-mt)
[![Email](https://img.shields.io/badge/Email-Contato-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:luis-henrique_mt@hotmail.com.br)

</div>

---

<div align="center">

### 💼 Outros Projetos

Confira outros projetos no meu [GitHub](https://github.com/luishf2014?tab=repositories)

</div>

---

## 🤝 Contribuindo

Contribuições são **muito bem-vindas**! Este é um projeto open-source e toda ajuda é apreciada.

### 🌟 Como Contribuir

<details>
<summary><strong>🐛 Reportar Bugs</strong></summary>

1. Verifique se o bug já não foi reportado em [Issues](../../issues)
2. Abra uma nova issue com:
   - Título descritivo
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots (se aplicável)
   - Informações do ambiente (SO, navegador, etc)

</details>

<details>
<summary><strong>💡 Sugerir Features</strong></summary>

1. Verifique se a feature já não foi sugerida
2. Abra uma issue com:
   - Título claro
   - Descrição detalhada da feature
   - Por que seria útil
   - Exemplos de uso

</details>

<details>
<summary><strong>🔧 Enviar Pull Request</strong></summary>

```bash
# 1. Fork o projeto
# 2. Clone seu fork
git clone https://github.com/seu-usuario/VendasPro.git

# 3. Crie uma branch
git checkout -b feature/MinhaFeature

# 4. Faça suas alterações e commit
git add .
git commit -m "feat: adiciona MinhaFeature"

# 5. Push para seu fork
git push origin feature/MinhaFeature

# 6. Abra um Pull Request no GitHub
```

</details>

### 📝 Padrões de Código

- ✅ Use TypeScript
- ✅ Siga o ESLint configurado
- ✅ Comente código complexo
- ✅ Escreva commits descritivos
- ✅ Teste antes de enviar

### 🎯 Áreas que Precisam de Ajuda

- [ ] 📱 Melhorias na responsividade
- [ ] 🎨 Temas personalizáveis (dark mode)
- [ ] 📊 Mais relatórios e gráficos
- [ ] 🌍 Internacionalização (i18n)
- [ ] 📄 Documentação
- [ ] 🧪 Testes unitários e E2E

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

```
MIT License - você pode usar, copiar, modificar e distribuir livremente!
```

---

## 🙏 Agradecimentos

<div align="center">

Agradecimentos especiais às tecnologias e comunidades que tornaram este projeto possível:

[![Next.js](https://img.shields.io/badge/Next.js-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-38bdf8?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Radix](https://img.shields.io/badge/Radix_UI-161618?style=flat-square&logo=radix-ui&logoColor=white)](https://www.radix-ui.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

## 📊 Status do Projeto

<div align="center">

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow?style=for-the-badge)
![Versão](https://img.shields.io/badge/Vers%C3%A3o-1.0.0-blue?style=for-the-badge)
![Licença](https://img.shields.io/badge/Licen%C3%A7a-MIT-green?style=for-the-badge)

### 📈 Roadmap

- [x] Sistema de autenticação
- [x] PDV funcional
- [x] Gestão de produtos
- [x] Gestão de usuários
- [x] Dashboard analítico
- [ ] Relatórios avançados
- [ ] Sistema de clientes
- [ ] Gestão de fornecedores
- [ ] Impressão de comprovantes
- [ ] App mobile (React Native)

</div>

---

<div align="center">

## ⭐ Se este projeto foi útil, considere dar uma estrela!

### 💬 Ficou com dúvidas? [Abra uma issue](../../issues/new)

---

**Desenvolvido com ❤️, ☕ e muito 💻**

**[⬆ Voltar ao topo](#-sistema-de-gestão-comercial)**

</div>
