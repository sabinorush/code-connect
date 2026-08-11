import type { FormEvent } from 'react'
import { Alert } from '../../atoms/Alert/Alert'
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
  email: string
  password: string
  rememberMe: boolean
}

export interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => void
  onGithubLogin?: () => void
  onGmailLogin?: () => void
  isSubmitting?: boolean
  errorMessage?: string
}

export function LoginForm({
  onSubmit,
  onGithubLogin,
  onGmailLogin,
  isSubmitting = false,
  errorMessage,
}: LoginFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    onSubmit?.({
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
      rememberMe: formData.has('rememberMe'),
    })
  }

  return (
    <form className="flex w-full flex-col gap-6" noValidate onSubmit={handleSubmit}>
      <h1 className="text-3xl font-bold text-white">Login</h1>
      <p className="text-neutral-400">Boas-vindas! Faça seu login.</p>

      {errorMessage && <Alert message={errorMessage} />}

      <FormField
        label="Email"
        htmlFor="email"
        input={
          <TextInput
            id="email"
            name="email"
            type="email"
            placeholder="Digite seu email"
            autoComplete="email"
            disabled={isSubmitting}
          />
        }
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
            disabled={isSubmitting}
          />
        }
      />

      <RememberMeRow
        checkboxId="remember-me"
        checkbox={<Checkbox id="remember-me" name="rememberMe" checked disabled={isSubmitting} />}
        checkboxLabel="Lembrar-me"
        forgotPasswordHref="/recuperar-senha"
      />

      <Button
        label={isSubmitting ? 'Entrando...' : 'Login'}
        type="submit"
        disabled={isSubmitting}
        icon={<img src={arrowForwardIcon} alt="" className="h-4 w-4" />}
      />

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
