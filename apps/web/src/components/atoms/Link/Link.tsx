import type { ReactNode } from 'react'

export interface LinkProps {
  label: string
  href: string
  icon?: ReactNode
}

export function Link({ label, href, icon }: LinkProps) {
  return (
    <a href={href} className="inline-flex items-center gap-1 text-green-400 hover:text-green-300 hover:underline">
      <span>{label}</span>
      {icon}
    </a>
  )
}
