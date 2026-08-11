import { describe, expect, it } from 'vitest'
import { createRememberMeRow } from './RememberMeRow'
import { createCheckbox } from '../../atoms/Checkbox/Checkbox'

describe('createRememberMeRow', () => {
  it('renders the checkbox with its label and the forgot-password link', () => {
    const checkbox = createCheckbox({ id: 'remember-me', name: 'rememberMe', checked: true })
    const row = createRememberMeRow({
      checkbox,
      checkboxLabel: 'Lembrar-me',
      forgotPasswordHref: '/recuperar-senha',
    })

    expect(row.contains(checkbox)).toBe(true)
    expect(row.textContent).toContain('Lembrar-me')

    const link = row.querySelector('a')!
    expect(link.textContent).toContain('Esqueci a senha')
    expect(link.getAttribute('href')).toBe('/recuperar-senha')
  })
})
