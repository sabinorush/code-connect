import { describe, expect, it } from 'vitest'
import { createLink } from './Link'

describe('createLink', () => {
  it('renders an anchor with the given label and href', () => {
    const link = createLink({ label: 'Esqueci a senha', href: '/recuperar-senha' })

    expect(link.tagName).toBe('A')
    expect(link.getAttribute('href')).toBe('/recuperar-senha')
    expect(link.textContent).toContain('Esqueci a senha')
  })

  it('appends an optional trailing icon', () => {
    const icon = document.createElement('img')
    icon.alt = 'icon'
    const link = createLink({ label: 'Crie seu cadastro!', href: '/cadastro', icon })

    expect(link.contains(icon)).toBe(true)
  })
})
