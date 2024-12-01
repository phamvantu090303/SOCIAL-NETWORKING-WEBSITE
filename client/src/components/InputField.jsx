import { Input } from 'antd'

const InputField = ({ type, placeholder, className, 'aria-label': ariaLabel }) => {
  return (
    <Input
      type={type}
      placeholder={placeholder}
      aria-label={ariaLabel}
      className={`px-5 py-6 bg-white rounded-md border border-solid border-black border-opacity-20 text-black text-opacity-60 max-md:max-w-full ${className}`}
    />
  )
}

export default InputField
