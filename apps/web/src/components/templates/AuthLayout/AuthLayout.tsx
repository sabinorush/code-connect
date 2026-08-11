import type { ReactNode } from 'react'
import decorativeMark from '../../../assets/simbolo.svg'

export interface AuthLayoutProps {
  banner: ReactNode
  formContent: ReactNode
}

export function AuthLayout({ banner, formContent }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950 p-6">
      <img
        src={decorativeMark}
        alt=""
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rotate-180 opacity-5"
      />
      <img
        src={decorativeMark}
        alt=""
        className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 opacity-5"
      />
      <div className="relative z-10 grid w-full max-w-4xl gap-8 rounded-3xl border border-white/5 bg-neutral-900 p-8 shadow-2xl md:grid-cols-2">
        {banner}
        {formContent}
      </div>
    </div>
  )
}
