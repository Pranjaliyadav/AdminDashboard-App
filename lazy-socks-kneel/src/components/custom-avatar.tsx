import React from 'react'
import { Avatar as AntdAvatar } from 'antd'
import Item from 'antd/es/list/Item'
import { AvatarProps } from 'antd/lib'
import { getNameInitials } from '@/utils'

type Props = AvatarProps & {
  name: string
}
const CustomAvatar = ({ name, style, ...rest }: Props) => {
  return (
    <>
      <AntdAvatar
        alt={name}
        size="small"
        style={{ background: '#87d068', display: 'flex', alignItems: 'center', border: 'none', ...style }}
        {...rest}
      >{getNameInitials(name || '')}</AntdAvatar>
    </>
  )
}

export default CustomAvatar