export interface SocialLoginButtonProps {
  iconSrc: string
  alt: string
  label: string
  onClick?: () => void
}

export function SocialLoginButton({ iconSrc, alt, label, onClick }: SocialLoginButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-2 text-sm text-neutral-300 transition-opacity hover:opacity-80"
    >
      <img src={iconSrc} alt={alt} className="h-8 w-8" />
      <span>{label}</span>
    </button>
  )
}
