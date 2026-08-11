import type { FormEvent } from 'react'
import { Button } from '../../atoms/Button/Button'
import { Checkbox } from '../../atoms/Checkbox/Checkbox'
import { Link } from '../../atoms/Link/Link'
import { TextInput } from '../../atoms/TextInput/TextInput'
import { FormField } from '../../molecules/FormField/FormField'
import { RememberMeRow } from '../../molecules/RememberMeRow/RememberMeRow'
import { SocialLoginButton } from '../../molecules/SocialLoginButton/SocialLoginButton'
import arrowForwardIcon from '../../../assets/arrow-forward.svg'
import loginIcon from '../../../assets/login.svg'

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

export function CadastroForm({ onSubmit, onGithubLogin, onGmailLogin }: CadastroFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    onSubmit?.({
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
      rememberMe: formData.has('rememberMe'),
    })
  }

  return (
    <form className="flex w-full flex-col gap-6" noValidate onSubmit={handleSubmit}>
      <h1 className="text-3xl font-bold text-white">Cadastro</h1>
      <p className="text-neutral-400">Olá! Preencha seus dados.</p>

      <FormField
        label="Nome"
        htmlFor="name"
        input={<TextInput id="name" name="name" placeholder="Nome completo" autoComplete="name" />}
      />

      <FormField
        label="Email"
        htmlFor="email"
        input={
          <TextInput id="email" name="email" type="email" placeholder="Digite seu email" autoComplete="email" />
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
            autoComplete="new-password"
          />
        }
      />

      <RememberMeRow
        checkboxId="remember-me"
        checkbox={<Checkbox id="remember-me" name="rememberMe" checked />}
        checkboxLabel="Lembrar-me"
      />

      <Button label="Cadastrar" type="submit" icon={<img src={arrowForwardIcon} alt="" className="h-4 w-4" />} />

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
        <span>Já tem conta? </span>
        <Link label="Faça seu login!" href="/login" icon={<img src={loginIcon} alt="" className="h-4 w-4" />} />
      </p>
    </form>
  )
}
