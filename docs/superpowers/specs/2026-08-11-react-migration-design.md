# apps/web: Migração para React + TypeScript + Vite + react-router

**Status:** Aprovado para implementação
**Sub-projeto:** 1 de 2 (o sub-projeto 2 — página de Cadastro — depende deste e será desenhado separadamente após esta migração estar implementada)

## Contexto

`apps/web` é hoje um app Vite + TypeScript vanilla (sem framework): componentes seguem atomic design (`atoms/molecules/organisms/templates/pages`), cada um exporta uma factory function (`createButton(props): HTMLButtonElement`) que monta e retorna nós DOM diretamente, estilizados com Tailwind. Existe uma única página (`LoginPage`), renderizada incondicionalmente em `src/main.ts`. Não há router nem dependência de SPA.

Ao planejar a página de Cadastro (Figma node `155:3469`), o usuário pediu para adotar React + react-router para resolver a navegação entre `/login` e `/cadastro`. Essa é uma mudança de stack maior do que a página em si, então foi tratada como um sub-projeto separado: migrar toda a base existente para React primeiro, depois construir o Cadastro em cima dela.

## Objetivo

Migrar `apps/web` de vanilla TS para React 19 + TypeScript + Vite, com `react-router` (v8) cuidando da navegação, preservando o comportamento e a aparência atuais da LoginPage. Nenhum conteúdo novo de produto nesta etapa — é puramente uma migração de stack.

## Fora do escopo

- Conteúdo/implementação da página de Cadastro (sub-projeto 2).
- Chamadas reais de autenticação/backend — os formulários continuam apenas disparando callbacks `onSubmit` fornecidos via props, como hoje.
- Qualquer state management além do estado local de cada formulário.
- Migração de `apps/api` (não é afetada por esta mudança).

## Arquitetura

### Tooling

- **`package.json`**: adiciona dependências `react`, `react-dom`, `react-router`; devDependencies `@types/react`, `@types/react-dom`, `@vitejs/plugin-react`, `@testing-library/react`, `@testing-library/jest-dom`. Mantém `vitest`, `jsdom`, `@testing-library/dom` (dependência transitiva de `@testing-library/react`).
- **`vite.config.ts`**: adiciona o plugin `react()` ao array `plugins`, ao lado do `tailwindcss()` já existente. `test.environment: 'jsdom'` permanece como está.
- **`tsconfig.json`**: adiciona `"jsx": "react-jsx"` a `compilerOptions`. Demais flags (`noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, etc.) permanecem — o código migrado precisa continuar passando nelas.
- **`index.html`**: `<script type="module" src="/src/main.tsx">`; `<title>` passa de `Code Connect | Login` para `Code Connect` (genérico, já que o app passa a servir múltiplas páginas).

### Conversão de componentes

Todos os arquivos abaixo migram de `.ts` para `.tsx`, trocando a factory function por um componente funcional idiomático em PascalCase. Mantém as mesmas pastas (`atoms/molecules/organisms/templates/pages`) e os mesmos nomes de arquivo/diretório (só a extensão muda).

| Camada | Componente | Antes | Depois |
|---|---|---|---|
| atoms | Button | `createButton(props): HTMLButtonElement` | `function Button(props: ButtonProps)` |
| atoms | Checkbox | `createCheckbox(props): HTMLInputElement` | `function Checkbox(props: CheckboxProps)` |
| atoms | Link | `createLink(props): HTMLAnchorElement` | `function Link(props: LinkProps)` |
| atoms | TextInput | `createTextInput(props): HTMLInputElement` | `function TextInput(props: TextInputProps)` |
| molecules | FormField | `createFormField(props): HTMLDivElement` | `function FormField(props: FormFieldProps)` |
| molecules | RememberMeRow | `createRememberMeRow(props): HTMLDivElement` | `function RememberMeRow(props: RememberMeRowProps)` |
| molecules | SocialLoginButton | `createSocialLoginButton(props): HTMLButtonElement` | `function SocialLoginButton(props: SocialLoginButtonProps)` |
| organisms | AuthBanner | `createAuthBanner(props): HTMLDivElement` | `function AuthBanner(props: AuthBannerProps)` |
| organisms | LoginForm | `createLoginForm(props): HTMLFormElement` | `function LoginForm(props: LoginFormProps)` |
| templates | AuthLayout | `createAuthLayout(props): HTMLDivElement` | `function AuthLayout(props: AuthLayoutProps)` |
| pages | LoginPage | `createLoginPage(): HTMLDivElement` | `function LoginPage()` |

Props que hoje recebem um `HTMLElement` pré-montado pelo caller (ex.: `Button.icon`, `Link.icon`) passam a receber `ReactNode`; o caller passa a tag `<img>` (ou outro elemento) diretamente via JSX, em vez de criar o nó DOM manualmente e passá-lo como prop.

Tailwind classNames são preservados como estão (`className="..."`), sem introduzir CSS-in-JS ou outra abordagem de estilo — conforme a convenção do CLAUDE.md.

### Formulário (LoginForm)

Continua **não-controlado**: em vez de ler `input.value` / `checkbox.checked` de referências DOM guardadas em variáveis locais, o handler de `onSubmit` usa `new FormData(event.currentTarget)` (os inputs já têm atributo `name`) para montar o objeto `LoginFormData`. Isso preserva o comportamento atual ("lê os valores só no submit") sem introduzir `useState` por campo, que seria desnecessário já que não há validação/feedback em tempo real hoje.

### Roteamento (`src/main.tsx`)

`createBrowserRouter` + `RouterProvider`, substituindo o `document.querySelector('#app')!.replaceChildren(createLoginPage())` atual:

- `/` → redireciona para `/login` (`<Navigate to="/login" replace />`).
- `/login` → `<LoginPage />`.
- rota catch-all (`*`) / `errorElement` → fallback simples ("Página não encontrada" + link para `/login`).

A rota catch-all existe porque o link "Crie seu cadastro!" em `LoginForm` já aponta para `/cadastro`, que só ganha uma rota de verdade no sub-projeto 2 — sem o catch-all, navegar até lá hoje resultaria em tela em branco.

## Testes

Cada `ComponentName.spec.ts` vira `ComponentName.spec.tsx`, usando `render`/`screen`/`fireEvent` (ou `within`, quando útil) de `@testing-library/react` em vez de instanciar a factory e inspecionar o `HTMLElement` retornado diretamente. Os **casos de teste permanecem os mesmos** (mesmo comportamento coberto — renderização, props default, interações de clique/change) — só o idioma de asserção muda, de manipulação direta de DOM para queries do Testing Library.

## Tratamento de erros

Sem necessidade de Error Boundary neste momento — o escopo é duas rotas estáticas sem fetch de dados assíncrono. O único caso de erro tratado é rota não encontrada, coberto pelo `errorElement`/catch-all do router.

## Critério de conclusão

- `pnpm web:build` (typecheck + build) passa sem erros.
- `pnpm --filter web test` passa, com todos os componentes cobertos tendo testes convertidos (mesma cobertura de casos que hoje).
- Rodando `pnpm web:dev`, `/login` renderiza e se comporta identicamente à versão vanilla atual (visualmente e funcionalmente); `/` redireciona para `/login`; uma rota desconhecida mostra o fallback.
