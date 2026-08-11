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
