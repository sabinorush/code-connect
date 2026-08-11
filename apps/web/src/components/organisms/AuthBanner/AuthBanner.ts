export interface AuthBannerProps {
  src: string
  alt: string
}

export function createAuthBanner(props: AuthBannerProps): HTMLDivElement {
  const wrapper = document.createElement('div')
  wrapper.className = 'hidden overflow-hidden rounded-2xl md:block'

  const image = document.createElement('img')
  image.src = props.src
  image.alt = props.alt
  image.className = 'h-full w-full object-cover'

  wrapper.append(image)

  return wrapper
}
