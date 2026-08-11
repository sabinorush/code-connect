import { describe, expect, it } from 'vitest'
import { createAuthBanner } from './AuthBanner'

describe('createAuthBanner', () => {
  it('renders the banner image with the given src and alt', () => {
    const banner = createAuthBanner({ src: '/banner-login.png', alt: 'Login banner' })

    const img = banner.querySelector('img')!
    expect(img.src).toContain('/banner-login.png')
    expect(img.alt).toBe('Login banner')
  })
})
