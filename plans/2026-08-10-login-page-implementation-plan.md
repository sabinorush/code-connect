# Login Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the login page (`apps/web`) using atomic design, backed by Tailwind CSS and a Vitest test suite, following `plans/2026-08-10-login-page-design.md`.

**Architecture:** Components are TypeScript functions that build and return real `HTMLElement`s (no template strings, no framework). They're organized as atoms → molecules → organisms → templates → pages under `src/components/`, colocated with `.spec.ts` tests. `AuthLayout` (template) is generic over its banner/form content so the future signup page can reuse it.

**Tech Stack:** Vite + TypeScript (existing), Tailwind CSS v4 (`@tailwindcss/vite`), Vitest + jsdom + `@testing-library/dom`.

## Global Constraints

- Conventional Commits for every commit (`feat(web): ...`, `test(web): ...`, `chore(web): ...`).
- Styling via Tailwind utility classes only — no new CSS files, no CSS-in-JS.
- Folder layout: `src/components/{atoms,molecules,organisms,templates,pages}`, one component per folder, `.ts` implementation + colocated `.spec.ts`.
- Every component ships with a test covering render + its core interaction, in the same task as the component.
- Components return real `HTMLElement`s built via `document.createElement`/`append` — never `innerHTML` with dynamic content.
- Install packages with `pnpm --filter web add ...` run from the repo root (not `cd apps/web`), per the monorepo's hoisting convention.
- No client-side router yet: only `LoginPage` is mounted from `main.ts`. "Crie seu cadastro" is a placeholder link (`href="/cadastro"`), not a working route.
- `LoginForm` has no backend call: `submit` only calls `event.preventDefault()` and an optional `onSubmit` callback with the form values.

---

### Task 1: Tooling — Tailwind CSS + Vitest

**Files:**
- Create: `apps/web/vite.config.ts`
- Modify: `apps/web/src/style.css`
- Modify: `apps/web/package.json`
- Modify: `package.json` (root)

**Interfaces:**
- Produces: `pnpm --filter web test` (Vitest, jsdom environment), Tailwind utilities available in any `.ts` file via `className`/`class`.

- [ ] **Step 1: Install dependencies**

Run from repo root:
```bash
pnpm --filter web add -D tailwindcss @tailwindcss/vite vitest jsdom @testing-library/dom
```

- [ ] **Step 2: Create `apps/web/vite.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
  test: {
    environment: 'jsdom',
  },
})
```

- [ ] **Step 3: Replace `apps/web/src/style.css` entirely**

```css
@import "tailwindcss";
```

- [ ] **Step 4: Add test scripts to `apps/web/package.json`**

In the `"scripts"` block, add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Add a root passthrough script**

In the root `package.json` `"scripts"` block, add (after `"web:preview"`):
```json
"web:test": "pnpm --filter web test",
```

- [ ] **Step 6: Verify the setup**

Run: `pnpm --filter web test`
Expected: Vitest starts, reports "No test files found" (or exits 0) — confirms jsdom + config load without errors.

Run: `pnpm --filter web build`
Expected: `tsc` + `vite build` succeed (confirms the Tailwind Vite plugin loads correctly). Note: this will still bundle the old scaffold `main.ts` — that's expected until Task 13.

- [ ] **Step 7: Commit**

```bash
git add apps/web/vite.config.ts apps/web/src/style.css apps/web/package.json package.json pnpm-lock.yaml
git commit -m "chore(web): add tailwind css and vitest"
```

---

### Task 2: Atom — Button

**Files:**
- Create: `apps/web/src/components/atoms/Button/Button.ts`
- Create: `apps/web/src/components/atoms/Button/Button.spec.ts`

**Interfaces:**
- Produces: `createButton(props: ButtonProps): HTMLButtonElement`, `ButtonProps { label: string; type?: 'button' | 'submit'; icon?: HTMLElement; onClick?: () => void }`

- [ ] **Step 1: Write the failing test**

```ts
// apps/web/src/components/atoms/Button/Button.spec.ts
import { describe, expect, it, vi } from 'vitest'
import { createButton } from './Button'

describe('createButton', () => {
  it('renders the given label and respects the type prop', () => {
    const button = createButton({ label: 'Login', type: 'submit' })

    expect(button.tagName).toBe('BUTTON')
    expect(button.type).toBe('submit')
    expect(button.textContent).toContain('Login')
  })

  it('defaults to type "button"', () => {
    const button = createButton({ label: 'Login' })

    expect(button.type).toBe('button')
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    const button = createButton({ label: 'Login', onClick })

    button.click()

    expect(onClick).toHaveBeenCalledOnce()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter web test -- Button`
