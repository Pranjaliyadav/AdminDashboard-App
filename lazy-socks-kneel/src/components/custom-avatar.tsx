import React from 'react'
import { Avatar as AntdAvatar } from 'antd'
import Item from 'antd/es/list/Item'
import { AvatarProps } from 'antd/lib'

type Props = AvatarProps &{
    name : string
}
export const CustomAvatar = ({name, style, ...rest} : Props) => {
  return (
    <>
    <AntdAvatar
    alt={'Pranjali Yadav'}
    size="small"
    style={{background : '#87d068', display : 'flex', alignItems : 'center', border : 'none'}}
    >{name}</AntdAvatar>
    </>
  )
}
