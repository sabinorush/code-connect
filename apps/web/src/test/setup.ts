import { afterAll, afterEach, beforeAll, expect } from 'vitest'
import { cleanup } from '@testing-library/react'
import { toHaveNoViolations } from 'jest-axe'
import '@testing-library/jest-dom/vitest'
import { server } from './msw/server'

expect.extend(toHaveNoViolations)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

afterEach(() => {
  cleanup()
  server.resetHandlers()
  localStorage.clear()
  sessionStorage.clear()
})

afterAll(() => server.close())
