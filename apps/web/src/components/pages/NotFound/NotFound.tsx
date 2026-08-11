import { Link } from '../../atoms/Link/Link'

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-950 text-neutral-200">
      <p className="text-xl">Página não encontrada</p>
      <Link label="Voltar para o login" href="/login" />
    </div>
  )
}
