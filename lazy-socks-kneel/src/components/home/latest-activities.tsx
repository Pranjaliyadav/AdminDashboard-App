import { UnorderedListOutlined } from '@ant-design/icons'
import { Card, List } from 'antd'
import React from 'react'
import { Text } from '../text'
import LatestActivitiesSkeleton from '../skeleton/latest-activities'
import { useList } from '@refinedev/core'
import { DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY, DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY } from '@/graphql/queries'

const LatestActivities = () => {

    const isLoading = false
    const { data: audit, isLoading: isLoadingAudit, isError, error } = useList({
        resource: 'audits',
        meta: {
            gqlQuery: DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY
        }
    })

    const dealIds = audit?.data?.map((audit: any) => audit?.targetId)
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
                    (<List />)
            }

        </Card>
    )
}

export default LatestActivities
