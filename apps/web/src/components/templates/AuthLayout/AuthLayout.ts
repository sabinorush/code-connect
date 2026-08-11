import decorativeMark from '../../../assets/simbolo.svg'

export interface AuthLayoutProps {
  banner: HTMLElement
  formContent: HTMLElement
}

export function createAuthLayout(props: AuthLayoutProps): HTMLDivElement {
  const page = document.createElement('div')
  page.className = 'relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950 p-6'

  const decorationTopLeft = document.createElement('img')
  decorationTopLeft.src = decorativeMark
  decorationTopLeft.alt = ''
  decorationTopLeft.className = 'pointer-events-none absolute -left-32 -top-32 h-96 w-96 rotate-180 opacity-5'

  const decorationBottomRight = document.createElement('img')
  decorationBottomRight.src = decorativeMark
  decorationBottomRight.alt = ''
  decorationBottomRight.className = 'pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 opacity-5'

  const card = document.createElement('div')
  card.className =
    'relative z-10 grid w-full max-w-4xl gap-8 rounded-3xl border border-white/5 bg-neutral-900 p-8 shadow-2xl md:grid-cols-2'

  card.append(props.banner, props.formContent)

  page.append(decorationTopLeft, decorationBottomRight, card)

  return page
}
