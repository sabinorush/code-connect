import type { FormEvent } from 'react'
import { Button } from '../../atoms/Button/Button'
import { Checkbox } from '../../atoms/Checkbox/Checkbox'
import { Link } from '../../atoms/Link/Link'
import { TextInput } from '../../atoms/TextInput/TextInput'
import { FormField } from '../../molecules/FormField/FormField'
import { RememberMeRow } from '../../molecules/RememberMeRow/RememberMeRow'
import { SocialLoginButton } from '../../molecules/SocialLoginButton/SocialLoginButton'
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

export function LoginForm({ onSubmit, onGithubLogin, onGmailLogin }: LoginFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    onSubmit?.({
      identifier: String(formData.get('identifier') ?? ''),
      password: String(formData.get('password') ?? ''),
      rememberMe: formData.get('rememberMe') === 'on',
    })
  }

  return (
    <form className="flex w-full flex-col gap-6" noValidate onSubmit={handleSubmit}>
      <h1 className="text-3xl font-bold text-white">Login</h1>
      <p className="text-neutral-400">Boas-vindas! Faça seu login.</p>

      <FormField
        label="Email ou usuário"
        htmlFor="identifier"
        input={<TextInput id="identifier" name="identifier" placeholder="usuario123" autoComplete="username" />}
      />

      <FormField
        label="Senha"
        htmlFor="password"
        input={
          <TextInput
            id="password"
            name="password"
            type="password"
            placeholder="******"
            autoComplete="current-password"
          />
        }
      />

      <RememberMeRow
        checkboxId="remember-me"
        checkbox={<Checkbox id="remember-me" name="rememberMe" checked />}
        checkboxLabel="Lembrar-me"
        forgotPasswordHref="/recuperar-senha"
      />

      <Button label="Login" type="submit" icon={<img src={arrowForwardIcon} alt="" className="h-4 w-4" />} />

      <div className="flex items-center gap-4 text-sm text-neutral-500">
        <span className="h-px flex-1 bg-neutral-700" />
        <span>ou entre com outras contas</span>
        <span className="h-px flex-1 bg-neutral-700" />
      </div>

      <div className="flex justify-center gap-8">
        <SocialLoginButton iconSrc="/github.png" alt="GitHub" label="Github" onClick={onGithubLogin} />
        <SocialLoginButton iconSrc="/gmail.png" alt="Gmail" label="Gmail" onClick={onGmailLogin} />
      </div>

      <p className="text-center text-sm text-neutral-400">
        <span>Ainda não tem conta? </span>
        <Link label="Crie seu cadastro!" href="/cadastro" icon={<img src={assignmentIcon} alt="" className="h-4 w-4" />} />
      </p>
    </form>
  )
}
