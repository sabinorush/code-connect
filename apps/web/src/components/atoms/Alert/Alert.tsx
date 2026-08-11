export interface AlertProps {
  message: string
}

export function Alert({ message }: AlertProps) {
  return (
    <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
      {message}
    </p>
  )
}
