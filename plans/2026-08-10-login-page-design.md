# Página de Login — Design

## Contexto

`apps/web` é um scaffold Vite + TypeScript puro (sem framework), sem Tailwind e sem test runner configurados ainda. Este design cobre a implementação da página de login usando atomic design, já pensando em reuso para a futura página de cadastro (mesmo layout base, banner e formulário diferentes — cadastro **não** será implementado agora).

Mockup de referência: `Login.png` (fornecido pelo usuário). Assets já disponíveis:
- `apps/web/public/banner-login.png` — banner com logo "code connect" já embutido
- `apps/web/public/github.png`, `apps/web/public/gmail.png` — ícones sociais
- `Ícones/SVG/arrow_forward.svg` — seta do botão "Login →"
- `Ícones/SVG/assignment.svg` — ícone de clipboard em "Crie seu cadastro"

## Stack additions

- **Tailwind CSS** (v4, via `@tailwindcss/vite`) para estilização, substituindo gradualmente `src/style.css`.
- **Vitest + @testing-library/dom + jsdom** como test runner, com scripts `test` / `test:watch` em `apps/web/package.json`. Combina nativamente com Vite.

## Padrão de componente

Cada componente é uma função TS que **retorna um `HTMLElement` real** (ex.: `createLoginForm(): HTMLFormElement`), não uma string de template. Permite anexar listeners diretamente e testar interações (clique, submit, toggle) via DOM real, sem parsing de HTML.

## Estrutura (atomic design, `src/components/`)

- **atoms/**: `Button`, `TextInput`, `Checkbox`, `Link`, `IconButton` (ícones github/gmail)
- **molecules/**: `FormField` (label + input), `SocialLoginButton` (ícone + label, github/gmail), `RememberMeRow` (checkbox + "esqueci a senha")
- **organisms/**: `LoginForm` (email/usuário, senha, remember-me, botão login, divisor "ou entre com outras contas", lista de social buttons, link "crie seu cadastro"), `AuthBanner` (imagem lateral)
- **templates/**: `AuthLayout` — recebe `banner: HTMLElement` + `formContent: HTMLElement`, monta o card de duas colunas com o fundo decorativo (formas de logo translúcidas nos cantos, como no mockup). Layout compartilhado entre login e cadastro.
- **pages/**: `LoginPage` — compõe `AuthLayout` com `AuthBanner(banner-login.png)` + `LoginForm`.

Reuso futuro do cadastro: nova página + novo banner + novo form organism reaproveitando `AuthLayout` sem alterar o layout.

## Ícones

- `github.png` / `gmail.png` (já em `public/`) para os social buttons.
- Copiar `arrow_forward.svg` e `assignment.svg` de `Ícones/SVG/` para `apps/web/src/assets/`, usados na seta do botão "Login" e no ícone de "Crie seu cadastro".

## Comportamento

- Form sem backend ainda: `submit` apenas chama `preventDefault()` (pronto para plugar API depois, sem chamada real).
- Sem client-side router: só a página de login é montada em `main.ts` por enquanto. Link "Crie seu cadastro" aponta para `/cadastro` como placeholder (href sem rota funcional).

## Testes

Cada componente ganha um `.spec.ts` (Vitest) cobrindo renderização e a interação principal, por exemplo:
- `Checkbox` alterna estado ao clicar
- `LoginForm` dispara `submit` sem reload da página
- `SocialLoginButton` dispara `onClick`
