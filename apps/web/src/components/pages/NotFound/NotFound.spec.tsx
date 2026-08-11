import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { NotFound } from './NotFound'

describe('NotFound', () => {
  it('renders a message and a link back to login', () => {
    const { container } = render(<NotFound />)

    expect(container.textContent).toContain('Página não encontrada')
    const link = container.querySelector('a')!
    expect(link.getAttribute('href')).toBe('/login')
  })
})
