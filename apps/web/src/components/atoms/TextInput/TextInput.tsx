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
      className="w-full rounded bg-gray-medium px-4 py-2 text-sm text-gray-dark placeholder:text-gray-dark focus:outline-none focus:ring-2 focus:ring-green-400"
    />
  )
}
