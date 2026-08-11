import { describe, expect, it } from 'vitest'
import { createAuthLayout } from './AuthLayout'

describe('createAuthLayout', () => {
  it('renders both the banner and the form content inside the card', () => {
    const banner = document.createElement('div')
    const formContent = document.createElement('div')

    const layout = createAuthLayout({ banner, formContent })

    expect(layout.contains(banner)).toBe(true)
    expect(layout.contains(formContent)).toBe(true)
  })
})
