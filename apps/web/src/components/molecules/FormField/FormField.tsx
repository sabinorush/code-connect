import type { ReactNode } from 'react'

export interface FormFieldProps {
  label: string
  htmlFor: string
  input: ReactNode
}

export function FormField({ label, htmlFor, input }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-lg text-neutral-200">
        {label}
      </label>
      {input}
    </div>
  )
}
