import { AuthBanner } from '../../organisms/AuthBanner/AuthBanner'
import { LoginForm } from '../../organisms/LoginForm/LoginForm'
import { AuthLayout } from '../../templates/AuthLayout/AuthLayout'

export function LoginPage() {
  return (
    <AuthLayout
      banner={<AuthBanner src="/banner-login.png" alt="Ilustração de acesso à plataforma Code Connect" />}
      formContent={<LoginForm />}
    />
  )
}
