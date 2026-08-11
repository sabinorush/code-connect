export interface AuthBannerProps {
  src: string
  alt: string
}

export function AuthBanner({ src, alt }: AuthBannerProps) {
  return (
    <div className="hidden overflow-hidden rounded-2xl md:block">
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    </div>
  )
}
