# Página de Cadastro (Figma node 155:3469)

**Status:** Aprovado para implementação
**Sub-projeto:** 2 de 2 (depende da migração para React, sub-projeto 1, já implementada em `feat/react-migration`)

## Contexto

`apps/web` já foi migrado para React 19 + TypeScript + Vite + `react-router` (ver `docs/superpowers/specs/2026-08-11-react-migration-design.md`). A LoginPage existe em `apps/web/src/components/pages/LoginPage/`, com rota `/login`, e já contém um link "Crie seu cadastro!" apontando para `/cadastro` — rota que hoje cai no catch-all (`NotFound`).

Este spec cobre a implementação da página de Cadastro em si, a partir do design no Figma (node `155:3469`, arquivo `ry6eAbEIt1yiMr80e6ReX0`). A tela reaproveita a mesma estrutura de card/banner da LoginPage (o frame no Figma inclusive herda `data-name="Login"` no nó raiz), trocando conteúdo do formulário, imagem do banner e alguns detalhes de estilo.

## Objetivo

Implementar `/cadastro` como uma segunda rota completa, reaproveitando ao máximo os átomos/moléculas/templates já existentes, com ajustes finos nos átomos compartilhados onde o Figma especifica tokens diferentes dos já implementados na LoginPage.

## Fora do escopo

- Autenticação/backend real — `CadastroForm` só dispara `onSubmit`/`onGithubLogin`/`onGmailLogin` via props, como o `LoginForm`.
- Validação de campos (formato de email, força de senha, confirmação de senha) — não está no Figma nem foi pedido.
- Qualquer mudança de state management além do padrão não-controlado já usado no `LoginForm`.

## Arquitetura

### Componentes novos

- **`apps/web/src/components/organisms/CadastroForm/CadastroForm.tsx`**: espelha a estrutura do `LoginForm` (`apps/web/src/components/organisms/LoginForm/LoginForm.tsx`) — mesmo padrão de form não-controlado, `FormData` no submit, mesma composição de heading/campos/checkbox/botão/divisor/social/prompt final. Conteúdo específico do Cadastro:
  - Heading: "Cadastro" / "Olá! Preencha seus dados."
  - Campo "Nome" (`TextInput id="name" name="name" placeholder="Nome completo" autoComplete="name"`), via `FormField label="Nome"`.
  - Campo "Email" (`TextInput id="email" name="email" type="email" placeholder="Digite seu email" autoComplete="email"`), via `FormField label="Email"`.
  - Campo "Senha" (`TextInput id="password" name="password" type="password" placeholder="******" autoComplete="new-password"`), via `FormField label="Senha"`. `autoComplete="new-password"` (não `current-password`, já que é cadastro).
  - `RememberMeRow checkboxId="remember-me" checkbox={<Checkbox id="remember-me" name="rememberMe" checked />} checkboxLabel="Lembrar-me"` — **sem** `forgotPasswordHref` (ver mudança de API abaixo).
  - Botão "Cadastrar", `type="submit"`, reaproveitando o mesmo ícone `arrow-forward.svg` já usado no botão "Login".
  - Divisor "ou entre com outras contas" — mesmo markup do `LoginForm` (duas `<span>` de linha + texto central).
  - `SocialLoginButton` Github/Gmail — mesmos `iconSrc`/`alt`/`label` do `LoginForm`, callbacks `onGithubLogin`/`onGmailLogin` repassados.
  - Prompt final: "Já tem conta? " + `Link label="Faça seu login!" href="/login" icon={<img src={loginIcon} .../>}`, usando o novo `src/assets/login.svg`.

  ```ts
  export interface CadastroFormData {
    name: string
    email: string
    password: string
    rememberMe: boolean
  }

  export interface CadastroFormProps {
    onSubmit?: (data: CadastroFormData) => void
    onGithubLogin?: () => void
    onGmailLogin?: () => void
  }
  ```

  O `handleSubmit` segue o mesmo padrão do `LoginForm`: `new FormData(event.currentTarget)`, `formData.has('rememberMe')` para o checkbox, `String(formData.get(...) ?? '')` para os campos de texto.

- **`apps/web/src/components/pages/CadastroPage/CadastroPage.tsx`**: espelha `LoginPage.tsx` — compõe `AuthLayout` com `banner={<AuthBanner src="/banner-cadastro.png" alt="Ilustração de cadastro na plataforma Code Connect" />}` e `formContent={<CadastroForm />}`.

