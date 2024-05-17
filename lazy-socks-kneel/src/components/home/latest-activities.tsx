import { UnorderedListOutlined } from '@ant-design/icons'
import { Card, List, Space } from 'antd'
import React from 'react'
import { Text } from '../text'
import LatestActivitiesSkeleton from '../skeleton/latest-activities'
import { useList } from '@refinedev/core'
import { DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY, DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY } from '@/graphql/queries'
import dayjs from 'dayjs'
import CustomAvatar from '../custom-avatar'
import { stringify } from 'querystring'

const LatestActivities = () => {

    //get all audits
    const { data: audit, isLoading: isLoadingAudit, isError, error } = useList({
        resource: 'audits',
        meta: {
            gqlQuery: DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY
        }
    })
    const dealIds = audit?.data?.map((audit: any) => audit?.targetId)

    //get all deals
    const { data: deals, isLoading: isLoadingDeals } = useList({
        resource: 'deals',
        queryOptions: { enabled: !!dealIds?.length },
        pagination: {
            mode: 'off'
        },
        filters: [{ field: 'id', operator: 'in', value: dealIds }],
        meta: {
            gqlQuery: DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY
        }
    })
    const isLoading = isLoadingAudit || isLoadingDeals
    if (isError) {
        console.log(error)
        return error
    }

    return (
        <Card
            headStyle={{ padding: '16px' }}
            bodyStyle={{ padding: '0 1rem' }}
            title={(
                <div
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}

                >
                    <UnorderedListOutlined />
                    <Text
                        size="sm"
                        style={{ marginLeft: '0.5rem' }}
                    >Latest Activities</Text>

                </div>
            )}
        >
            {
                isLoading
                    ?
                    (<List
                        itemLayout='horizontal'
                        dataSource={Array.from({ length: 5 })
                            .map((_, i) => ({
                                id: i
                            }))}
                        renderItem={(_, index) => (
                            <LatestActivitiesSkeleton key={index} />
                        )}
                    />)
                    :
                    (<List
                        itemLayout="horizontal"
                        dataSource={audit?.data}
                        renderItem={(item) => {
                            //use all audits and deals together
                            const deal = deals?.data.find((deal => deal.id == item.targetId) || undefined)
                            return (
                                <List.Item>
                                    <List.Item.Meta
                                        title={dayjs(deal?.createdAt).format('MMM DD, YYYY - HH:mm')}
                                        avatar={
                                            <CustomAvatar
                                                shape="square"
                                                size={48}
                                                src={deal?.company.avatarUrl}
                                                name={deal?.company.name}
                                            />
                                        }
                                        description={
                                            <Space
                                                size={4}
                                            >

                                                <Text strong >{item.user?.name}</Text>
                                                <Text>{item.action === 'CREATE' ? 'created' : 'moved'}</Text>
                                                <Text strong>{deal?.title}</Text>
                                                <Text>deal</Text>
                                                <Text>{item.action === 'CREATE' ? 'in' : 'to'}</Text>
                                                <Text strong>{deal?.stage?.title}</Text>
                                            </Space>
                                        }

                                    />

                                </List.Item>
                            )
                        }}

                    />)
            }

        </Card>
    )
}

export default LatestActivities
