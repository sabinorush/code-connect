declare module 'jest-axe' {
  import type { AxeResults, RunOptions } from 'axe-core'

  export function axe(html: Element | string, options?: RunOptions): Promise<AxeResults>

  export const toHaveNoViolations: Record<
    string,
    (received: unknown) => { pass: boolean; message: () => string }
  >
}
