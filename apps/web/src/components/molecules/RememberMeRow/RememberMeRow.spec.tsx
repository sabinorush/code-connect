import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { RememberMeRow } from './RememberMeRow'
import { Checkbox } from '../../atoms/Checkbox/Checkbox'

describe('RememberMeRow', () => {
  it('renders the checkbox with its label and the forgot-password link', () => {
    const { container } = render(
      <RememberMeRow
        checkboxId="remember-me"
        checkbox={<Checkbox id="remember-me" name="rememberMe" checked />}
        checkboxLabel="Lembrar-me"
        forgotPasswordHref="/recuperar-senha"
      />,
    )

    expect(container.textContent).toContain('Lembrar-me')
    expect(container.querySelector('#remember-me')).not.toBeNull()

    const link = container.querySelector('a')!
    expect(link.textContent).toContain('Esqueci a senha')
    expect(link.getAttribute('href')).toBe('/recuperar-senha')
  })
})
