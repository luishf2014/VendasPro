# ⚡ Comandos Rápidos - Aplicar Mudanças

## 🎯 Execute estes comandos para aplicar as mudanças:

### 1️⃣ Instalar Dependências

```bash
cd gestao-comercial
npm install
```

### 2️⃣ Criar Arquivo de Variáveis de Ambiente

**Windows (PowerShell):**
```powershell
@"
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui

# Environment
NODE_ENV=development
"@ | Out-File -FilePath .env.local -Encoding utf8
```

**OU crie manualmente:**
1. Crie um arquivo chamado `.env.local` na pasta `gestao-comercial`
2. Cole o conteúdo:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui

# Environment
NODE_ENV=development
```

3. **IMPORTANTE**: Substitua pelos valores reais do seu projeto!

### 3️⃣ Onde Encontrar as Credenciais

1. Acesse: https://supabase.com/dashboard
2. Abra seu projeto
3. Vá em **Settings** (⚙️) → **API**
4. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4️⃣ Testar Localmente

```bash
npm run dev
```

Acesse: http://localhost:3000

### 5️⃣ Commit e Push (quando estiver funcionando)

```bash
git add .
git commit -m "Atualizar configuração do Supabase"
git push
```

## 🔧 Configurar na Vercel

### Via Interface Web:

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto **gestao-comercial**
3. Clique em **Settings**
4. Clique em **Environment Variables**
5. Adicione cada variável:

| Nome | Valor |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://seu-projeto.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sua-anon-key-aqui` |
| `NODE_ENV` | `production` |

6. Salve e faça redeploy

## ✅ Checklist de Verificação

Execute em ordem e marque cada item:

- [ ] 1. Instalei as dependências (`npm install`)
- [ ] 2. Criei o arquivo `.env.local`
- [ ] 3. Peguei as credenciais no Supabase
- [ ] 4. Coloquei as credenciais no `.env.local`
- [ ] 5. Testei localmente (`npm run dev`)
- [ ] 6. Login funciona localmente
- [ ] 7. Dashboard carrega corretamente
- [ ] 8. Configurei as variáveis na Vercel
- [ ] 9. Fiz commit e push
- [ ] 10. Deploy na Vercel concluído
- [ ] 11. Testei na URL de produção

## 🆘 Problemas Comuns

### ❌ Erro: "Module not found"
**Solução:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### ❌ Erro: "NEXT_PUBLIC_SUPABASE_URL é obrigatório"
**Solução:**
- Verifique se o arquivo `.env.local` está na raiz do projeto
- Verifique se não tem espaços extras nas variáveis
- Reinicie o servidor (`Ctrl+C` e depois `npm run dev`)

### ❌ Login não funciona na Vercel
**Solução:**
1. Verifique se as variáveis foram adicionadas na Vercel
2. Faça um redeploy
3. Limpe os cookies do navegador

## 📱 Precisa de Ajuda?

Consulte os documentos:
- `MUDANCAS_APLICADAS.md` - Resumo das mudanças
- `docs/CONFIGURACAO_VERCEL.md` - Guia completo de deploy
- `docs/ATUALIZACAO_SUPABASE.md` - Detalhes técnicos

---

**Pronto! Siga estes passos e tudo deve funcionar! 🚀**

