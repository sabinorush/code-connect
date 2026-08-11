export interface TextInputProps {
  id: string
  name: string
  type?: string
  placeholder?: string
  autoComplete?: string
  disabled?: boolean
}

export function TextInput({ id, name, type = 'text', placeholder, autoComplete, disabled = false }: TextInputProps) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      autoComplete={autoComplete}
      disabled={disabled}
      className="w-full rounded bg-gray-medium px-4 py-2 text-sm text-gray-dark placeholder:text-gray-dark focus:outline-none focus:ring-2 focus:ring-green-400 disabled:cursor-not-allowed disabled:opacity-60"
    />
  )
}
