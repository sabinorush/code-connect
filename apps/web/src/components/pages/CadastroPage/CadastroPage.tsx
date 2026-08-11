import { useState } from 'react'
import { useNavigate } from 'react-router'
import { AuthBanner } from '../../organisms/AuthBanner/AuthBanner'
import { CadastroForm } from '../../organisms/CadastroForm/CadastroForm'
import type { CadastroFormData } from '../../organisms/CadastroForm/CadastroForm'
import { AuthLayout } from '../../templates/AuthLayout/AuthLayout'
import { useAuth } from '../../../auth/useAuth'
import { getApiErrorMessage } from '../../../services/apiError'

export function CadastroPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()

  async function handleSubmit(data: CadastroFormData) {
    setIsSubmitting(true)
    setErrorMessage(undefined)
    try {
      await register(data)
      navigate('/home', { replace: true })
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Não foi possível criar sua conta. Tente novamente.'))
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      banner={<AuthBanner src="/banner-cadastro.png" alt="Ilustração de cadastro na plataforma Code Connect" />}
      formContent={<CadastroForm onSubmit={handleSubmit} isSubmitting={isSubmitting} errorMessage={errorMessage} />}
    />
  )
}
