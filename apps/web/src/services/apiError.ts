import axios from 'axios'

interface ApiErrorBody {
  message?: string | string[]
}

// apps/api's ValidationPipe reports 400s as an array of messages, while
// hand-thrown exceptions (401, 409) use a single string — see
// apps/api/src/common/dto/error-response.dto.ts. Normalize both into one
// user-facing, pt-BR message.
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) {
    return fallback
  }

  if (!error.response) {
    return 'Não foi possível conectar ao servidor.'
  }

  const { status, data } = error.response
  const body = data as ApiErrorBody | undefined

  switch (status) {
    case 401:
      return 'Email ou senha inválidos.'
    case 409:
      return 'Este email já está cadastrado.'
    case 400: {
      const message = body?.message
      if (Array.isArray(message)) return message.join(' ')
      if (typeof message === 'string') return message
      return fallback
    }
    default:
      return status >= 500 ? 'Erro no servidor. Tente novamente.' : fallback
  }
}
