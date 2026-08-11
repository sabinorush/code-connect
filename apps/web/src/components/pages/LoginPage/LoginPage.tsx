import { useState } from 'react'
import { useNavigate } from 'react-router'
import { AuthBanner } from '../../organisms/AuthBanner/AuthBanner'
import { LoginForm } from '../../organisms/LoginForm/LoginForm'
import type { LoginFormData } from '../../organisms/LoginForm/LoginForm'
import { AuthLayout } from '../../templates/AuthLayout/AuthLayout'
import { useAuth } from '../../../auth/useAuth'
import { getApiErrorMessage } from '../../../services/apiError'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()

  async function handleSubmit(data: LoginFormData) {
    setIsSubmitting(true)
    setErrorMessage(undefined)
    try {
      await login(data)
      navigate('/home', { replace: true })
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Não foi possível entrar. Tente novamente.'))
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      banner={<AuthBanner src="/banner-login.png" alt="Ilustração de acesso à plataforma Code Connect" />}
      formContent={<LoginForm onSubmit={handleSubmit} isSubmitting={isSubmitting} errorMessage={errorMessage} />}
    />
  )
}
