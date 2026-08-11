import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { AuthBanner } from './AuthBanner'

describe('AuthBanner', () => {
  it('renders the banner image with the given src and alt', () => {
    const { container } = render(<AuthBanner src="/banner-login.png" alt="Login banner" />)
    const img = container.querySelector('img')!

    expect(img.src).toContain('/banner-login.png')
    expect(img.alt).toBe('Login banner')
  })
})
