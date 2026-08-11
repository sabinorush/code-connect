import { Button } from '../../atoms/Button/Button'
import { useAuth } from '../../../auth/useAuth'

export function HomePage() {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-950 text-neutral-200">
      <h1 className="text-3xl font-bold text-white">Olá, {user?.name}</h1>
      <p className="text-neutral-400">{user?.email}</p>
      <div className="w-full max-w-xs">
        <Button label="Sair" onClick={logout} />
      </div>
    </div>
  )
}
