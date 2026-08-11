import type { ReactNode } from 'react'

export interface ButtonProps {
  label: string
  type?: 'button' | 'submit'
  icon?: ReactNode
  onClick?: () => void
}

export function Button({ label, type = 'button', icon, onClick }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-400 px-4 py-3 font-semibold text-neutral-950 transition-colors hover:bg-green-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
    >
      <span>{label}</span>
      {icon}
    </button>
  )
}
