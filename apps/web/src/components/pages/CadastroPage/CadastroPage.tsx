import { AuthBanner } from '../../organisms/AuthBanner/AuthBanner'
import { CadastroForm } from '../../organisms/CadastroForm/CadastroForm'
import { AuthLayout } from '../../templates/AuthLayout/AuthLayout'

export function CadastroPage() {
  return (
    <AuthLayout
      banner={<AuthBanner src="/banner-cadastro.png" alt="Ilustração de cadastro na plataforma Code Connect" />}
      formContent={<CadastroForm />}
    />
  )
}
