import { Text } from '@/components/text'
import { TextIcon } from '@/components/text-icon'
import { User } from '@/graphql/schema.types'
import { getDateColor } from '@/utils'
import { ClockCircleOutlined, DeleteOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons'
import { Button, Card, ConfigProvider, Space, Tag, Tooltip, theme } from 'antd'
import Dropdown from 'antd/es/dropdown/dropdown'
import { MenuProps } from 'antd'
import dayjs from 'dayjs'
import React, { memo, useMemo } from 'react'
import CustomAvatar from '@/components/custom-avatar'
import { useDelete, useNavigation } from '@refinedev/core'

type ProjectCardProps = {
    id: string,
    title: string,
    updatedAt: string,
    dueDate?: string,
    users?: {
        id: string,
        name: string,
        avatarUrl?: User['avatarUrl']
    }[]
}

const ProjectCard = ({ id, title, dueDate, users }: ProjectCardProps) => {

    const { token } = theme.useToken()

    const { edit } = useNavigation()

    const { mutate: deleteMutate } = useDelete()

    const dropDownItems = useMemo(() => {
        const dropdownItemsHelper: MenuProps['items'] = [
            {
                label: 'View card',
                key: '1',
                icon: <EyeOutlined />,
                onClick: () => {
                    edit('tasks', id, 'replace')
                }
            },
            {
                danger: true,
                label: 'Delete card',
                key: '2',
                onClick: () => {
                    deleteMutate({
                        resource: 'tasks',
                        id,
                        meta: {
                            operation: 'task'
                        }
                    }
                    )
                },
                icon: <DeleteOutlined />
            }
        ]

        return dropdownItemsHelper
    }, [])

    const dueDateOptions = useMemo(() => {
        if (!dueDate) return null

        const date = dayjs(dueDate)

        return {
            color: getDateColor({ date: dueDate }) as string,
            text: date.format('MMM DD')
        }

    }, [dueDate])

    return (
        <ConfigProvider
            theme={{

                components: {
                    Tag: {
                        colorText: token.colorTextSecondary,
                    },
                    Card: {
                        headerBg: 'transparent',
                    }
                }
            }}
        >
            <Card
                size="small"
                title={<Text
                    ellipsis={{ tooltip: title }}
                >{title}</Text>}
                onClick={() => edit('tasks', id, 'replace')}
                extra={
                    <Dropdown
                        trigger={["click"]}
                        menu={{
                            items: dropDownItems,
                            onPointerDown : (e) =>{
                                e.stopPropagation()
                            },
                            onClick : (e) =>{
                                e.domEvent.stopPropagation()
                            }
                        }}
                        placement='bottom'
                        arrow={{ pointAtCenter: true }}
                    >
                        <Button
                            type="text"
                            shape="circle"
                            icon={
                                <MoreOutlined />
                            }
                            style={{
                                transform: 'rotate(90deg)'
                            }}
                            onPointerDown={(e) => {
                                e.stopPropagation() //stop other things. only click on this button will work.
                            }}
                            onClick={(e) => {
                                e.stopPropagation() //stop other things. only click on this button will work.
                            }}
                        ></Button>
                    </Dropdown>
                }
            >
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >

                    <TextIcon style={{ marginRight: '4px' }} />
                    {dueDateOptions &&

                        (

                            <Tag
                                icon={
                                    <ClockCircleOutlined />
                                }
                                style={{
                                    padding: '0 4px',
                                    backgroundColor: dueDateOptions.color === 'default' ? 'transparent' : 'unset',
                                }}
                                color={dueDateOptions.color}
                                bordered={dueDateOptions.color !== 'default'}
                            >
                                {dueDateOptions.text}
                            </Tag>
                        )

                    }
                    {
                        !!users?.length &&
                        (
                            <Space
                                size={4}
                                wrap
                                direction='horizontal'
                                align="center"
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    marginLeft: 'auto',
                                    marginRight: 0

                                }}
                            >
                                {
                                    users.map((user) =>
                                    (
                                        <Tooltip key={user.id} title={user.name}>
                                            <CustomAvatar name={user.name} src={user.avatarUrl} />
                                        </Tooltip>
                                    ))
                                }
                            </Space>
                        )
                    }
                </div>

            </Card>


        </ConfigProvider>
    )
}

export default ProjectCard

//we are memoising ProjectCard compoennt
export const ProjectCardMemo = memo(ProjectCard, (prev, next) => {
    return (
        prev.id === next.id &&
        prev.title === next.title &&
        prev.dueDate === next.dueDate &&
        prev.users?.length === next.users?.length &&
        prev.updatedAt === next.updatedAt
    )
})