Expected: FAIL with "Cannot find module './Button'"

- [ ] **Step 3: Write the implementation**

```ts
// apps/web/src/components/atoms/Button/Button.ts
export interface ButtonProps {
  label: string
  type?: 'button' | 'submit'
  icon?: HTMLElement
  onClick?: () => void
}

export function createButton(props: ButtonProps): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = props.type ?? 'button'
  button.className =
    'flex w-full items-center justify-center gap-2 rounded-lg bg-green-400 px-4 py-3 font-semibold text-neutral-950 transition-colors hover:bg-green-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400'

  const label = document.createElement('span')
  label.textContent = props.label
  button.append(label)

  if (props.icon) {
    button.append(props.icon)
  }

  if (props.onClick) {
    button.addEventListener('click', props.onClick)
  }

  return button
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter web test -- Button`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/atoms/Button
git commit -m "feat(web): add Button atom"
```

---

### Task 3: Atom — TextInput

**Files:**
- Create: `apps/web/src/components/atoms/TextInput/TextInput.ts`
- Create: `apps/web/src/components/atoms/TextInput/TextInput.spec.ts`

**Interfaces:**
- Produces: `createTextInput(props: TextInputProps): HTMLInputElement`, `TextInputProps { id: string; name: string; type?: string; placeholder?: string; autoComplete?: string }`

- [ ] **Step 1: Write the failing test**

```ts
// apps/web/src/components/atoms/TextInput/TextInput.spec.ts
import { describe, expect, it } from 'vitest'
import { createTextInput } from './TextInput'

