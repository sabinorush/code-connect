import type { ReactNode } from 'react'
import { Link } from '../../atoms/Link/Link'

export interface RememberMeRowProps {
  checkboxId: string
  checkbox: ReactNode
  checkboxLabel: string
  forgotPasswordHref: string
}

export function RememberMeRow({ checkboxId, checkbox, checkboxLabel, forgotPasswordHref }: RememberMeRowProps) {
  return (
    <div className="flex items-center justify-between text-sm">
      <label htmlFor={checkboxId} className="flex items-center gap-2 text-neutral-200">
        {checkbox}
        <span>{checkboxLabel}</span>
      </label>
      <Link label="Esqueci a senha" href={forgotPasswordHref} />
    </div>
  )
}
