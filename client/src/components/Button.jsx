import React from 'react'
import { Button as AntButton } from 'antd'

const Button = ({ children, className, htmlType = 'button' }) => {
  return (
    <AntButton
      htmlType={htmlType}
      className={`px-11 py-5 font-bold text-center text-white bg-sky-500 rounded-[76px] max-md:px-5 max-md:max-w-full ${className}`}
    >
      {children}
    </AntButton>
  )
}

export default Button
