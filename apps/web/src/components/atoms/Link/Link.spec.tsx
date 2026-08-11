import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { Link } from './Link'

describe('Link', () => {
  it('renders an anchor with the given label and href', () => {
    const { container } = render(<Link label="Esqueci a senha" href="/recuperar-senha" />)
    const link = container.querySelector('a')!

    expect(link.getAttribute('href')).toBe('/recuperar-senha')
    expect(link.textContent).toContain('Esqueci a senha')
  })

  it('renders an optional trailing icon', () => {
    const { container } = render(
      <Link label="Crie seu cadastro!" href="/cadastro" icon={<img alt="icon" />} />,
    )
    const link = container.querySelector('a')!

    expect(link.querySelector('img[alt="icon"]')).not.toBeNull()
  })
})