### Assets novos (já baixados/criados nesta sessão)

- **`apps/web/public/banner-cadastro.png`**: imagem do banner exportada do Figma (node `155:3470`/`155:3498` region), já baixada.
- **`apps/web/src/assets/login.svg`**: ícone "login" (Material Symbols, glifo padrão), no mesmo formato dos ícones existentes (`arrow-forward.svg`, `assignment.svg` — SVG 24×24, `fill="#81FE88"`), já criado.

### Ajustes finos em átomos compartilhados

O Figma do Cadastro especifica tokens de campo diferentes do que `TextInput`/`FormField` implementam hoje. Como o card do Cadastro deriva do mesmo frame do Login, presume-se que o Login também deveria seguir esses tokens — a mudança abaixo é aplicada nos componentes compartilhados e vale para as duas páginas:

- **`apps/web/src/components/atoms/TextInput/TextInput.tsx`**: `className` passa de
  `"w-full rounded-lg bg-neutral-200/90 px-4 py-3 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-400"`
  para
  `"w-full rounded bg-[#888888] px-4 py-2 text-[15px] text-[#171d1f] placeholder:text-[#171d1f] focus:outline-none focus:ring-2 focus:ring-green-400"`.
- **`apps/web/src/components/molecules/FormField/FormField.tsx`**: label `className` passa de `"text-sm text-neutral-200"` para `"text-lg text-neutral-200"` (18px, batendo com o token "Paragraph" do Figma).

Nenhuma outra cor/token (card, botão, checkbox) é alterada nesta etapa — ficam fora do escopo desta mudança pontual.

### Mudança de API: RememberMeRow

**`apps/web/src/components/molecules/RememberMeRow/RememberMeRow.tsx`**: `forgotPasswordHref` passa de obrigatório para opcional (`forgotPasswordHref?: string`). O `<Link label="Esqueci a senha" .../>` só é renderizado quando a prop é passada. `LoginForm` continua passando `forgotPasswordHref="/recuperar-senha"` (comportamento inalterado); `CadastroForm` não passa a prop, renderizando só checkbox + label, como no Figma do Cadastro.

### Roteamento

**`apps/web/src/main.tsx`**: adiciona uma rota entre `/login` e o catch-all:

```tsx
{ path: '/cadastro', element: <CadastroPage /> },
```

`/` continua redirecionando para `/login`; o catch-all (`*` → `NotFound`) continua cobrindo qualquer outro path.

## Testes

- **`CadastroForm.spec.tsx`**: espelha `LoginForm.spec.tsx` — (1) renderiza campos nome/email/senha, checkbox marcado por padrão, botão "Cadastrar"; (2) submit coleta `name`/`email`/`password`/`rememberMe` via `FormData` e chama `onSubmit`, sem navegar; (3) cliques nos botões sociais chamam `onGithubLogin`/`onGmailLogin`.
- **`CadastroPage.spec.tsx`**: espelha `LoginPage.spec.tsx` — renderiza o banner (`img[alt*="Code Connect"]`), o `<form>`, e o heading "Cadastro".
- **`RememberMeRow.spec.tsx`**: ganha um novo caso — renderizado sem `forgotPasswordHref`, não deve haver nenhum `<a>` na árvore, mas o checkbox e o label continuam presentes. O caso existente (com `forgotPasswordHref`) permanece inalterado.
- **`TextInput.spec.tsx`** / **`FormField.spec.tsx`**: não fazem asserção sobre `className`, então continuam válidos sem alteração após o ajuste de estilo.

## Critério de conclusão

- `pnpm web:build` (typecheck + build) passa sem erros.
- `pnpm --filter web test` passa, incluindo os specs novos e o caso novo de `RememberMeRow`.
- Rodando `pnpm web:dev`: `/cadastro` renderiza o formulário completo batendo visualmente com o Figma (banner, campos, checkbox sem link, botão, social, prompt de volta ao login); `/login` continua funcionando, agora com os campos no novo estilo (fundo `#888888`, label maior); o link "Crie seu cadastro!" no Login leva a `/cadastro`, e "Faça seu login!" no Cadastro leva de volta a `/login`.
