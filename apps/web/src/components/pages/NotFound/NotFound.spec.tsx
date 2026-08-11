import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { NotFound } from './NotFound'
import { axeConfig } from '../../../test/a11y'

describe('NotFound', () => {
  it('renders a message and a link back to login', () => {
    const { container } = render(<NotFound />)

    expect(container.textContent).toContain('Página não encontrada')
    const link = container.querySelector('a')!
    expect(link.getAttribute('href')).toBe('/login')
  })

  it('não tem violações de acessibilidade (WCAG 2.1 AA)', async () => {
    const { container } = render(<NotFound />)

    expect(await axe(container, axeConfig)).toHaveNoViolations()
  })
})
