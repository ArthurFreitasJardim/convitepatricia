# Paty — 50 Carnavais | Site de convite (V5)

Projeto Next.js + TypeScript + Supabase para aniversário de 50 anos, sábado **13/02/2027**, no Bellara Recepções em Belo Horizonte.

## O que já funciona

- Site com fundo preto uniforme, logo original otimizado, data, mensagem e galeria do Bellara.
- Busca de convite pelo **título**: ex. `Fernando e família`.
- Link único por convite, com a lista das pessoas já preenchida.
- Cada pessoa responde presença e, se for, escolhe modelo/tamanho do abadá.
- Guia de medidas da camiseta recolhível.
- Admin protegido por senha: cria convites, indica título e nomes, copia/compartilha links, abre cada grupo para ver respostas, exclui convites e mostra totais por modelo e tamanho.
- Respostas salvas no Supabase já existente.

## Instalação no Windows / VS Code

1. Faça uma cópia da pasta do projeto anterior (backup).
2. Copie **todos os arquivos desta V5** para a pasta do seu repositório, substituindo os antigos. Mantenha o `.git` da pasta atual.
3. **Guarde o `.env.local` que você já configurou.** Ele não acompanha o ZIP (por segurança).
4. Coloque suas duas fontes originais em `public/fonts/` com os nomes exatos:
   - `bela-yasmine.otf`
   - `gabriola.ttf`
   O ZIP **não redistribui arquivos de fonte**; use os arquivos que você já possui.
5. Abra seu projeto no Supabase > **SQL Editor**, execute **somente** `supabase/002_titulo_convites.sql` para atualizar o banco V4 já existente. **Não apague as tabelas!** Se for um projeto Supabase totalmente novo, execute primeiro `001_convites.sql` e depois `002_titulo_convites.sql`.
6. No terminal PowerShell, execute:

   ```powershell
   npm install
   npm run dev
   ```

7. Abra `http://localhost:3000` (convite) e `http://localhost:3000/admin` (painel).

### Variáveis de ambiente

O `.env.local` na raiz precisa conter:

```dotenv
SUPABASE_URL=https://SEU-PROJETO.supabase.co
SUPABASE_SECRET_KEY=sb_secret_SUA_CHAVE_PRIVADA
ADMIN_PASSWORD=SUA_SENHA_FORTE_COM_12_OU_MAIS_CARACTERES
ADMIN_SESSION_SECRET=SEGREDO_ALEATORIO_COM_32_OU_MAIS_CARACTERES
```

Se ainda não tem um segredo de sessão, gere no PowerShell:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Reinicie `npm run dev` sempre que alterar `.env.local`.

## Teste prático

1. `/admin`: entre com sua senha do `.env.local`.
2. Clique **Criar novo convite**.
3. Título: `Fernando e família`; 3 pessoas: Fernando, Ana e Luiza.
4. Copie o link do grupo.
5. Na home, escreva `Fernando` no campo de busca. O título cadastrado deve aparecer.
6. Abra o convite e responda cada pessoa, escolhendo modelos e tamanhos.
7. Volte ao admin, clique em **Atualizar** e no título `Fernando e família`.
8. Verifique as escolhas individuais e a soma dos abadás por modelo/tamanho.

## Fotos do Bellara

As três fotos em `data/site.ts` são links externos de apresentação do **Bellara Recepções** disponíveis em Casamentos.com.br. Não são arquivos da festa e podem não carregar se o site de origem restringir acesso. **Antes de publicar, obtenha autorização e substitua pelas fotos oficiais que a casa de festas fornecer.** Você pode colocar fotos próprias em `public/images/` e alterar `src` no `data/site.ts` para caminhos como `/images/bellara-01.jpg`.

Local confirmado em páginas públicas do Bellara: Avenida Portugal, 750 — região de Santa Amélia, Belo Horizonte. O horário da festa permanece **a confirmar**.

## Segurança e limitações

- A chave `SUPABASE_SECRET_KEY` nunca aparece no navegador. Somente APIs do servidor usam essa credencial.
- O painel usa uma única senha; o cookie é assinado e `httpOnly`.
- A busca pública revela **títulos de convites** e permite abrir o grupo escolhido; isso facilita confirmar presença como no site de referência, mas não oferece privacidade forte para nomes de familiares. Para maior privacidade, use apenas links individuais aleatórios e desative a busca pública.
- O rate limit do login é **básico em memória**. Antes de uma publicação aberta, recomendamos limite persistente (ex.: serviço de borda/CAPTCHA) e revisão de segurança.
- Não há horário definido; edite `data/site.ts` quando a organização confirmar.
- Não compartilhe seu `.env.local` e não faça commit de senhas ou chaves.
- Caso a tela mostre 404 ao efetuar login, confira `app/api/admin/login/route.ts` e se o projeto foi aberto na raiz certa.

## Deploy Vercel

No painel Vercel, configure as mesmas quatro variáveis de `.env.local` em Settings > Environment Variables; nunca use prefixo `NEXT_PUBLIC_` para a Secret Key. Configure o domínio depois.
