export interface TextInputProps {
  id: string
  name: string
  type?: string
  placeholder?: string
  autoComplete?: string
}

export function TextInput({ id, name, type = 'text', placeholder, autoComplete }: TextInputProps) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      autoComplete={autoComplete}
      className="w-full rounded bg-[#888888] px-4 py-2 text-[15px] text-[#171d1f] placeholder:text-[#171d1f] focus:outline-none focus:ring-2 focus:ring-green-400"
    />
  )
}
