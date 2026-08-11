import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { AuthProvider } from '../auth/AuthProvider'

export interface RenderWithProvidersOptions {
  initialEntries?: string[]
}

// Wraps a tree in the same providers main.tsx does (router + auth), for
// components that call useNavigate/useAuth and would otherwise throw
// when rendered bare.
export function renderWithProviders(ui: ReactElement, { initialEntries = ['/'] }: RenderWithProvidersOptions = {}) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>,
  )
}