describe('createTextInput', () => {
  it('renders an input with the given id, name and placeholder', () => {
    const input = createTextInput({ id: 'identifier', name: 'identifier', placeholder: 'usuario123' })

    expect(input.tagName).toBe('INPUT')
    expect(input.id).toBe('identifier')
    expect(input.name).toBe('identifier')
    expect(input.placeholder).toBe('usuario123')
    expect(input.type).toBe('text')
  })

  it('respects a custom type and autoComplete', () => {
    const input = createTextInput({ id: 'password', name: 'password', type: 'password', autoComplete: 'current-password' })

    expect(input.type).toBe('password')
    expect(input.autocomplete).toBe('current-password')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter web test -- TextInput`
Expected: FAIL with "Cannot find module './TextInput'"

- [ ] **Step 3: Write the implementation**

```ts
// apps/web/src/components/atoms/TextInput/TextInput.ts
export interface TextInputProps {
  id: string
  name: string
  type?: string
  placeholder?: string
  autoComplete?: string
}

export function createTextInput(props: TextInputProps): HTMLInputElement {
  const input = document.createElement('input')
  input.id = props.id
  input.name = props.name
  input.type = props.type ?? 'text'
  if (props.placeholder) input.placeholder = props.placeholder
  if (props.autoComplete) input.autocomplete = props.autoComplete
  input.className =
    'w-full rounded-lg bg-neutral-200/90 px-4 py-3 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-green-400'

  return input
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter web test -- TextInput`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/atoms/TextInput
git commit -m "feat(web): add TextInput atom"
```

---

### Task 4: Atom — Checkbox

**Files:**
- Create: `apps/web/src/components/atoms/Checkbox/Checkbox.ts`
- Create: `apps/web/src/components/atoms/Checkbox/Checkbox.spec.ts`

**Interfaces:**
- Produces: `createCheckbox(props: CheckboxProps): HTMLInputElement`, `CheckboxProps { id: string; name: string; checked?: boolean; onChange?: (checked: boolean) => void }`

- [ ] **Step 1: Write the failing test**

```ts
// apps/web/src/components/atoms/Checkbox/Checkbox.spec.ts
import { describe, expect, it, vi } from 'vitest'
import { createCheckbox } from './Checkbox'

describe('createCheckbox', () => {
  it('defaults to unchecked', () => {
    const checkbox = createCheckbox({ id: 'remember-me', name: 'rememberMe' })

    expect(checkbox.type).toBe('checkbox')
    expect(checkbox.checked).toBe(false)
  })

  it('respects the initial checked value', () => {
    const checkbox = createCheckbox({ id: 'remember-me', name: 'rememberMe', checked: true })

    expect(checkbox.checked).toBe(true)
  })

  it('calls onChange with the new checked state when toggled', () => {
    const onChange = vi.fn()
    const checkbox = createCheckbox({ id: 'remember-me', name: 'rememberMe', onChange })

    checkbox.click()

    expect(onChange).toHaveBeenCalledWith(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter web test -- Checkbox`
Expected: FAIL with "Cannot find module './Checkbox'"

- [ ] **Step 3: Write the implementation**

```ts
// apps/web/src/components/atoms/Checkbox/Checkbox.ts
export interface CheckboxProps {
  id: string
  name: string
  checked?: boolean
  onChange?: (checked: boolean) => void
}

export function createCheckbox(props: CheckboxProps): HTMLInputElement {
  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.id = props.id
  checkbox.name = props.name
  checkbox.checked = props.checked ?? false
  checkbox.className =
    'h-4 w-4 rounded border-neutral-500 bg-neutral-200 accent-green-400 focus:ring-2 focus:ring-green-400'

  if (props.onChange) {
    const onChange = props.onChange
    checkbox.addEventListener('change', () => onChange(checkbox.checked))
  }

  return checkbox
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter web test -- Checkbox`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/atoms/Checkbox
git commit -m "feat(web): add Checkbox atom"
```

---

### Task 5: Atom — Link

**Files:**
- Create: `apps/web/src/components/atoms/Link/Link.ts`
- Create: `apps/web/src/components/atoms/Link/Link.spec.ts`

**Interfaces:**
- Produces: `createLink(props: LinkProps): HTMLAnchorElement`, `LinkProps { label: string; href: string; icon?: HTMLElement }`

- [ ] **Step 1: Write the failing test**

```ts
// apps/web/src/components/atoms/Link/Link.spec.ts
import { describe, expect, it } from 'vitest'
import { createLink } from './Link'

describe('createLink', () => {
  it('renders an anchor with the given label and href', () => {
    const link = createLink({ label: 'Esqueci a senha', href: '/recuperar-senha' })

    expect(link.tagName).toBe('A')
    expect(link.getAttribute('href')).toBe('/recuperar-senha')
    expect(link.textContent).toContain('Esqueci a senha')
  })

  it('appends an optional trailing icon', () => {
    const icon = document.createElement('img')
    icon.alt = 'icon'
    const link = createLink({ label: 'Crie seu cadastro!', href: '/cadastro', icon })

    expect(link.contains(icon)).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter web test -- Link`
Expected: FAIL with "Cannot find module './Link'"

- [ ] **Step 3: Write the implementation**

```ts
// apps/web/src/components/atoms/Link/Link.ts
export interface LinkProps {
  label: string
  href: string
  icon?: HTMLElement
}

export function createLink(props: LinkProps): HTMLAnchorElement {
  const link = document.createElement('a')
  link.href = props.href
  link.className = 'inline-flex items-center gap-1 text-green-400 hover:text-green-300 hover:underline'

  const label = document.createElement('span')
  label.textContent = props.label
  link.append(label)

  if (props.icon) {
    link.append(props.icon)
  }

  return link
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter web test -- Link`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/atoms/Link
git commit -m "feat(web): add Link atom"
```

---

### Task 6: Molecule — FormField

**Files:**
- Create: `apps/web/src/components/molecules/FormField/FormField.ts`
- Create: `apps/web/src/components/molecules/FormField/FormField.spec.ts`

**Interfaces:**
- Consumes: `createTextInput` from Task 3 (only in the test, to build a real input)
- Produces: `createFormField(props: FormFieldProps): HTMLDivElement`, `FormFieldProps { label: string; input: HTMLInputElement }`

- [ ] **Step 1: Write the failing test**

```ts
// apps/web/src/components/molecules/FormField/FormField.spec.ts
import { describe, expect, it } from 'vitest'
import { createFormField } from './FormField'
import { createTextInput } from '../../atoms/TextInput/TextInput'

describe('createFormField', () => {
  it('renders a label wired to the input via htmlFor/id and contains the input', () => {
    const input = createTextInput({ id: 'identifier', name: 'identifier' })
    const field = createFormField({ label: 'Email ou usuário', input })

    const label = field.querySelector('label')!
    expect(label.textContent).toBe('Email ou usuário')
    expect(label.htmlFor).toBe('identifier')
    expect(field.contains(input)).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter web test -- FormField`
Expected: FAIL with "Cannot find module './FormField'"

- [ ] **Step 3: Write the implementation**

```ts
// apps/web/src/components/molecules/FormField/FormField.ts
export interface FormFieldProps {
  label: string
  input: HTMLInputElement
}

export function createFormField(props: FormFieldProps): HTMLDivElement {
  const field = document.createElement('div')
  field.className = 'flex flex-col gap-2'

  const label = document.createElement('label')
  label.htmlFor = props.input.id
  label.textContent = props.label
  label.className = 'text-sm text-neutral-200'

  field.append(label, props.input)

  return field
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter web test -- FormField`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/molecules/FormField
git commit -m "feat(web): add FormField molecule"
```

---

### Task 7: Molecule — SocialLoginButton

**Files:**
- Create: `apps/web/src/components/molecules/SocialLoginButton/SocialLoginButton.ts`
- Create: `apps/web/src/components/molecules/SocialLoginButton/SocialLoginButton.spec.ts`

**Interfaces:**
- Produces: `createSocialLoginButton(props: SocialLoginButtonProps): HTMLButtonElement`, `SocialLoginButtonProps { iconSrc: string; alt: string; label: string; onClick?: () => void }`

- [ ] **Step 1: Write the failing test**

```ts
// apps/web/src/components/molecules/SocialLoginButton/SocialLoginButton.spec.ts
import { describe, expect, it, vi } from 'vitest'
import { createSocialLoginButton } from './SocialLoginButton'

describe('createSocialLoginButton', () => {
  it('renders the icon and label', () => {
    const button = createSocialLoginButton({ iconSrc: '/github.png', alt: 'GitHub', label: 'Github' })

    const img = button.querySelector('img')!
    expect(img.src).toContain('/github.png')
    expect(img.alt).toBe('GitHub')
    expect(button.textContent).toContain('Github')
    expect(button.type).toBe('button')
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    const button = createSocialLoginButton({ iconSrc: '/gmail.png', alt: 'Gmail', label: 'Gmail', onClick })

    button.click()

    expect(onClick).toHaveBeenCalledOnce()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter web test -- SocialLoginButton`
Expected: FAIL with "Cannot find module './SocialLoginButton'"

- [ ] **Step 3: Write the implementation**

```ts
// apps/web/src/components/molecules/SocialLoginButton/SocialLoginButton.ts
export interface SocialLoginButtonProps {
  iconSrc: string
  alt: string
  label: string
  onClick?: () => void
}

export function createSocialLoginButton(props: SocialLoginButtonProps): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'flex flex-col items-center gap-2 text-sm text-neutral-300 transition-opacity hover:opacity-80'

  const icon = document.createElement('img')
  icon.src = props.iconSrc
  icon.alt = props.alt
  icon.className = 'h-8 w-8'

  const label = document.createElement('span')
  label.textContent = props.label

  button.append(icon, label)

  if (props.onClick) {
    button.addEventListener('click', props.onClick)
  }

  return button
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter web test -- SocialLoginButton`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/molecules/SocialLoginButton
git commit -m "feat(web): add SocialLoginButton molecule"
```

---

### Task 8: Molecule — RememberMeRow

**Files:**
- Create: `apps/web/src/components/molecules/RememberMeRow/RememberMeRow.ts`
- Create: `apps/web/src/components/molecules/RememberMeRow/RememberMeRow.spec.ts`

**Interfaces:**
- Consumes: `createLink` from Task 5 (`LinkProps { label, href, icon? }` → `HTMLAnchorElement`); `createCheckbox` from Task 4 (only in the test)
- Produces: `createRememberMeRow(props: RememberMeRowProps): HTMLDivElement`, `RememberMeRowProps { checkbox: HTMLInputElement; checkboxLabel: string; forgotPasswordHref: string }`

- [ ] **Step 1: Write the failing test**

```ts
// apps/web/src/components/molecules/RememberMeRow/RememberMeRow.spec.ts
import { describe, expect, it } from 'vitest'
import { createRememberMeRow } from './RememberMeRow'
import { createCheckbox } from '../../atoms/Checkbox/Checkbox'

describe('createRememberMeRow', () => {
  it('renders the checkbox with its label and the forgot-password link', () => {
    const checkbox = createCheckbox({ id: 'remember-me', name: 'rememberMe', checked: true })
    const row = createRememberMeRow({
      checkbox,
      checkboxLabel: 'Lembrar-me',
      forgotPasswordHref: '/recuperar-senha',
    })

    expect(row.contains(checkbox)).toBe(true)
    expect(row.textContent).toContain('Lembrar-me')

    const link = row.querySelector('a')!
    expect(link.textContent).toContain('Esqueci a senha')
    expect(link.getAttribute('href')).toBe('/recuperar-senha')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter web test -- RememberMeRow`
Expected: FAIL with "Cannot find module './RememberMeRow'"

- [ ] **Step 3: Write the implementation**

```ts
// apps/web/src/components/molecules/RememberMeRow/RememberMeRow.ts
import { createLink } from '../../atoms/Link/Link'

export interface RememberMeRowProps {
  checkbox: HTMLInputElement
  checkboxLabel: string
  forgotPasswordHref: string
}

export function createRememberMeRow(props: RememberMeRowProps): HTMLDivElement {
  const row = document.createElement('div')
  row.className = 'flex items-center justify-between text-sm'

  const checkboxWrapper = document.createElement('label')
  checkboxWrapper.className = 'flex items-center gap-2 text-neutral-200'
  checkboxWrapper.htmlFor = props.checkbox.id

  const checkboxLabel = document.createElement('span')
  checkboxLabel.textContent = props.checkboxLabel

  checkboxWrapper.append(props.checkbox, checkboxLabel)

  const forgotPasswordLink = createLink({ label: 'Esqueci a senha', href: props.forgotPasswordHref })

  row.append(checkboxWrapper, forgotPasswordLink)

  return row
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter web test -- RememberMeRow`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/molecules/RememberMeRow
git commit -m "feat(web): add RememberMeRow molecule"
```

---

### Task 9: Organism — AuthBanner

**Files:**
- Create: `apps/web/src/components/organisms/AuthBanner/AuthBanner.ts`
- Create: `apps/web/src/components/organisms/AuthBanner/AuthBanner.spec.ts`

**Interfaces:**
- Produces: `createAuthBanner(props: AuthBannerProps): HTMLDivElement`, `AuthBannerProps { src: string; alt: string }`

- [ ] **Step 1: Write the failing test**

```ts
// apps/web/src/components/organisms/AuthBanner/AuthBanner.spec.ts
import { describe, expect, it } from 'vitest'
import { createAuthBanner } from './AuthBanner'

describe('createAuthBanner', () => {
  it('renders the banner image with the given src and alt', () => {
    const banner = createAuthBanner({ src: '/banner-login.png', alt: 'Login banner' })

    const img = banner.querySelector('img')!
    expect(img.src).toContain('/banner-login.png')
    expect(img.alt).toBe('Login banner')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter web test -- AuthBanner`
Expected: FAIL with "Cannot find module './AuthBanner'"

- [ ] **Step 3: Write the implementation**

```ts
// apps/web/src/components/organisms/AuthBanner/AuthBanner.ts
export interface AuthBannerProps {
  src: string
  alt: string
}

export function createAuthBanner(props: AuthBannerProps): HTMLDivElement {
  const wrapper = document.createElement('div')
  wrapper.className = 'hidden overflow-hidden rounded-2xl md:block'

  const image = document.createElement('img')
  image.src = props.src
  image.alt = props.alt
  image.className = 'h-full w-full object-cover'

  wrapper.append(image)

  return wrapper
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter web test -- AuthBanner`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/organisms/AuthBanner
git commit -m "feat(web): add AuthBanner organism"
```

---

### Task 10: Organism — LoginForm

**Files:**
- Create: `apps/web/src/assets/arrow-forward.svg` (copy of `Ícones/SVG/arrow_forward.svg`)
- Create: `apps/web/src/assets/assignment.svg` (copy of `Ícones/SVG/assignment.svg`)
- Create: `apps/web/src/components/organisms/LoginForm/LoginForm.ts`
- Create: `apps/web/src/components/organisms/LoginForm/LoginForm.spec.ts`

**Interfaces:**
- Consumes: `createButton` (Task 2), `createCheckbox` (Task 4), `createTextInput` (Task 3), `createFormField` (Task 6), `createRememberMeRow` (Task 8), `createSocialLoginButton` (Task 7), `createLink` (Task 5)
- Produces: `createLoginForm(props?: LoginFormProps): HTMLFormElement`, `LoginFormData { identifier: string; password: string; rememberMe: boolean }`, `LoginFormProps { onSubmit?: (data: LoginFormData) => void; onGithubLogin?: () => void; onGmailLogin?: () => void }`

- [ ] **Step 1: Copy the icon assets**

```bash
cp "Ícones/SVG/arrow_forward.svg" apps/web/src/assets/arrow-forward.svg
cp "Ícones/SVG/assignment.svg" apps/web/src/assets/assignment.svg
```

- [ ] **Step 2: Write the failing test**

```ts
// apps/web/src/components/organisms/LoginForm/LoginForm.spec.ts
import { describe, expect, it, vi } from 'vitest'
import { createLoginForm } from './LoginForm'

describe('createLoginForm', () => {
  it('renders the identifier and password fields, remember-me checked by default, and the submit button', () => {
    const form = createLoginForm()

    expect(form.querySelector('#identifier')).not.toBeNull()
    expect(form.querySelector('#password')).not.toBeNull()
    expect((form.querySelector('#remember-me') as HTMLInputElement).checked).toBe(true)
    expect(form.querySelector('button[type="submit"]')?.textContent).toContain('Login')
  })

  it('submits the entered values without navigating and calls onSubmit', () => {
    const onSubmit = vi.fn()
    const form = createLoginForm({ onSubmit })

    const identifier = form.querySelector<HTMLInputElement>('#identifier')!
    const password = form.querySelector<HTMLInputElement>('#password')!
    identifier.value = 'usuario123'
    password.value = 'segredo'

    const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
    form.dispatchEvent(submitEvent)

    expect(submitEvent.defaultPrevented).toBe(true)
    expect(onSubmit).toHaveBeenCalledWith({
      identifier: 'usuario123',
      password: 'segredo',
      rememberMe: true,
    })
  })

  it('calls onGithubLogin and onGmailLogin when the respective social buttons are clicked', () => {
    const onGithubLogin = vi.fn()
    const onGmailLogin = vi.fn()
    const form = createLoginForm({ onGithubLogin, onGmailLogin })

    const socialButtons = form.querySelectorAll('button[type="button"]')
    ;(socialButtons[0] as HTMLButtonElement).click()
    ;(socialButtons[1] as HTMLButtonElement).click()

    expect(onGithubLogin).toHaveBeenCalledOnce()
    expect(onGmailLogin).toHaveBeenCalledOnce()
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm --filter web test -- LoginForm`
Expected: FAIL with "Cannot find module './LoginForm'"

- [ ] **Step 4: Write the implementation**

```ts
// apps/web/src/components/organisms/LoginForm/LoginForm.ts
import { createButton } from '../../atoms/Button/Button'
import { createCheckbox } from '../../atoms/Checkbox/Checkbox'
import { createLink } from '../../atoms/Link/Link'
import { createTextInput } from '../../atoms/TextInput/TextInput'
import { createFormField } from '../../molecules/FormField/FormField'
import { createRememberMeRow } from '../../molecules/RememberMeRow/RememberMeRow'
import { createSocialLoginButton } from '../../molecules/SocialLoginButton/SocialLoginButton'
import arrowForwardIcon from '../../../assets/arrow-forward.svg'
import assignmentIcon from '../../../assets/assignment.svg'

export interface LoginFormData {
  identifier: string
  password: string
  rememberMe: boolean
}

export interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => void
  onGithubLogin?: () => void
  onGmailLogin?: () => void
}

export function createLoginForm(props: LoginFormProps = {}): HTMLFormElement {
  const form = document.createElement('form')
  form.className = 'flex w-full flex-col gap-6'
  form.noValidate = true

  const heading = document.createElement('h1')
  heading.className = 'text-3xl font-bold text-white'
  heading.textContent = 'Login'

  const subheading = document.createElement('p')
  subheading.className = 'text-neutral-400'
  subheading.textContent = 'Boas-vindas! Faça seu login.'

  const identifierInput = createTextInput({
    id: 'identifier',
    name: 'identifier',
    placeholder: 'usuario123',
    autoComplete: 'username',
  })
  const identifierField = createFormField({ label: 'Email ou usuário', input: identifierInput })

  const passwordInput = createTextInput({
    id: 'password',
    name: 'password',
    type: 'password',
    placeholder: '******',
    autoComplete: 'current-password',
  })
  const passwordField = createFormField({ label: 'Senha', input: passwordInput })

  const rememberMeCheckbox = createCheckbox({ id: 'remember-me', name: 'rememberMe', checked: true })
  const rememberMeRow = createRememberMeRow({
    checkbox: rememberMeCheckbox,
    checkboxLabel: 'Lembrar-me',
    forgotPasswordHref: '/recuperar-senha',
  })

  const arrowIcon = document.createElement('img')
  arrowIcon.src = arrowForwardIcon
  arrowIcon.alt = ''
  arrowIcon.className = 'h-4 w-4'

  const submitButton = createButton({ label: 'Login', type: 'submit', icon: arrowIcon })

  const dividerLineLeft = document.createElement('span')
  dividerLineLeft.className = 'h-px flex-1 bg-neutral-700'
  const dividerText = document.createElement('span')
  dividerText.textContent = 'ou entre com outras contas'
  const dividerLineRight = document.createElement('span')
  dividerLineRight.className = 'h-px flex-1 bg-neutral-700'
  const divider = document.createElement('div')
  divider.className = 'flex items-center gap-4 text-sm text-neutral-500'
  divider.append(dividerLineLeft, dividerText, dividerLineRight)

  const socialLogins = document.createElement('div')
  socialLogins.className = 'flex justify-center gap-8'
  socialLogins.append(
    createSocialLoginButton({ iconSrc: '/github.png', alt: 'GitHub', label: 'Github', onClick: props.onGithubLogin }),
    createSocialLoginButton({ iconSrc: '/gmail.png', alt: 'Gmail', label: 'Gmail', onClick: props.onGmailLogin }),
  )

  const assignmentIconEl = document.createElement('img')
  assignmentIconEl.src = assignmentIcon
  assignmentIconEl.alt = ''
  assignmentIconEl.className = 'h-4 w-4'

  const signupLink = createLink({ label: 'Crie seu cadastro!', href: '/cadastro', icon: assignmentIconEl })

  const signupPromptText = document.createElement('span')
  signupPromptText.textContent = 'Ainda não tem conta? '

  const signupPrompt = document.createElement('p')
  signupPrompt.className = 'text-center text-sm text-neutral-400'
  signupPrompt.append(signupPromptText, signupLink)

  form.append(
    heading,
    subheading,
    identifierField,
    passwordField,
    rememberMeRow,
    submitButton,
    divider,
    socialLogins,
    signupPrompt,
  )

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    props.onSubmit?.({
      identifier: identifierInput.value,
      password: passwordInput.value,
      rememberMe: rememberMeCheckbox.checked,
    })
  })

  return form
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm --filter web test -- LoginForm`
Expected: PASS (3 tests)

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/assets/arrow-forward.svg apps/web/src/assets/assignment.svg apps/web/src/components/organisms/LoginForm
git commit -m "feat(web): add LoginForm organism"
```

---

### Task 11: Template — AuthLayout

**Files:**
- Create: `apps/web/src/assets/simbolo.svg` (copy of `Imagens Gerais/Símbolo.svg`)
- Create: `apps/web/src/components/templates/AuthLayout/AuthLayout.ts`
- Create: `apps/web/src/components/templates/AuthLayout/AuthLayout.spec.ts`

**Interfaces:**
- Produces: `createAuthLayout(props: AuthLayoutProps): HTMLDivElement`, `AuthLayoutProps { banner: HTMLElement; formContent: HTMLElement }`

- [ ] **Step 1: Copy the decorative mark asset**

```bash
cp "Imagens Gerais/Símbolo.svg" apps/web/src/assets/simbolo.svg
```

- [ ] **Step 2: Write the failing test**

```ts
// apps/web/src/components/templates/AuthLayout/AuthLayout.spec.ts
import { describe, expect, it } from 'vitest'
import { createAuthLayout } from './AuthLayout'

describe('createAuthLayout', () => {
  it('renders both the banner and the form content inside the card', () => {
    const banner = document.createElement('div')
    const formContent = document.createElement('div')

    const layout = createAuthLayout({ banner, formContent })

    expect(layout.contains(banner)).toBe(true)
    expect(layout.contains(formContent)).toBe(true)
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm --filter web test -- AuthLayout`
Expected: FAIL with "Cannot find module './AuthLayout'"

- [ ] **Step 4: Write the implementation**

```ts
// apps/web/src/components/templates/AuthLayout/AuthLayout.ts
import decorativeMark from '../../../assets/simbolo.svg'

export interface AuthLayoutProps {
  banner: HTMLElement
  formContent: HTMLElement
}

export function createAuthLayout(props: AuthLayoutProps): HTMLDivElement {
  const page = document.createElement('div')
  page.className = 'relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950 p-6'

  const decorationTopLeft = document.createElement('img')
  decorationTopLeft.src = decorativeMark
  decorationTopLeft.alt = ''
  decorationTopLeft.className = 'pointer-events-none absolute -left-32 -top-32 h-96 w-96 rotate-180 opacity-5'

  const decorationBottomRight = document.createElement('img')
  decorationBottomRight.src = decorativeMark
  decorationBottomRight.alt = ''
  decorationBottomRight.className = 'pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 opacity-5'

  const card = document.createElement('div')
  card.className =
    'relative z-10 grid w-full max-w-4xl gap-8 rounded-3xl border border-white/5 bg-neutral-900 p-8 shadow-2xl md:grid-cols-2'

  card.append(props.banner, props.formContent)

  page.append(decorationTopLeft, decorationBottomRight, card)

  return page
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm --filter web test -- AuthLayout`
Expected: PASS (1 test)

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/assets/simbolo.svg apps/web/src/components/templates/AuthLayout
git commit -m "feat(web): add AuthLayout template"
```

---

### Task 12: Page — LoginPage

**Files:**
- Create: `apps/web/src/components/pages/LoginPage/LoginPage.ts`
- Create: `apps/web/src/components/pages/LoginPage/LoginPage.spec.ts`

**Interfaces:**
- Consumes: `createAuthBanner` (Task 9), `createLoginForm` (Task 10), `createAuthLayout` (Task 11)
- Produces: `createLoginPage(): HTMLDivElement`

- [ ] **Step 1: Write the failing test**

```ts
// apps/web/src/components/pages/LoginPage/LoginPage.spec.ts
import { describe, expect, it } from 'vitest'
import { createLoginPage } from './LoginPage'

describe('createLoginPage', () => {
  it('renders the login banner and the login form', () => {
    const page = createLoginPage()

    expect(page.querySelector('img[alt*="Code Connect"]')).not.toBeNull()
    expect(page.querySelector('form')).not.toBeNull()
    expect(page.querySelector('h1')?.textContent).toBe('Login')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter web test -- LoginPage`
Expected: FAIL with "Cannot find module './LoginPage'"

- [ ] **Step 3: Write the implementation**

```ts
// apps/web/src/components/pages/LoginPage/LoginPage.ts
import { createAuthBanner } from '../../organisms/AuthBanner/AuthBanner'
import { createLoginForm } from '../../organisms/LoginForm/LoginForm'
import { createAuthLayout } from '../../templates/AuthLayout/AuthLayout'

export function createLoginPage(): HTMLDivElement {
  const banner = createAuthBanner({
    src: '/banner-login.png',
    alt: 'Ilustração de acesso à plataforma Code Connect',
  })
  const formContent = createLoginForm()

  return createAuthLayout({ banner, formContent })
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter web test -- LoginPage`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/pages/LoginPage
git commit -m "feat(web): add LoginPage"
```

---

### Task 13: Wire main.ts and clean up the scaffold

**Files:**
- Modify: `apps/web/src/main.ts`
- Modify: `apps/web/index.html`
- Delete: `apps/web/src/counter.ts`
- Delete: `apps/web/src/assets/typescript.svg`
- Delete: `apps/web/src/assets/vite.svg`
- Delete: `apps/web/src/assets/hero.png`

**Interfaces:**
- Consumes: `createLoginPage` (Task 12)

- [ ] **Step 1: Replace `apps/web/src/main.ts`**

```ts
import './style.css'
import { createLoginPage } from './components/pages/LoginPage/LoginPage'

document.querySelector<HTMLDivElement>('#app')!.replaceChildren(createLoginPage())
```

- [ ] **Step 2: Update the page title in `apps/web/index.html`**

Change:
```html
<title>web</title>
```
to:
```html
<title>Code Connect | Login</title>
```

- [ ] **Step 3: Delete the unused scaffold files**

```bash
rm apps/web/src/counter.ts apps/web/src/assets/typescript.svg apps/web/src/assets/vite.svg apps/web/src/assets/hero.png
```

- [ ] **Step 4: Verify the full test suite and build**

Run: `pnpm --filter web test`
Expected: All specs PASS.

Run: `pnpm --filter web build`
Expected: `tsc` + `vite build` succeed with no unused-import/unused-local errors (the deleted files are no longer referenced).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/main.ts apps/web/index.html apps/web/src/counter.ts apps/web/src/assets/typescript.svg apps/web/src/assets/vite.svg apps/web/src/assets/hero.png
git commit -m "feat(web): mount the login page and drop the vite scaffold"
```

---

### Task 14: Manual verification in the browser

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Run: `pnpm web:dev`

- [ ] **Step 2: Open the app and compare against the mockup**

Open the printed local URL (e.g. `http://localhost:5173`) and check against `Login.png`:
- Banner image with the "code connect" logo shows on the left at desktop width.
- Card: "Login" heading, "Boas-vindas! Faça seu login." subheading.
- "Email ou usuário" and "Senha" fields render with placeholders.
- "Lembrar-me" checkbox is checked by default; "Esqueci a senha" link is present.
- Green "Login →" button spans the form width.
- "ou entre com outras contas" divider, GitHub and Gmail icons with labels below.
- "Ainda não tem conta? Crie seu cadastro!" with the clipboard icon, link pointing to `/cadastro`.

- [ ] **Step 3: Check responsive behavior**

Resize the browser to a mobile width (~375px): the banner should disappear (`hidden` below `md`) and the form should take the full card width, remaining usable.

- [ ] **Step 4: Stop the dev server**

Stop the process (Ctrl+C). No commit needed for this task — if any visual issue was found, fix it in the relevant component's task and re-run its test before repeating this verification.
