import React from 'react'
import { Typography } from 'antd'

const { Link: AntLink } = Typography

const Link = ({ href, children }) => {
  return (
    <AntLink href={href} className='text-white'>
      {children}
    </AntLink>
  )
}

export default Link
